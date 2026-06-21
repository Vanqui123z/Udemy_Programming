
import { markFetchService } from "@/services/fetchMark.service";
import { useQuery } from "@tanstack/react-query";


const useUnreadCount = (role: 'parent' | 'member')=>{
    return useQuery({
        queryKey: ["unreadCount", role ],
        queryFn: () => markFetchService.getUnreadCount({ role }),
    })
}

const useGetNotificationsFor = (role: 'parent' | 'member')=>{
    return useQuery({
        queryKey:["notifications", role],
        queryFn: () => markFetchService.getNotificationsFor({ role }),
    })
}

export const useMarks = { useUnreadCount, useGetNotificationsFor }