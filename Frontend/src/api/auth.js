import { api } from ".";

const routePrefix = "/auth";

export const signUp = async (user)=> {
    try{
        const response = await api.post(`${routePrefix}/sign-up`,{
            name : user.name,
            email : user.email,
            password : user.password,
        });
        const token = (response.status === 201) ? response.data.data.token : null;
        if (token){
            localStorage.setItem("accessToken" , token)
        }
        return token
    }
    catch(err){
        console.log("Sign up Error : ", err.response?.data || err.message);
        throw err;
    }
}

export const signIn = async (user)=>{
    try{
        const response = await api.post(`${routePrefix}/sign-in`,{
            email : user.email,
            password : user.password,
        });

        const token = (response.status === 200) ? response.data.data.token : null;
        if (token){
            localStorage.setItem("accessToken" , token)
        }
        return token
    }
    catch(err){
        console.log("Sign in Error : ", err.response?.data || err.message);
        throw err;
    }
    
}

export const signOut = ()=> {
    try{
        localStorage.removeItem("accessToken")
    }catch(e){
        console.log("Sign out error :",e.message)
    }
}