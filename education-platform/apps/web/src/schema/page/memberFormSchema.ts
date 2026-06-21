import {z} from "zod";

export const MemberFormSchema = z.object({
    name: z.string().min(1, "Tên không được để trống"),
    gender:z.enum(["MALE","FEMALE"]),
    grade:z.string().min(1, "Lớp không được để trống"),
    interest:z.array(z.string()).min(1, "Sở thích không được để trống")
})
export type     MemberFormData = z.infer<typeof MemberFormSchema>;