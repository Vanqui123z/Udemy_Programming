import { create } from "zustand";
import { Question } from "@/types/types";

interface UiStore {
    selectedTaskId: string | null;
    gradingTaskId: string | null;
    pendingAIQuestions: Question[];
    isTaskDetail: boolean;
    

    setSelectedTaskId: (TaskId: string | null) => void;
    setGradingTaskId: (TaskId: string | null) => void;
    setPendingAIQuestions: (questions: Question[]) => void;
    setIsTaskDetail: (isDetail: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
    selectedTaskId: null,
    gradingTaskId: null,
    pendingAIQuestions: [],
    isTaskDetail: false,

    
    
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