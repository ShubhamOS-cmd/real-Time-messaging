import axiosInstance from "./axiosInstance";
const getCurrentUser = async() => {
    const user = await axiosInstance.get("/api/user/getCurrentUser");
    return user.data;
}
const searchTheUser = async({userName}) => {
    if(userName.trim() === "")throw new Error("UserName is required");
    const user = await axiosInstance.get(`/api/user/${userName}`);
    //console.log("just after api res :", user);
    return user.data;
}

export {
    getCurrentUser,
    searchTheUser
}