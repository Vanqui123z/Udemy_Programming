import { Injectable } from '@nestjs/common';
import { SubmitTaskDTO, TaskDTO, UpdateTaskStatusDTO } from './DTO/TaskDTO';
import { PrismaService } from '@/prisma/prisma.service';
import { TaskStatus, SubmissionStatus, Prisma, QuestionOption } from '@prisma/client';
import { getUTCDateRange } from '@/helper/getUTCDateRange';

@Injectable()
export class TaskService {
    constructor(private readonly prisma: PrismaService) { }

    addTask = async (taskData: TaskDTO, parentId: string) => {
        return await this.prisma.$transaction(async (tx) => {
            const task = await tx.task.create({
                data: {
                    parentId,
                    title: taskData.title,
                    note: taskData.note,
                    dueAt: taskData.dueAt ? new Date(taskData.dueAt) : null,
                    duration: taskData.duration,
                    aiGenerated: taskData.aiGenerated ?? false,
                    assignments: taskData.memberIds?.length ? {
                        create: taskData.memberIds.map((memberId) => ({
                            memberId,
                        })),
                    }
                        : undefined,

                    attachments: taskData.attachmentIds?.length ? {
                        create: taskData.attachmentIds.map((attachmentId) => ({
                            attachmentId,

                        })),
                    }
                        : undefined,

                    questions: taskData.questions?.length ? {
                        create: taskData.questions.map((q) => ({
                            questionNo: q.questionNo,
                            questionType: q.questionType,
                            content: q.content,
                            correctAnswer: q.correctAnswer,
                            explanation: q.explanation,
                            score: q.score ?? 1,

                            options: q.options?.length
                                ? {
                                    create: q.options.map((o) => ({
                                        optionKey: o.optionKey,
                                        optionContent: o.optionContent,
                                        isCorrect: o.isCorrect ?? false,
                                    })),
                                }
                                : undefined,
                        })),
                    }
                        : undefined,
                },

                include: {
                    assignments: true,
                    attachments: true,
                    questions: {
                        include: {
                            options: true,
                        },
                    },
                },
            });

            return task;
        });
    };
    async updateTask(taskId: string,dto: TaskDTO) {
        return this.prisma.$transaction(async (tx) => {

            await this.updateTaskInfo(tx, taskId, dto);

            await this.syncAssignments(tx, taskId, dto.memberIds ?? []);

            await this.syncAttachments(tx, taskId, dto.attachmentIds ?? []);

            await this.syncQuestions(tx, taskId, dto.questions ?? []);

        });
    }
    deleteTask = async (taskId: string) => {
        return await this.prisma.task.update({
            where: { id: taskId },
            data: {
                deletedAt: new Date(),
            },
        });
    };
    moveTask = async (taskId: string, newDate: string) => {
        return await this.prisma.task.update({
            where: {
                id: taskId,
            },
            data: {
                dueAt: new Date(newDate),
            },
        });
    };
    async updateStatus(taskId: string, user: any, data: UpdateTaskStatusDTO) {
        const assignment = await this.prisma.taskAssignment.findUnique({
            where: {
                taskId_memberId: {
                    taskId,
                    memberId: user.id,
                },
            },
        });

        if (!assignment) {
            return {
                message: 'Assignment not found',
                data: null,
            };
        }

        let newStatus = data.status;
        let message = '';

        //user chỉ được phép update status thành viewed nếu chưa có status nào, hoặc completed nếu đã viewed
        if (user.role === 'MEMBER') {
            if (!data.status) {
                newStatus = TaskStatus.VIEWED;
                message = 'Task viewed';
            }

            if (
                newStatus !== TaskStatus.VIEWED &&
                newStatus !== TaskStatus.COMPLETED
            ) {
                return {
                    message: 'Member is not allowed to change this status',
                    data: assignment,
                };
            }
        }

        // message mặc định nếu không được cung cấp từ client
        if (!message) {
            if (newStatus === TaskStatus.VIEWED) {
                message = 'Marked as viewed';
            } else if (newStatus === TaskStatus.COMPLETED) {
                message = 'Task completed';
            } else {
                message = 'Status updated';
            }
        }
        // Cập nhật status và timestamps tương ứng
        const updated = await this.prisma.taskAssignment.update({
            where: {
                id: assignment.id,
            },
            data: {
                status: newStatus,
                viewedAt:
                    newStatus === TaskStatus.VIEWED && !assignment.viewedAt
                        ? new Date()
                        : undefined,
                completedAt:
                    newStatus === TaskStatus.COMPLETED ? new Date() : undefined,
            },
        });
        return {
            message,
            data: updated,
        };
    }
    submitTask = async (data: SubmitTaskDTO,taskId: string,userId: string,) => {
        return await this.prisma.$transaction(async (tx) => {
            const assignment = await tx.taskAssignment.findUnique({
                where: {
                    taskId_memberId: {
                        taskId,
                        memberId: userId,
                    },
                },
                select: {
                    id: true,
                    taskId: true,
                    status: true,
                },
            });

            if (!assignment) {
                throw new Error('Assignment not found');
            }

    //check nếu đã submit rồi thì không cho submit nữa
            const [existing, submission] = await Promise.all([
                tx.submission.findFirst({
                    where: { assignmentId: assignment.id },
                    select: { id: true },
                }),

                tx.submission.create({
                    data: {
                        taskId: assignment.taskId,
                        assignmentId: assignment.id,
                        memberId: userId,
                        note: data.note,
                        status: SubmissionStatus.SUBMITTED,
                        submittedAt: new Date(),

                        answers: data.answers?.length
                            ? {
                                createMany: {
                                    data: data.answers.map((a) => ({
                                        questionId: a.questionId,
                                        answerContent: a.answerContent,
                                    })),
                                },
                            }
                            : undefined,

                        attachments: data.attachmentIds?.length
                            ? {
                                createMany: {
                                    data: data.attachmentIds.map((attachmentId) => ({
                                        attachmentId,
                                    })),
                                },
                            }
                            : undefined,
                    },
                    include: {
                        answers: true,
                        attachments: true,
                    },
                }),
            ]);

            if (existing) {
                return {
                    message: 'You have already submitted this task',
                    data: existing,
                };
            }

            // Cập nhật trạng thái của taskAssignment thành COMPLETED
            await tx.taskAssignment.update({
                where: { id: assignment.id },
                data: {
                    status: TaskStatus.COMPLETED,
                    completedAt: new Date(),
                },
            });

            return {
                message: 'Task submitted successfully',
                data: submission,
            };
        });
    };
    getTasksForMember = async (memberId: string) => {
        return await this.prisma.taskAssignment.findMany({
            where: {
                memberId,
            },
            include: {
                task: {
                    include: {
                        attachments: {
                            include: {
                                attachment: true,
                            },
                        },
                        questions: {
                            include: {
                                options: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                assignedAt: "desc",
            },
        });
    };
    getTasksForDate = async (date: string, memberId?: string) => {
        const { start, end } = getUTCDateRange(date);
        return await this.prisma.task.findMany({
            where: {
                dueAt: {
                    gte: start,
                    lt: end,
                },

                ...(memberId && {
                    assignments: {
                        some: {
                            memberId,
                        },
                    },
                }),

                deletedAt: null,
            },

            include: {
                assignments: {
                    include: {
                        member: true,
                    },
                },
            },
        });
    };
    getTaskById = async (taskId: string) => {
        return await this.prisma.task.findUnique({
            where: {
                id: taskId,
            },
            include: {
                parent: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                    },
                },

                assignments: {
                    include: {
                        member: true,
                    },
                },

                attachments: {
                    include: {
                        attachment: true,
                    },
                },

                questions: {
                    include: {
                        options: true,
                    },
                    orderBy: {
                        questionNo: "asc",
                    },
                },

                submissions: {
                    include: {
                        member: true,
                        analyses: true,
                    },
                },
            },
        });
    };


    private async updateTaskInfo(
        tx: Prisma.TransactionClient,
        taskId: string,
        dto: TaskDTO,
    ) {
        await tx.task.update({
            where: {
                id: taskId,
            },
            data: {
                title: dto.title,
                note: dto.note,
                dueAt: dto.dueAt ? new Date(dto.dueAt) : null,
                duration: dto.duration?.toString(),
                aiGenerated: dto.aiGenerated,
            },
        });
    }
    private async syncAssignments(
        tx: Prisma.TransactionClient,
        taskId: string,
        memberIds: string[],
    ) {
        const dbAssignments = await tx.taskAssignment.findMany({
            where: {
                taskId,
            },
            select: {
                memberId: true,
            },
        });

        const dbMemberIds = new Set(
            dbAssignments.map(x => x.memberId),
        );

        const requestMemberIds = new Set(memberIds);

        const deleteMemberIds = [...dbMemberIds].filter(
            id => !requestMemberIds.has(id),
        );

        const createMemberIds = [...requestMemberIds].filter(
            id => !dbMemberIds.has(id),
        );

        if (deleteMemberIds.length) {
            await tx.taskAssignment.deleteMany({
                where: {
                    taskId,
                    memberId: {
                        in: deleteMemberIds,
                    },
                },
            });
        }

        if (createMemberIds.length) {
            await tx.taskAssignment.createMany({
                data: createMemberIds.map(memberId => ({
                    taskId,
                    memberId,
                })),
            });
        }
    }
    private async syncAttachments(
        tx: Prisma.TransactionClient,
        taskId: string,
        attachmentIds: string[],
    ) {
        const dbAttachments = await tx.taskAttachment.findMany({
            where: {
                taskId,
            },
            select: {
                attachmentId: true,
            },
        });

        const dbAttachmentIds = new Set(
            dbAttachments.map(x => x.attachmentId),
        );

        const requestAttachmentIds = new Set(attachmentIds);

        const deleteAttachmentIds = [...dbAttachmentIds].filter(
            id => !requestAttachmentIds.has(id),
        );

        const createAttachmentIds = [...requestAttachmentIds].filter(
            id => !dbAttachmentIds.has(id),
        );

        if (deleteAttachmentIds.length) {
            await tx.taskAttachment.deleteMany({
                where: {
                    taskId,
                    attachmentId: {
                        in: deleteAttachmentIds,
                    },
                },
            });
        }

        if (createAttachmentIds.length) {
            await tx.taskAttachment.createMany({
                data: createAttachmentIds.map(attachmentId => ({
                    taskId,
                    attachmentId,
                })),
            });
        }
    }
    private async syncQuestions(
        tx: Prisma.TransactionClient,
        taskId: string,
        questions: TaskDTO["questions"] = [],
    ) {
        const dbQuestions = await tx.taskQuestion.findMany({
            where: {
                taskId,
            },
            include: {
                options: true,
            },
        });

        const dbQuestionMap = new Map(
            dbQuestions.map(q => [q.id, q]),
        );

        const requestIds = new Set(
            questions
                .filter(q => q.id)
                .map(q => q.id!),
        );

        const deleteIds = dbQuestions
            .filter(q => !requestIds.has(q.id))
            .map(q => q.id);

        if (deleteIds.length) {
            await tx.taskQuestion.deleteMany({
                where: {
                    id: {
                        in: deleteIds,
                    },
                },
            });
        }

        for (const question of questions) {

            if (!question.id) {
                const created = await tx.taskQuestion.create({
                    data: {
                        taskId,
                        questionNo: question.questionNo,
                        questionType: question.questionType,
                        content: question.content,
                        correctAnswer: question.correctAnswer,
                        explanation: question.explanation,
                        score: question.score,
                    },
                });

                await this.syncOptions(
                    tx,
                    created.id,
                    [],
                    question.options ?? [],
                );

                continue;
            }

            await tx.taskQuestion.update({
                where: {
                    id: question.id,
                },
                data: {
                    questionNo: question.questionNo,
                    questionType: question.questionType,
                    content: question.content,
                    correctAnswer: question.correctAnswer,
                    explanation: question.explanation,
                    score: question.score,
                },
            });

            await this.syncOptions(
                tx,
                question.id,
                dbQuestionMap.get(question.id)?.options ?? [],
                question.options ?? [],
            );
        }
    }
    private async syncOptions(
        tx: Prisma.TransactionClient,
        questionId: string,
        dbOptions: QuestionOption[],
        requestOptions: NonNullable<TaskDTO["questions"]>[number]["options"] = [],
    ) {
        const dbOptionMap = new Map(
            dbOptions.map(o => [o.id, o]),
        );

        const requestIds = new Set(
            requestOptions
                .filter(o => o.id)
                .map(o => o.id!),
        );

        const deleteIds = dbOptions
            .filter(o => !requestIds.has(o.id))
            .map(o => o.id);

        if (deleteIds.length) {
            await tx.questionOption.deleteMany({
                where: {
                    id: {
                        in: deleteIds,
                    },
                },
            });
        }

        for (const option of requestOptions) {

            // CREATE
            if (!option.id) {
                await tx.questionOption.create({
                    data: {
                        questionId,
                        optionKey: option.optionKey,
                        optionContent: option.optionContent,
                        isCorrect: option.isCorrect ?? false,
                    },
                });

                continue;
            }

            // UPDATE
            const dbOption = dbOptionMap.get(option.id);

            if (!dbOption) continue;

            await tx.questionOption.update({
                where: {
                    id: option.id,
                },
                data: {
                    optionKey: option.optionKey,
                    optionContent: option.optionContent,
                    isCorrect: option.isCorrect ?? false,
                },
            });
        }
    }
}
