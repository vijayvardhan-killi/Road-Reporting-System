import mongoose from "mongoose";
import User from "../models/user.model.js";
import Area from "../models/area.model.js";
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
        const { name , email , password , role ,area } = req.body;

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
            password : hashedPassword ,
            role : role || "civillian"
        }] , {session});

        if (newUser[0].role === 'admin') {
            // const createdArea = await Area.create()
            // If the user is an admin, create an area with the admin's authority
            //assuming req.area contains the area data as object
            // area : {
            //     name : "Admin Area" ,
            //     coordinates : [longitude, latitude] // Replace with actual coordinates
            // }
            // const {area} = req.area; 
            const areaData =  {
                  name: area.name,
                  location: {
                    type: "Point",
                    coordinates: area.coordinates
                  },
                  authority: newUser[0]._id // Use the created user's ID as authority
                } 
            await Area.create([areaData], { session});
        }

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


export const updateUser = async (req, res, next) => {
    try {
    //   const userId = req.user.userId; 
      const userId = req.params.id; 
      const updates = req.body; 
    if (req.user.role === 'civillian') {
        const allowedUpdates = ['name' , 'email'];
        const updates = Object.keys(updates);

        const isValidUpdate = updates.every(field => allowedUpdates.includes(field));
        if (!isValidUpdate) {
            return res.status(400).json({
                success: false,
                message: "Invalid updates for civillian user"
            });
        }
    }
    
      console.log("Updates received:", updates);
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");
  
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };


export const deleteUser = async (req, res, next) => {
    try {    
        const userId = req.params.id; 
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            success : true ,
            message : "User deleted successfully",
            data : deletedUser
        })
    }
    catch (error) {
        next(error);
    }
}


export const getCurrentUser = async (req , res , next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId , '-password'); 
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        return res.status(200).json({
            success : true ,
            message : "Current user fetched successfully",
            data : user
        })
    }
    catch (error) {
        next(error)
    }
    
}