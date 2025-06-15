import { Router } from "express";
import { createTicket } from "../controllers/ticket.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const ticketRouter = Router();

ticketRouter.get('/' , (req , res) => res.json({message : 'Get All Tickets'}))
ticketRouter.get('/:id' , (req , res) => res.json({message : 'Get  Ticket'}))
ticketRouter.post('/' , authMiddleware,createTicket)
ticketRouter.put('/:id' , (req , res) => res.json({message : 'Update a Ticket'}))
ticketRouter.delete('/:id' ,(req , res) => res.json({message : 'Delete a Ticket'}) )

ticketRouter.get('/user/:id' ,(req , res) => res.json({message : 'GET  Tickets of a User'}))

ticketRouter.get('/area/:id' ,(req , res) => res.json({message : 'GET  Tickets of an Area'}))



export default ticketRouter