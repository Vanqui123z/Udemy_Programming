import { Controller, Delete, Get, Param, Post, Put, Request,Body} from '@nestjs/common';
import { Public } from '../../utils/JWT/public.decorator';
import { MembersService } from './members.service';
import type { MemberDTO, UpdateMemberDTO } from './DTO/MemberDTO';

@Controller('member')
export class MembersController {
    constructor(private readonly membersService: MembersService) {}
    @Get("all")
    async getMembersAll(){
        return this.membersService.getMembersAll();
    }
    @Get("parent")
    async getMembersForParent(@Request() req: any){
        const parentId = req.user.id;
        return this.membersService.getMembersForParent(parentId);
    }
    @Get(":membersId")
    async getMembersById(@Param('membersId') membersId: string){
        return this.membersService.getMembersById(membersId);
    }
    @Put(":membersId")
    async updateMemberById(@Param('membersId') membersId: string, @Body() data: UpdateMemberDTO){
        return this.membersService.updateMemberById( membersId, data);
    }
    @Post("add")
    async addMembers(@Body() data: MemberDTO, @Request() req: any){
        const parentId = req.user.id;
        return this.membersService.addMembers(parentId, data);
    }
    @Delete(":membersId")
    async deleteMembersById(@Param('membersId') membersId: string){
        return this.membersService.deleteMembersByIdSoft(membersId);
    }
}
