import { Injectable } from '@nestjs/common';
import { AIAnalysisDTO } from './DTO/markDTO';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class MarksService {
  constructor(private readonly prisma: PrismaService) {}
  setAIAnalysis = async (data: AIAnalysisDTO) => {
    const existing = await this.prisma.aIAnalysis.findFirst({
      where: {
        submissionId: data.submissionId,
      },
    });

    if (existing) {
      return await this.prisma.aIAnalysis.update({
        where: {
          id: existing.id,
        },
        data: {
          score: data.score,
          totalScore: data.totalScore,
          accuracy: data.accuracy,

          summary: data.summary,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          recommendations: data.recommendations,

          analysisJson: data.analysisJson,
        },
      });
    }

    return await this.prisma.aIAnalysis.create({
      data: {
        submissionId: data.submissionId,

        score: data.score,
        totalScore: data.totalScore,
        accuracy: data.accuracy,

        summary: data.summary,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        recommendations: data.recommendations,

        analysisJson: data.analysisJson,
      },
    });
  };

  markNotificationRead = async (id: string) => {
    return await this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  };

  getNotificationsFor = async (userId: string) => {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.content,
      read: notification.isRead,
      forUserId: notification.userId,
      createdAt: notification.createdAt.toISOString(),
    }));
  };

  markAllRead = async (userId: string) => {
    const result = await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      updated: result.count,
    };
  };

  getUnreadCount = async (userId: string) => {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });

    return {
      unreadCount: count,
    };
  };
}
