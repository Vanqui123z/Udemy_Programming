import { Controller, Patch, Put, Post, Delete, Get, Body, Request, Param, Query } from '@nestjs/common';
import type { TaskDTO, SubmitTaskDTO, UpdateTaskStatusDTO } from './DTO/TaskDTO';
import { TaskService } from './task.service';
import { Public } from '@/utils/JWT/public.decorator';


@Controller('task')
export class TaskController {
    constructor(private readonly TaskService: TaskService) { }
    @Get('member/:memberId')
    async getTasksForMember(@Param('memberId') memberId: string) {
        return this.TaskService.getTasksForMember(memberId);
    }
    @Get('date/:date')
    async getTasksForDate(@Param('date') date: string, @Query('memberId') memberId?: string,
    ) {
        return this.TaskService.getTasksForDate(date, memberId);
    }
    @Get(':taskId')
    async getTaskById(@Param('taskId') taskId: string) {
        return this.TaskService.getTaskById(taskId);
    }

    @Post('add')
    async addTask(@Body() taskData: TaskDTO, @Request() req: any) {
        const parentId = req.user.id;
        return this.TaskService.addTask(taskData, parentId);
    }
    @Put(':taskId')
    async updateTask(@Body() data: TaskDTO, @Param('taskId') taskId: string) {
        return this.TaskService.updateTask(taskId, data);
    }
    @Delete(':taskId')
    async deleteTask(@Param('taskId') taskId: string) {
        return this.TaskService.deleteTask(taskId);
    }
    @Post(':taskId/move')
    async moveTask(@Param('taskId') taskId: string, @Body('newDate') newDate: string) {
        return this.TaskService.moveTask(taskId, newDate);
    }
    @Patch(':taskId/status')
    async updateStatus( @Param('taskId') taskId: string, @Body() data: UpdateTaskStatusDTO, @Request() req: any,   ) {
        const result = await this.TaskService.updateStatus(taskId,req.user,data);
        return {
            message: result.message,
            data: result.data,
        };
    }
    @Post(':taskId/submit')
    async submitTask(@Param('taskId') taskId: string, @Body() data: SubmitTaskDTO, @Request() req: any) {
         const result = await this.TaskService.submitTask(data, taskId, req.user.id);
         return {
            message: result.message,
            data: result.data,
        };
    }   

}
