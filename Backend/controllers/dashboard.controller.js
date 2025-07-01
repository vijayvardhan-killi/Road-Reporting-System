import Ticket from "../models/ticket.model.js";
import Area from "../models/area.model.js";
import User from "../models/user.model.js";

export const getAdminDashBoard = async(req , res , next) => {
    try {
        const adminId = req.user.id;

        const area  = await Area.findOne({authority : adminId}); //get area which is under current admins's authourity
        if (!area) {
            return res.status(404).json({message : "Area not found for this admin"});
        }

        const areaId = area._id;

        const [totalTickets ,openTickets , resolvedTickets ] = await Promise.all([ // get ticket stats
            Ticket.countDocuments({assignedTo : areaId}) ,
            Ticket.countDocuments({assignedTo : areaId ,status:'open'}) ,
            Ticket.countDocuments({assignedTo : areaId , status : 'in_progress'}) ,
            Ticket.countDocuments({assignedTo : areaId , status : 'resolved'}) 
        ]);

        const recentTickets = await Ticket.find({ assignedTo: areaId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email');

        res.json({
            area : area.name ,
            metrics : {
                    total : totalTickets ,
                    open : openTickets ,
                    resolvedTickets : resolvedTickets 
            },
            recentTickets
        })

    }catch (error) {
        // console.log(error);
        next(error);
    }
}



export const getSuperAdminDashBoard = async (req , res , next) => {
    try{
        const [totalTickets , resolvedTickets , totalUsers] = await Promise.all([
            Ticket.countDocuments(),
            Ticket.countDocuments({status : 'resolved'}),
            User.countDocuments({role : 'civillian'})
        ]);

        //Group by assignto attribute , count and sort the tickets
        const ticketsPerArea = await Ticket.aggregate([
            {
                $group : {
                    _id : "$assignedTo",
                    count : {$sum : 1}
                }
            },
            {
                $sort : {count : -1}
            },
            {$limit : 5}
        ]);

        const populatedAreas = await Area.find({
            _id: { $in: ticketsPerArea.map(t => t._id) }
        });

        const topAreas = ticketsPerArea.map(t => {
            const area = populatedAreas.find(a => a._id.equals(t._id));
            return {
              areaName: area?.name || "Unknown",
              ticketCount: t.count
            };
        });

        res.json({
            totalTickets,
            resolvedTickets,
            totalUsers,
            topAreas
          });
      


    }catch (error) {
        next(error);
    }
}
