import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import type { Member } from '@/types/types';
import type { MemberDTO, UpdateMemberDTO } from './DTO/MemberDTO';

@Injectable()
export class MembersService {
    constructor(private readonly prisma: PrismaService) { };
    getMembersAll = async () => {
        const membersAll = await this.prisma.users.findMany({
            where: {
                role: UserRole.MEMBER,
                deletedAt: null,
            }
        });
        return membersAll;
    }
    getMembersForParent = async (
        parentId: string,
    ): Promise<Member[]> => {
        const members = await this.prisma.users.findMany({
            where: {
                isActive: true,
                memberLinks: {
                    some: {
                        parentId,
                    },
                },
            },
            include: {
                memberLinks: {
                    where: {
                        parentId,
                    },
                    include: {
                        interests: true,
                    },
                },
            },
        });

         return members.map(member => this.mapMemberToDto(member, parentId));
    };
    getMembersById = async (membersId: string) => {
        const member = await this.prisma.users.findFirst({
            where: {
                id: membersId,
                role: UserRole.MEMBER,
                isActive: true,
            },
            include: {
                memberLinks: {
                    select: {
                        grade: true,
                        interests: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
            }
        });
        return member ? this.mapMemberToDto(member) : null;
    }
    updateMemberById = async (memberId: string, data: UpdateMemberDTO,) => {
        return this.prisma.$transaction(async (tx) => {

            const member = await tx.users.findUnique({
                where: { id: memberId },
                include: {
                    memberLinks: true,
                },
            });

            if (!member) {
                throw new Error("Member not found");
            }

            // Update Users
            await tx.users.update({
                where: { id: memberId },
                data: {
                    full_name: data.name,
                    gender: data.gender?.toUpperCase() === "MALE" ? "MALE" : "FEMALE",
                },
            });

            // Update FamilyMember
            if (member.memberLinks.length > 0) {
                await tx.familyMember.update({
                    where: {
                        id: member.memberLinks[0].id,
                    },
                    data: {
                        grade: data.grade,
                        interests: {
                            set: [],
                            connectOrCreate: (data.interest ?? []).map(name => ({
                                where: { name },
                                create: { name },
                            })),
                        },
                    },
                });
            }

            return "Member updated";
        });
    };
    addMembers = async (parentId: string, data: MemberDTO) => {
        const [parent, memberCount] = await Promise.all([
            this.prisma.users.findUnique({
                where: { id: parentId },
                select: {
                    id: true,
                    full_name: true,
                },
            }),

            this.prisma.familyMember.count({
                where: { parentId },
            }),
        ]);

        if (!parent) {
            throw new Error("Parent not found");
        }

        // Generate email and password for the new member
        const index = memberCount + 1;
        const firstName = data.name ?? "member";
        const randomNumber = Math.floor(1000 + Math.random() * 9000);

        const email = `${firstName.toUpperCase()}.member${index}@member.local`;

        const password = `parent.${parent.full_name.split(" ")[0]}_member${randomNumber}`;

        const member = await this.prisma.$transaction(async (tx) => {
            const member = await tx.users.create({
                data: {
                    full_name: data.name,
                    username: firstName,
                    email,
                    password_hash: password,
                    gender:
                        data.gender?.toUpperCase() === "MALE"
                            ? "MALE"
                            : "FEMALE",
                    role: UserRole.MEMBER,
                },
            });

            await tx.familyMember.create({
                data: {
                    parentId,
                    memberId: member.id,
                    grade: data.grade,
                    interests: {
                        connectOrCreate: data.interest.map((name: string) => ({
                            where: { name },
                            create: { name },
                        })),
                    },
                },
            });

            return member;
        });

        return {
            id: member.id,
            full_name: member.full_name,
            username: member.username,
            email,
            password,
        };
    };

    deleteMembersById = async (memberId: string) => {
        return this.prisma.$transaction(async (tx) => {
            // Kiểm tra Member
            const member = await tx.users.findUnique({
                where: {
                    id: memberId,
                    role: UserRole.MEMBER,
                },
                select: {
                    full_name: true,
                },
            });

            if (!member) {
                throw new Error("Member not found");
            }

            // Nếu AuditLog không dùng onDelete: Cascade hoặc SetNull
            await tx.auditLog.deleteMany({
                where: {
                    userId: memberId,
                },
            });

            // Xóa User
            // Database sẽ tự Cascade:
            // - Notification
            // - FamilyMember
            //   - MemberInterest
            // - Task
            //   - TaskAttachment
            //   - TaskQuestion
            //     - QuestionOption
            //   - Submission
            //     - SubmissionAnswer
            //     - SubmissionAttachment
            //     - AIAnalysis
            await tx.users.delete({
                where: {
                    id: memberId,
                },
            });

            return {
                message: `Member "${member.full_name}" deleted successfully.`,
            };
        });
    };
    deleteMembersByIdSoft = async (membersId: string) => {
        const member = await this.getMembersById(membersId);
        await this.prisma.users.update({
            where: {
                id: membersId,
            }, data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
        return "Member deleted (soft): " + member;
    }

private mapMemberToDto(member: any, parentId?: string): Member {
    const link = member.memberLinks?.[0];

    return {
        id: member.id,
        name: member.full_name,
        gender: member.gender!,
        grade: link?.grade || "",
        interest: link?.interests?.map((i: any) => i.name).join(", ") || "",
        username: member.username ?? "",
        password: member.password_hash ?? "",
        parentId: parentId ?? link?.parentId,
    };
}
}