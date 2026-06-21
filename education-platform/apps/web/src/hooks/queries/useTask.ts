import { useQuery } from "@tanstack/react-query";
import { taskService } from "@/services/fetchTask.service";


     const useTaskforMember = (memberId:string) => {
        return useQuery({
            queryKey: ["tasks", memberId],
            queryFn: () => taskService.getTasksForMember(memberId),
            enabled: !!memberId,
        });
    };
     const useTaskforDate = (date: string, memberId?: string) => {
        return useQuery({
            queryKey: ["tasks", date, memberId],
            queryFn: () => taskService.getTasksForDate(date, memberId),
            enabled: !!date,
        });
    };
     const useTaskById = (taskId: string) => {
        return useQuery({
            queryKey: ["tasks", taskId],
            queryFn: () => taskService.getTaskById(taskId),
            enabled: !!taskId,
        });
    };
export const useTasks = { useTaskforMember, useTaskforDate, useTaskById }