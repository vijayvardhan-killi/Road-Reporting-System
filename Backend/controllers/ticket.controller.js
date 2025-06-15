import Ticket from "../models/ticket.model.js";
import mongoose from "mongoose";


export const createTicket = async (req , res , next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {description , photoUrl  } = req.body;

        const newTicket = Ticket.create([{
            user : req.user.id ,
            description ,
            photoUrl ,
        }])

        await session.commitTransaction();
        
        session.endSession();

        res.status(201).json({
            success : true,
            message : "Ticket created successfully",
            ticket : newTicket[0], // Return the created ticket 
        })
        

    }catch (error) {
        session.abortTransaction();
        session.endSession();
        next (error)
    }
}
