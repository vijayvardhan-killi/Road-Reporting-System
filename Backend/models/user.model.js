import mongoose from "mongoose";


const userShema = new mongoose.Schema({
    name : {
        type : String , 
        required : [true , "User Name is required"] ,
        trim : true ,
        minLength : 2 ,
        maxLength : 50 ,
    } ,

    email : {
        type : String ,
        required : true ,
        unique : true ,
        lowercase :true ,
        match : [/\S+@\S+\.\S+/ , "Please provide a valid email address"],
    },

    password : {
        type : String ,
        required : true ,
        minLength : 6 ,
    } , 

    role : {
        type : String  ,
        enum : ["civillian" , "admin" , 'superadmin'],
        default : "civillian" ,
    }

} , {timestamps : true});




const User = mongoose.model('User' , userShema)


export default User