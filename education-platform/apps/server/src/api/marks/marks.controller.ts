import { Controller ,Body, Post, Get,Request, Param} from '@nestjs/common';
import type { AIAnalysisDTO } from './DTO/markDTO';
import { MarksService } from './marks.service';


@Controller('marks')
export class MarksController {
    constructor(private readonly marksService: MarksService) {}

    @Post('ai-analysis/:taskId')
    setAIAnalysis(@Body() data: AIAnalysisDTO){
        return this.marksService.setAIAnalysis(data);
    }
    @Post('notification/read/:id')
    markNotificationRead(@Param('id') id: string){
        return this.marksService.markNotificationRead(id);
    }
    @Get('notifications')
    getNotificationsFor( @Request() req: any){
        const userId = req.user.id;
        return this.marksService.getNotificationsFor( userId);

    }
    @Post('read-all')
    markAllRead( @Request() req: any){
        const userId = req.user.id;
        return this.marksService.markAllRead( userId);
    }
    @Get('unread-count')
    getUnreadCount(@Request() req: any){
        const userId = req.user.id;
        return this.marksService.getUnreadCount(userId);
    }
}
