
import { toast } from "sonner"
import { useMutation,useQueryClient } from "@tanstack/react-query";
import { taskService } from "../../services/fetchTask.service";
import { Task, FileAttachment, Answer } from "@/types/types";



export const useMutationTask = () => {
    const queryClient = useQueryClient();
    const addTaskMutation = useMutation({
        mutationFn: (
            taskData: Omit<Task, "id" | "createdAt" | "memberStatus" | "submissions">
        ) => taskService.addTask(taskData),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Thêm nhiệm vụ thành công");
        },

        onError: (error) => {
            console.error(error);
            toast.error("Thêm nhiệm vụ thất bại");
        },
    });


    const updateTaskMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: Partial<Task>;
        }) => taskService.updateTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Cập nhật nhiệm vụ thành công");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Cập nhật nhiệm vụ thất bại");
        },
    });


    const deleteTaskMutation = useMutation({
        mutationFn: (taskId: string) => taskService.deleteTask(taskId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Xóa nhiệm vụ thành công");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Xóa nhiệm vụ thất bại");
        },
    });

    const moveTaskMutation = useMutation({
        mutationFn: ({
            taskId,
            newDate,
        }: {
            taskId: string;
            newDate: string;
        }) => taskService.moveTask(taskId, newDate),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Di chuyển nhiệm vụ thành công");
        },

        onError: (error) => {
            console.error(error);
            toast.error("Di chuyển nhiệm vụ thất bại");
        },
    });

    const updateTaskStatusMutation = useMutation({
        mutationFn: (data: {
            taskId: string;
            memberId: string;
            status: "viewed";
        }) => taskService.updateTaskStatus(data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Đã cập nhật trạng thái");
        },

        onError: (error) => {
            console.error(error);
            toast.error("Cập nhật trạng thái thất bại");
        },
    });


    const submitTaskMutation = useMutation({
        mutationFn: (data: {
            taskId: string;
            memberId: string;
            files: FileAttachment[];
            answers: Answer[];
            note?: string;
        }) =>
            taskService.submitTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            toast.success("Nộp bài thành công");
        },

        onError: (error) => {
            console.error(error);
            toast.error("Nộp bài thất bại");
        },
    });



    return { addTaskMutation, updateTaskMutation, deleteTaskMutation, moveTaskMutation, updateTaskStatusMutation, submitTaskMutation };
}
