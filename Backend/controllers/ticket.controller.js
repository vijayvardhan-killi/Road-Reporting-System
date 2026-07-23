import Ticket from "../models/ticket.model.js";
import User from "../models/user.model.js";
import { findNearByAuthority } from "./area.controller.js";
import { notify } from "./notification.controller.js";

const POINTS_PER_RESOLVED_TICKET = 10;

// shared by both the authenticated and anonymous create flows
const buildAndSaveTicket = async ({ title, location, description, photoUrl, riskRating, user, isAnonymous, reporterPhone }) => {
    const nearestArea = await findNearByAuthority(location);

    if (!nearestArea) {
        const error = new Error("No responsible authority found for this location yet. Please try again later.");
        error.statusCode = 404;
        throw error;
    }

    const newTicket = await Ticket.create({
        user: user || null,
        isAnonymous: !!isAnonymous,
        reporterPhone,
        title,
        location,
        photoUrl,
        description,
        riskRating,
        status: 'open',
        assignedTo: nearestArea.authority,
    });

    // alert the responsible city/district administration that a new liability has landed on them
    await notify({
        recipient: nearestArea.authority,
        message: `New ${riskRating >= 7 ? 'high-risk ' : ''}road damage report: "${title}"`,
        type: 'ticket_created',
        ticket: newTicket._id,
    });

    return newTicket;
};

//function to create a new ticket ,for a signed-in civilian.
export const createTicket = async (req , res , next) => {
    try {
        const {title,location,description , photoUrl, riskRating } = req.body;

        const newTicket = await buildAndSaveTicket({
            title, location, description, photoUrl, riskRating,
            user: req.user.id,
            isAnonymous: false,
        });

        res.status(201).json({
            success : true,
            message : "Ticket created successfully",
            ticket : newTicket,
        })

    }catch (error) {
        next(error)
    }
}

// function to create a ticket without an account — requires a phone number on file
// so there's a real contact for follow-up, even though it isn't SMS/OTP verified yet.
export const createAnonymousTicket = async (req, res, next) => {
    try {
        const { title, location, description, photoUrl, riskRating, reporterPhone } = req.body;

        if (!reporterPhone) {
            const error = new Error("A phone number is required for anonymous reports");
            error.statusCode = 400;
            throw error;
        }

        const newTicket = await buildAndSaveTicket({
            title, location, description, photoUrl, riskRating, reporterPhone,
            isAnonymous: true,
        });

        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticket: newTicket,
        });
    } catch (error) {
        next(error);
    }
};


//function to get Ticket by using Ticket Id for  any type of user.
export const getTicketById = async (req,res,next)=>{
    try{
        const id=req.params.id;
        const ticket = await Ticket.findById(id).populate('user', 'name email');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        res.status(200).json({
            success:true,
            message:"Ticket found",
            ticket
        });

    }catch(error){
        next(error);
    }
}


//fuction to get tickets,which are created by user,available for only that user.
export const getTicketsByUser = async (req,res,next)=>{
    try{
        const id=req.params.id;

        // civilians may only list their own tickets
        if (req.user.role === 'civillian' && id !== req.user.id) {
            return res.status(403).json({ success: false, message: "Forbidden" });
        }

        const tickets = await Ticket.find({user:id}).sort({createdAt: -1});

        res.status(200).json({
            success:true,
            message:"Tickets found",
            tickets
        });

    }catch(error){
        next(error);
    }
}

// fuction to delete a ticket which is available for admin and super admin.
export const deleteTicket = async (req,res,next)=>{
    try{
        const id=req.params.id;
        const result = await Ticket.findByIdAndDelete(id);
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

    }catch(error){
        next(error);
    }
}


//fuction to ger tickets based on area, which works for only admin.
export const getTicketsByArea = async (req,res,next)=>{
    try{
        const id=req.params.id;
        const tickets = await Ticket.find({assignedTo:id}).sort({createdAt: -1});

        res.status(200).json({
            success:true,
            message:"Tickets found",
            tickets
        })

    }catch(error){
        next(error);
    }
}

//function to get all tickets. this fuction is available for only super admin
export const getAllTickets = async (req,res,next)=>{
    try{
        const tickets = await Ticket.find({}).sort({createdAt: -1});

        res.status(200).json({
            success:true,
            message:"Tickets found",
            tickets
        })

    }catch(error){
        next(error);
    }
}

//function to update a ticket, this function works for all types of users
//(civilians may only edit their own open tickets' title/description;
// admins/superadmins may update status/assignedTo).
export const updateTicket = async (req,res,next)=>{
    try{
        const id = req.params.id;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: 'Ticket not found' });
        }

        let updates = req.body;

        if (req.user.role === 'civillian') {
            if (!ticket.user || ticket.user.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Forbidden' });
            }
            const allowedUpdates = ['title', 'description'];
            const updateFields = Object.keys(updates);
            const isValidUpdate = updateFields.every(field => allowedUpdates.includes(field));
            if (!isValidUpdate) {
                return res.status(400).json({ success: false, message: 'Civilians may only edit the title or description' });
            }
        } else {
            // admin / superadmin: allow status transitions
            const statusChanged = updates.status && updates.status !== ticket.status;

            if (updates.status === 'resolved' && ticket.status !== 'resolved') {
                updates = { ...updates, resolvedAt: new Date() };
            }

            if (statusChanged) {
                // notify the reporting civilian of any status change (no-op for anonymous reports)
                await notify({
                    recipient: ticket.user,
                    message: `Your report "${ticket.title}" is now ${updates.status.replace('_', ' ')}`,
                    type: updates.status === 'resolved' ? 'ticket_resolved' : 'ticket_status_changed',
                    ticket: ticket._id,
                });

                // award points once, on first resolution, to the reporting civilian
                if (updates.status === 'resolved' && !ticket.pointsAwarded && ticket.user) {
                    await User.findByIdAndUpdate(ticket.user, { $inc: { points: POINTS_PER_RESOLVED_TICKET } });
                    updates.pointsAwarded = true;
                }
            }
        }

        const updatedTicket = await Ticket.findByIdAndUpdate(id,updates,{
            new:true,
            runValidators:true
        });

        res.status(200).json({ success: true, message: 'Ticket updated', ticket: updatedTicket });

    }catch(error){
        next(error);
    }
}
