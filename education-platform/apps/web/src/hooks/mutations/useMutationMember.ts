
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService } from "@/services/fetchMember.service";
import { Gender, Member } from "@/types/types";
import {toast  } from "sonner";

export const useMutationMember = () => {
    const queryClient = useQueryClient();
    const updateMemberMutation = useMutation({
        mutationFn: ({ membersId, data }: { membersId: string, data: Partial<Member> }) => { return memberService.updateMemberById(membersId, data) },
        onSuccess: async (data) => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            console.log("Update member success", data);
            toast.success("Member updated successfully"); 
        },
        onError: (error) => {
            console.error("Update member failed:", error);
            toast.error("Failed to update member");
        }
    });
    const addMemberMutation = useMutation({
        mutationFn: (data:{name: string; gender: Gender; grade: string; interest: string[];}) => {
            return memberService.addMembers(data)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            console.log("add member success", data);
            toast.success("Member added successfully");
        },
        onError: (error) => {
            console.error("Registration failed:", error);
            toast.error("Failed to register member");
        }
    });
    const deleteMemberMutation = useMutation({
        mutationFn: (data: { membersId: string }) => { return memberService.deleteMembersById(data.membersId) },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            console.log("Delete member success", data);
            toast.success("Member deleted successfully");
        },
        onError: (error) => {
            console.error("Delete member failed:", error);
            toast.error("Failed to delete member");
        }
    });



    return { updateMemberMutation, addMemberMutation, deleteMemberMutation };
}
