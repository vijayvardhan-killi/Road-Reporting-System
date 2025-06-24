import { Router } from "express";
import { createTicket,getTicketById ,getTicketsByUser,deleteTicket,getTicketsByArea,getAllTickets,updateTicket} from "../controllers/ticket.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import authorize from "../middleware/authorize.middleware.js";

const ticketRouter = Router();

ticketRouter.get('/' , authMiddleware,authorize("superadmin"),getAllTickets);
ticketRouter.get('/:id' ,authMiddleware, getTicketById);//tested successfully.
ticketRouter.post('/' , authMiddleware,createTicket)//tested successfully.
ticketRouter.put('/:id' ,authMiddleware,authorize("civilian","admin","superadmin"), updateTicket);//tested successfully.
ticketRouter.delete('/:id' ,authMiddleware,authorize("admin","superadmin"),deleteTicket);//tested successfully.

ticketRouter.get('/user/:id' ,authMiddleware,authorize("civilian"),getTicketsByUser);//tested successfully.


ticketRouter.get('/area/:id' ,authMiddleware,authorize("admin"),getTicketsByArea);//tested successfully.



export default ticketRouter