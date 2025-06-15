import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        res.status(200).json({
            success : true ,
            message : "Users fetched successfully",
            data : users
        })

    }
    catch (error) {
        next(error);
    }
}



export const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id ;
        const user = await User.findById(userId , '-password'); // Exclude password field
        if (user) {
            return res.status(200).json({
                success: true,
                message: "User  found" ,
                data : user,
            })
        }

    }
    catch (error) {
        next(error)
    }
}


export const createUser = async (req , res , next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { name , email , password} = req.body;

        //check if user already exists
        const existingUser = await User.findOne({email})

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        //hash the password
        const SALT = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , SALT);

        //create a new user

        const newUser = await User.create([{
            name , 
            email ,
            password : hashedPassword
        }] , {session});


        await session.commitTransaction();

        session.endSession();
        res.status(201).json({
            success : true,
            message : "User created successfully",
            user : newUser[0], // Return the created user without password
        })
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}