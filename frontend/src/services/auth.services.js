import axiosInstance from "./axiosInstance";

const otpRequest = async(data) => {
    const {email , type} = data;
    if(email.trim() === "" || type === ""){
        throw new Error("All fields are required");
    }
    const response = await axiosInstance.post("/api/auth/otp-request" , {email ,type});
    return response.data;
}
const otpVerify = async(data) => {
    const {email , type , otp} = data;
    if(email === "" || type === "" || otp ===""){
        throw new Error("All fields are required");
    }
    const response = await axiosInstance.post("/api/auth/otp-verify" , {email ,type , otp});
    return response;
}
const register = async(data) => {
    const {email , userName , fullName , password , DOB , avatar} = data;
    if([email , userName , fullName , password , DOB ].some(field => !field || field.trim() === "")){
        throw new Error ("All fields are required");
    }
    if(!avatar){
        throw new Error ("Avatar file is required");
    }

    const formData = new FormData();
    formData.append("email" , email);
    formData.append("fullName" , fullName);
    formData.append("userName" , userName);
    formData.append("password" , password);
    formData.append("DOB" , DOB);
    formData.append("avatar" , avatar);
    const response = await axiosInstance.post("/api/auth/register" , formData);
    return response.data;
}

const login = async(data) => {
    const {email , userName , password } = data;
    // if([email , userName  , password ].some(field => !field || field.trim() === "")){
    //     throw new Error ("All fields are required");
    // }
    // const userDate = {
    //     email ,
    //     userName ,
    //     password ,
    // }
    const response = await axiosInstance.post("/api/auth/login" , data);
    return response.data;
}
const logout = async() => {
    await axiosInstance.post("/api/auth/logout");
}
const changePassword = async(data) => { // for forgot password user have to otp verify 
    const res = axiosInstance.post("/api/auth/change-password" , data);
}
export {
    otpRequest , 
    otpVerify , 
    register ,
    login,
    logout,
    changePassword // for forgot password 
}