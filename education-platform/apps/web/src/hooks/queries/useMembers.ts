import { useQuery } from "@tanstack/react-query";
import { memberService } from "@/services/fetchMember.service";

const useMembersAll = () => {
    return useQuery({
        queryKey: ["members"],
        queryFn: memberService.getMembersAll,
    })
}

const useMembersForParent = () => {
    return useQuery({
        queryKey: ["members", "parent"],
        queryFn: () => memberService.getMembersForParent(),
    })
}

const useMemberById = (memberId: string) => {
    return useQuery({
        queryKey: ["members", memberId],
        queryFn: () => memberService.getMembersById(memberId),
        enabled: !!memberId,
    })
}

export const useMembers = { useMembersAll, useMembersForParent, useMemberById }