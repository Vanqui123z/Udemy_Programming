
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markFetchService } from "../../services/fetchMark.service";
import { AIAnalysisItem } from "@/types/types";
import { toast } from "sonner"

export const useMutationMark = () => {
    const queryClient = useQueryClient();
    const setAIAnalysisMutation = useMutation({
    mutationFn: (data:{taskId: string; memberId: string;score: number;analysis: AIAnalysisItem[];}) =>{
        return markFetchService.setAIAnalysis(data);
    },

    onSuccess: () => {
      toast.success("Phân tích AI thành công");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Phân tích AI thất bại");
    },
  });
  const markNotificationReadMutation = useMutation({
    mutationFn: (id: string) =>
      markFetchService.markNotificationRead(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Đã đánh dấu đã đọc");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Không thể cập nhật thông báo");
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: (data: { role: "parent" | "member"; userId: string }) =>
      markFetchService.markAllRead(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Đã đánh dấu tất cả là đã đọc");
    },

    onError: (error) => {
      console.error(error);
      toast.error("Không thể cập nhật thông báo");
    },
  });

    return { setAIAnalysisMutation, markNotificationReadMutation, markAllReadMutation };
}
