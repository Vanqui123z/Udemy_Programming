
import axios from "axios";
const API_URL_AUTH = `${process.env.NEXT_PUBLIC_URL_BACKEND}/api/auth`;

const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL_AUTH}/login`, { email, password });
    return res.data;
}

const register = async (email: string, full_name: string, password: string) => {
    const res = await axios.post(`${API_URL_AUTH}/register`, { email, full_name, password });
    return res.data;
}
const forgotPassword = async (email: string) => {
    const res = await axios.post(`${API_URL_AUTH}/forgotPassword`, { email });
    return res.data;
}
const resetPassword = async (email: string, otp: string, new_password: string) => {
    const res = await axios.post(`${API_URL_AUTH}/resetPassword`, { email, otp, new_password });
    return res.data;
}
const socialLogin = async (data: { email: string, full_name: string, avatar_url: string, provider: string, providerId: string }) => {
    const res = await axios.post(`${API_URL_AUTH}/social-login`, data);
    return res.data;
}
export const authFetchService = { login, register, forgotPassword, resetPassword, socialLogin }
