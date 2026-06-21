import axios from "axios";


export const fetchCommonTokenGet = async (url: string) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}

export const fetchCommonTokenPost = async (url: string, data: any) => {
    const token = localStorage.getItem("token");

    const res = await axios.post(`${url}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}
export const fetchCommonTokenPut = async (url: string, data: any) => {
    const token = localStorage.getItem("token");

    const res = await axios.put(`${url}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}
export const fetchCommonTokenDelete = async (url: string) => {
    const token = localStorage.getItem("token");

    const res = await axios.delete(`${url}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}