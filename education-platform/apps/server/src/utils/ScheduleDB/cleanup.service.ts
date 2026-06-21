import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { CronExpression } from "@nestjs/schedule";
import { Cron } from "@nestjs/schedule";


@Injectable()   
export class CleanupService {
    constructor(private readonly prisma: PrismaService) { }
      @Cron(CronExpression.EVERY_DAY_AT_2AM)
    handleCron() {
        console.log("Cron running...");
    }
}