import { create } from "zustand";
import { Notification } from "@/types/types";

interface markStoreType {
    notifications:  Notification[];
    getUnreadCount: number;
   

    setNotifications: (notifications: Notification[]) => void;
    setGetUnreadCount:  (number: number) => void;



}

export const useMarkStore= create<markStoreType>((set) => ({
    notifications: [],
    getUnreadCount: 0,
    
    setNotifications: (notifications) => set({ notifications }),
    setGetUnreadCount: (number) => set({ getUnreadCount: number }),
}))