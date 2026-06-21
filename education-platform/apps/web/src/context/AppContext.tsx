"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import {Parent, Member, Task, Notification,UserRole, ParentView, MemberView, AuthScreen,Answer, FileAttachment, Submission, AIAnalysisItem, Question} from '@/types/types';

import { DemoData } from './demoData';
const { DEMO_PARENT, DEMO_MEMBERS, DEMO_TASKS, DEMO_NOTIFICATIONS } = DemoData();
import { AppContextType } from './AppContextType';





const AppContext = createContext<AppContextType | null>(null);

  export default function AppProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<Parent | Member | null>(null);
    const [currentRole, setCurrentRole] = useState<UserRole | null>(null);
    const [authScreen, setAuthScreen] = useState<AuthScreen>('landing');
    const [parents, setParents] = useState<Parent[]>([DEMO_PARENT]);
    const [members, setMembers] = useState<Member[]>(DEMO_MEMBERS);
    const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
    const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
    const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [gradingTaskId, setGradingTaskId] = useState<string | null>(null);
    const [pendingAIQuestions, setPendingAIQuestions] = useState<Question[]>([]);
    const [isTaskDetail, setIsTaskDetail] = useState(false);

    const loginParent = (email: string, password: string): boolean => {
      const p = parents.find(x => x.email === email && x.password === password);
      if (p) { setCurrentUser(p); setCurrentRole('parent'); return true; }
      return false;
    };

    const loginMember = (username: string, password: string): boolean => {
      const m = members.find(x => x.username === username && x.password === password);
      if (m) { setCurrentUser(m); setCurrentRole('member');  return true; }
      return false;
    };

    const registerParent = (name: string, email: string, password: string) => {
      const newParent: Parent = { id: `p${Date.now()}`, name, email, password };
      setParents(prev => [...prev, newParent]);
      setCurrentUser(newParent);
      setCurrentRole('parent');
    
    };

    const logout = () => {
      setCurrentUser(null); setCurrentRole(null); setAuthScreen('landing');
      setSelectedMemberId(null); setSelectedTaskId(null); setGradingTaskId(null);
    };

    const addMember = (name: string, gender: 'male' | 'female', grade: string, interest: string): Member => {
      const parent = currentUser as Parent;
      const idx = members.filter(m => m.parentId === parent.id).length + 1;
      const firstName = name.split(' ').pop()?.toLowerCase() || 'user';
      const username = `${firstName}.m${idx}.child`;
      const lastName = parent.name.split(' ')[0] || 'Parent';
      const password = `${lastName}_parent_${String(idx).padStart(3, '0')}`;
      const newMember: Member = { id: `m${Date.now()}`, name, gender, grade, interest, username, password, parentId: parent.id };
      setMembers(prev => [...prev, newMember]);
      return newMember;
    };

    const updateMember = (id: string, data: Partial<Member>) => {
      setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m));
    };

    const deleteMember = (id: string) => {
      setMembers(prev => prev.filter(m => m.id !== id));
    };

    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'memberStatus' | 'submissions'>): Task => {
      const memberStatus: Record<string, 'assigned' | 'viewed' | 'completed'> = {};
      taskData.assignedTo.forEach(id => { memberStatus[id] = 'assigned'; });
      const newTask: Task = { ...taskData, id: `t${Date.now()}`, memberStatus, submissions: [], createdAt: new Date().toISOString() };
      setTasks(prev => [...prev, newTask]);
      const notifs: Notification[] = taskData.assignedTo.map(memberId => ({
        id: `n${Date.now()}-${memberId}`, type: 'new_task' as const,
        title: 'Nhiệm vụ mới', message: `Bạn có nhiệm vụ mới: ${taskData.title}`,
        taskId: newTask.id, taskTitle: taskData.title, read: false,
        forRole: 'member' as const, forUserId: memberId, createdAt: new Date().toISOString()
      }));
      setNotifications(prev => [...prev, ...notifs]);
      return newTask;
    };

    const updateTask = (id: string, data: Partial<Task>) => {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
    };

    const deleteTask = (id: string) => {
      setTasks(prev => prev.filter(t => t.id !== id));
    };

    const moveTask = (taskId: string, newDate: string) => {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, date: newDate } : t));
    };

    const updateTaskStatus = (taskId: string, memberId: string, status: 'viewed') => {
      setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        const current = t.memberStatus[memberId];
        if (current === 'assigned') return { ...t, memberStatus: { ...t.memberStatus, [memberId]: status } };
        return t;
      }));
    };

    const submitTask = (taskId: string, memberId: string, files: FileAttachment[], answers: Answer[], note?: string) => {
      const member = members.find(m => m.id === memberId);
      if (!member) return;
      const submission: Submission = { id: `s${Date.now()}`, memberId, memberName: member.name, files, answers, note, submittedAt: new Date().toISOString() };
      setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        return { ...t, memberStatus: { ...t.memberStatus, [memberId]: 'completed' }, submissions: [...t.submissions, submission] };
      }));
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const notif: Notification = {
          id: `n${Date.now()}`, type: 'submission', title: 'Bài đã được nộp',
          message: `${member.name} đã nộp bài: ${task.title}`, taskId, taskTitle: task.title,
          memberName: member.name, read: false, forRole: 'parent', forUserId: member.parentId,
          createdAt: new Date().toISOString()
        };
        setNotifications(prev => [...prev, notif]);
      }
    };

    const setAIAnalysis = (taskId: string, memberId: string, score: number, analysis: AIAnalysisItem[]) => {
      setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        return { ...t, submissions: t.submissions.map(s => s.memberId === memberId ? { ...s, aiScore: score, aiAnalysis: analysis } : s) };
      }));
    };

    const markNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllRead = (role: 'parent' | 'member', userId: string) => {
      setNotifications(prev => prev.map(n => n.forRole === role && n.forUserId === userId ? { ...n, read: true } : n));
    };

    const getNotificationsFor = (role: 'parent' | 'member', userId: string) =>{
      return notifications.filter(n => n.forRole === role && n.forUserId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());}

    const getTasksForMember = (memberId: string) => tasks.filter(t => t.assignedTo.includes(memberId));

    const getTasksForDate = (date: string, memberId?: string) =>
      tasks.filter(t => t.date === date && (!memberId || t.assignedTo.includes(memberId)));

    const getMemberById = (id: string) => members.find(m => m.id === id);
    const getTaskById = (id: string) => tasks.find(t => t.id === id);
    const getUnreadCount = (role: 'parent' | 'member', userId: string) =>
      notifications.filter(n => n.forRole === role && n.forUserId === userId && !n.read).length;
    const getMembersForParent = (parentId: string) => members.filter(m => m.parentId === parentId);

  return (
    <AppContext.Provider value={{
      currentUser, currentRole, authScreen, setAuthScreen,
      loginParent, loginMember, registerParent, logout,
      parents, members, tasks, notifications,
       selectedMemberId, setSelectedMemberId,
       selectedTaskId, setSelectedTaskId,
      gradingTaskId, setGradingTaskId, pendingAIQuestions, setPendingAIQuestions,
      addMember, updateMember, deleteMember,
      addTask, updateTask, deleteTask, moveTask,
      submitTask, setAIAnalysis, updateTaskStatus,
      markNotificationRead, markAllRead, getNotificationsFor,
      getTasksForMember, getTasksForDate, getMemberById, getTaskById,
      getUnreadCount, getMembersForParent,isTaskDetail, setIsTaskDetail
      
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
