import axiosInstance from "./axiosInstance";
const getCurrentUser = async() => {
    const user = await axiosInstance.get("/api/user/getCurrentUser");
    return user.data;
}
const searchTheUser = async({userName}) => {
    if(userName.trim() === "")throw new Error("UserName is required");
    const user = await axiosInstance.get(`/api/user/${userName}`);
    return user.data;
}

export {
    getCurrentUser,
    searchTheUser
}