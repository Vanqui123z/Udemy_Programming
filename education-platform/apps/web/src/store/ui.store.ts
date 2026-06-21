import { create } from "zustand";
import { Question } from "@/types/types";

interface UiStore {
    selectedMemberId: string | null;
    selectedTaskId: string | null;
    gradingTaskId: string | null;
    pendingAIQuestions: Question[];
    isTaskDetail: boolean;

    setSelectedMemberId: (MemberId: string | null) => void;
    setSelectedTaskId: (TaskId: string | null) => void;
    setGradingTaskId: (TaskId: string | null) => void;
    setPendingAIQuestions: (questions: Question[]) => void;
    setIsTaskDetail: (isDetail: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
    selectedMemberId: null,
    selectedTaskId: null,
    gradingTaskId: null,
    pendingAIQuestions: [],
    isTaskDetail: false,

    setSelectedMemberId: (MemberId: string | null) => {
        set({
            selectedMemberId: MemberId
        })
    },
    setSelectedTaskId: (TaskId: string | null) => {
        set({
            selectedTaskId: TaskId
        })
    },
    setGradingTaskId: (TaskId: string | null) => {
           set({
             gradingTaskId: TaskId
           })
    },
    setPendingAIQuestions: (questions: Question[]) => {
        set({
            pendingAIQuestions: questions
        })
    },
    setIsTaskDetail: (isDetail: boolean) => {
        set({
            isTaskDetail: isDetail
        })
    },


}))