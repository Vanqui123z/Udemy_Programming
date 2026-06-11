
import { useMutation } from "@tanstack/react-query";
import { authFetchService } from "../services/fetchAuth.service";
import { useRouter } from 'next/navigation'
export const useMutationAuth = () => {
    const router = useRouter();
    const loginMutation = useMutation({
        mutationFn: (data: { email: string, password: string }) => { return authFetchService.login(data.email, data.password) },
        onSuccess: async (data) => {
            console.log("Login success", data);
            await localStorage.setItem("token", data.accessToken);
            router.push('/home')
        },
        onError: (error) => {
            console.error("Login failed:", error);
        }
    });
    const registerMutation = useMutation({
        mutationFn: (data: { email: string,  full_name: string,password: string, confirmPassword: string }) => {
            if (data.password != data.confirmPassword)
                throw new Error("Passwords do not match");
            return authFetchService.register(data.email, data.full_name, data.password)
        },
        onSuccess: (data) => {
            console.log("Registration success", data);
            router.push('/auth/login')
        },
        onError: (error) => {
            console.error("Registration failed:", error);
        }
    });
    const forgotPasswordMutation = useMutation({
        mutationFn: (data: { email: string }) => { return authFetchService.forgotPassword(data.email) },
        onSuccess: (data) => {
            console.log("Forgot password success", data);
        },
        onError: (error) => {
            console.error("Forgot password failed:", error);
        }
    });
    const resetPasswordMutation = useMutation({
        mutationFn: (data: { email: string, otp: string, password: string, confirmPassword: string }) => {
            if (data.password != data.confirmPassword)
                throw new Error("Passwords do not match");
            return authFetchService.resetPassword(data.email, data.otp, data.password)
        },
        onSuccess: (data) => {
            console.log("Reset password success", data);
            router.push('/auth/login')
        },
        onError: (error) => {
            console.error("Reset password failed:", error);
        }
    });


    return { loginMutation, registerMutation, forgotPasswordMutation, resetPasswordMutation };
}
