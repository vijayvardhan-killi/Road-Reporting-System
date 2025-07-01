import Ticket from "../models/ticket.model.js";
import mongoose from "mongoose";
import { findNearByAuthority } from "./area.controller.js";

//function to create a new ticket ,this function works for civilian.
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


//function to get Ticket by using Ticket Id for  any type of user.
export const getTicketById=async (req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        const id=req.params.id;
        const ticket=await Ticket.findById(id);//find ticket by matching id.

        if (!ticket) {
        await session.abortTransaction();
        return res.status(404).json({
            success: false,
            message: "Ticket not found"
        });
        }

        await session.commitTransaction();
        res.status(200).json({
            success:true,
            message:"Ticket found",
            ticket
        });
        // console.log(ticket);


    }catch(error){
        await session.abortTransaction();
        next(error);
        
    }finally{
        session.endSession();
    }

}


//fuction to get tickets,which are created by user,available for only that user.
export const getTicketsByUser=async (req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        const id=req.params.id;
        const tickets=await Ticket.find({user:id});//find tickets by matching the user feild.

        if (!tickets) {
        await session.abortTransaction();
        return res.status(404).json({
            success: false,
            message: "No ticket found"
        });
        }

        await session.commitTransaction();
        res.status(200).json({
            success:true,
            message:"Tickets found",
            tickets
        });
        // console.log(ticket);


    }catch(error){
        await session.abortTransaction();
        next(error);
        
    }finally{
        session.endSession();
    }

}

// fuction to delete a ticket which is available for admin and super admin.
export const deleteTicket=async (req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        const id=req.params.id;
        const result = await Ticket.findByIdAndDelete(id);//delete ticket.
        await session.commitTransaction();
        if (result) {
            res.status(200).json({ 
                success: true, 
                message: "Ticket deleted", 
                ticket: result });
        } else {
            res.status(404).json({ 
                success: false, 
                message: "Ticket not found" });
        }
        // console.log(ticket);


    }catch(error){
        await session.abortTransaction();
        next(error);
        
    }finally{
        session.endSession();
    }

}


//fuction to ger tickets based on area, which works for only admin.
export const getTicketsByArea=async (req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        const id=req.params.id;
        const tickets = await Ticket.find({assignedTo:id});//matching by using assignedTo feild.
        await session.commitTransaction();
        if (!tickets) {
            return res.status(404).json({ 
                success: false, 
                message: "NO Tickets found", 
                ticket: result });
        } 
        // console.log(ticket);
        res.status(200).json({
            success:true,
            message:"Tickets found",
            tickets
        })


    }catch(error){
        await session.abortTransaction();
        next(error);
        
    }finally{
        session.endSession();
    }

}

//function to get all tickets. this fuction is available for only super admin
export const getAllTickets=async (req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        
        const tickets = await Ticket.find({});//retrieves all tickets
        await session.commitTransaction();
        if (!tickets) {
            return res.status(404).json({ 
                success: false, 
                message: "NO Tickets found", 
                ticket: result });
        } 
        // console.log(tickets);
        res.status(200).json({
            success:true,
            message:"Tickets found",
            tickets
        })


    }catch(error){
        await session.abortTransaction();
        next(error);
        
    }finally{
        session.endSession();
    }

}

//function to update a ticket ,this fuctions is works for all type of users.
export const updateTicket=async (req,res,next)=>{
    const session=await mongoose.startSession();
    session.startTransaction();
    try{
        const id=req.params.id;
        const updateTicket=req.body;
        const updatedTicket = await Ticket.findByIdAndUpdate(id,updateTicket,{
            new:true,
            runValidators:true
        });//find ticket by id and update.
        await session.commitTransaction();
        if (!updatedTicket) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        res.status(200).json({ success: true, message: 'Ticket updated', ticket: updatedTicket });


    }catch(error){
        await session.abortTransaction();
        next(error);
        
    }finally{
        session.endSession();
    }

}