import { create } from "zustand";
import type { Member, Parent, UserRole } from "@/types/types";

interface AuthStore {
    currentUser: Member | Parent | null;
    currentRole: UserRole | null;

    setCurrentUser: (user: Member | Parent | null) => void;
    setCurrentRole: (role: UserRole | null) => void;

}

export const useAuthStore = create<AuthStore>((set) => ({
    currentUser: null,
    currentRole: null,

    setCurrentUser: (user) => set({ currentUser: user }),
    setCurrentRole: (role) => set({ currentRole: role }),
}));