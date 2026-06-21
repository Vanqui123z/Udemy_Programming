import axios from "axios";
const API_URL_AUTH = `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/marks`;
import { AIAnalysisItem } from "@/types/types";
import { fetchCommonTokenGet, fetchCommonTokenPost, } from "@/helper/fetchCommon";

const setAIAnalysis = async (data: { taskId: string, memberId: string, score: number, analysis: AIAnalysisItem[] }) => {
  return fetchCommonTokenPost(`${API_URL_AUTH}/ai-analysis/${data.taskId}`, { memberId: data.memberId, score: data.score, analysis: data.analysis });
}

// notification
const markNotificationRead = async (id: string) => {
  return fetchCommonTokenPost(`${API_URL_AUTH}/notification/read/${id}`, {});
}
const getNotificationsFor = async () => {
  return fetchCommonTokenGet(`${API_URL_AUTH}/notifications`, );
}
//mark read all
const markAllRead = async () => {
  return fetchCommonTokenPost(`${API_URL_AUTH}/read-all`, {});
}

// get unread count
const getUnreadCount = async () => {
  return fetchCommonTokenGet(`${API_URL_AUTH}/unread-count`);
}

export const markFetchService = { setAIAnalysis, markNotificationRead, markAllRead, getNotificationsFor, getUnreadCount }
