import api from "./api";

export const logoutUser = async () => {

    const response = await api.post("/auth/logout");

    return response.data;
};

export const loginUser = async (data) => {

    const response = await api.post("/auth/signin", data);

    return response.data;
};