
import { markFetchService } from "@/services/fetchMark.service";
import { useQuery } from "@tanstack/react-query";


const useUnreadCount = ()=>{
    return useQuery({
        queryKey: ["unreadCount"],
        queryFn: () => markFetchService.getUnreadCount(),

    })
}

const useGetNotificationsFor = ()=>{
    return useQuery({
        queryKey:["notifications"],
        queryFn: () => markFetchService.getNotificationsFor()})
}

export const useMarks = { useUnreadCount, useGetNotificationsFor }