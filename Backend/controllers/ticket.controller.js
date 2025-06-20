import Ticket from "../models/ticket.model.js";
import mongoose from "mongoose";
import { findNearByAuthority } from "./area.controller.js";


export const createTicket = async (req , res , next) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const {location,description , photoUrl  } = req.body;
        //find nearest area authority
        const nearestArea=await findNearByAuthority(location);
        // console.log(nearestArea);

        const newTicket = Ticket.create([{
            user : req.user.id ,
            location:nearestArea.location,
            photoUrl ,
            description ,
            status:'open',
            assignedTo:nearestArea.authority
        }]);

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
