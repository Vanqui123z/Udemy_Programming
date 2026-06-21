  
import { Answer, FileAttachment, Task } from "@/types/types";
const API_URL_TASK = `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/task`;
import { fetchCommonTokenDelete, fetchCommonTokenGet, fetchCommonTokenPost, fetchCommonTokenPut, } from "@/helper/fetchCommon";

const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'memberStatus' | 'submissions'>): Promise<Task> => {
    return fetchCommonTokenPost(`${API_URL_TASK}/add`, taskData);
}

  const updateTask = async (id: string, data: Partial<Task>) => {
    return fetchCommonTokenPut(`${API_URL_TASK}/update/${id}`, data);
  }

  const deleteTask = async (id: string) => {
    return fetchCommonTokenDelete(`${API_URL_TASK}/${id}`);
  }

  const moveTask = async (taskId: string, newDate: string) => {
    return fetchCommonTokenPost(`${API_URL_TASK}/move/${taskId}`, { newDate });
  }

  const updateTaskStatus = async (data: { taskId: string; memberId: string; status: 'viewed' }) => {
    return fetchCommonTokenPost(`${API_URL_TASK}/status/${data.taskId}`, data);
  }

  const submitTask = async (data: { taskId: string; memberId: string; files: FileAttachment[]; answers: Answer[]; note?: string }) => {
    return fetchCommonTokenPost(`${API_URL_TASK}/submit/${data.taskId}`, data);
  }
  const getTasksForMember = async (memberId: string) => {
    return fetchCommonTokenGet(`${API_URL_TASK}/member/${memberId}`);
  }
  const getTasksForDate = async (date: string, memberId?: string ) => {
    return fetchCommonTokenGet(`${API_URL_TASK}/date/${date}${memberId ? `?memberId=${memberId}` : ''}`);
  }
  const getTaskById = async (taskId: string) => {
    return fetchCommonTokenGet(`${API_URL_TASK}/${taskId}`);
  }

  export const taskService = { addTask, updateTask, deleteTask, moveTask, updateTaskStatus, submitTask, getTasksForMember, getTasksForDate, getTaskById }
