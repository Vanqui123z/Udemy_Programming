import { Member } from '@/types/types';
import { create } from 'zustand';


interface memberStoreType{
    selectedMemberId: string | null;
    selectedMember: Member | null;
    
    setSelectedMember: (Member: Member | null) => void;
    setSelectedMemberId: (MemberId: string | null) => void;

    clearSelectedMember: () => void;
    clearSelectedMemberId: () => void;
    
}

export const useMemberStore = create<memberStoreType>((set) => ({
    selectedMemberId: null,
    selectedMember:null,

    setSelectedMember: (Member: Member | null) => {
        set({
            selectedMember: Member
        })
    },
    setSelectedMemberId: (MemberId: string | null) => {
        set({
                selectedMemberId: MemberId
        })
    },
    
    clearSelectedMember: () => set({ selectedMember: null }),
    clearSelectedMemberId: () => set({ selectedMemberId: null }),

}))