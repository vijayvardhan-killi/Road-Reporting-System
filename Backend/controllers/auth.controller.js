import mongoose from "mongoose"
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export const signUp = async (req  , res , next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name , email , password } = req.body;
        
        // check if user already exists
        const existingUser = await User.findOne({email});

        if (existingUser) {
            const error = new Error("User Alredy exists");
            error.statusCode = 409;
            throw  error;
        }

        //hash the password
        const SALT = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , SALT);

        // create a new user

        const newUser = await User.create([{
            name , 
            email ,
            password : hashedPassword,
        }] , {session});



        const token = jwt.sign({userId : newUser[0]._id , email : newUser[0].email , role : newUser[0].role} , JWT_SECRET , {expiresIn : '1d'});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success : true,
            message : "User Created Succesfully",
            data : {
                token ,
                user : newUser[0] ,
            }

        })
        

    }
    catch (error){
        await session.abortTransaction();
        session.endSession()
        next(error)
    }
}


export const signIn = async (req , res , next)=> {
    try {
        const {email , password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            const error = new Error("User not Found");
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password , user.password);

        if (!isPasswordValid) {
            const error = new Error("Invalid Password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId : user._id , email : user.email , role : user.role } , JWT_SECRET , {expiresIn : '1d'});
        res.status(200).json({
            success : true ,
            message : "User Signed In Successfully",
            data : {
                token , 
                user : {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            }
        })


    }
    catch (error) {
        next(error);
    }
}


export const signOut = (req, res) => {
    // Instruct client to delete token on their side OORRR INVALIDATE THE TOKEN
    res.status(200).json({ 
      success: true,
      message: "Signed out successfully, please delete token on client side"
    });
  };

