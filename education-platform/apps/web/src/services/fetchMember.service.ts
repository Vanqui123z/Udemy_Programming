import { Gender, Member } from "@/types/types";
const API_URL_MEMBER = `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/member`;
import { fetchCommonTokenDelete, fetchCommonTokenGet, fetchCommonTokenPost, fetchCommonTokenPut, } from "@/helper/fetchCommon";


const getMembersAll =  () => {
    return fetchCommonTokenGet(`${API_URL_MEMBER}/all`);
}
const getMembersForParent =  () => {
    return fetchCommonTokenGet(`${API_URL_MEMBER}/parent`);
}

const getMembersById =  (membersId: string) => {
    return fetchCommonTokenGet(`${API_URL_MEMBER}/${membersId}`);
}
const updateMemberById =  (membersId: string, data: Partial<Member>) => {
    return fetchCommonTokenPut(`${API_URL_MEMBER}/${membersId}`, data);
}
const addMembers =  (data: {name: string; gender: Gender; grade: string; interest: string[];}) => {
    return fetchCommonTokenPost(`${API_URL_MEMBER}/add`, data);
}
const deleteMembersById =  (membersId:string,) => {
    return fetchCommonTokenDelete(`${API_URL_MEMBER}/${membersId}`);
}

export const memberService = {getMembersAll, getMembersForParent, getMembersById, updateMemberById, addMembers, deleteMembersById}
