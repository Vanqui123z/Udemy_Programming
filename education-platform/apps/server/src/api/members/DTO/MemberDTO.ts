export type Gender = 'male' | 'female';
export interface MemberDTO {
  name: string;
  gender: Gender;
  grade: string;
  interest: string[];
  role: string;
}

export interface UpdateMemberDTO {
  name?: string;
  gender?: Gender;
  grade?: string;
  interest?: string[];
}
