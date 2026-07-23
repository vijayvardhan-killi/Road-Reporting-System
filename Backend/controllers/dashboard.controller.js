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

        const [totalTickets ,openTickets , inProgressTickets , resolvedTickets ] = await Promise.all([ // get ticket stats
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
            areaId : area._id ,
            metrics : {
                    total : totalTickets ,
                    open : openTickets ,
                    inProgress : inProgressTickets ,
                    resolved : resolvedTickets
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

// aggregated year-in-review, meant to drive renovation planning decisions.
// scoped to the requesting admin's area, or all areas for a superadmin.
export const getAnnualReport = async (req , res , next) => {
    try {
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const start = new Date(`${year}-01-01T00:00:00.000Z`);
        const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

        const matchStage = { createdAt: { $gte: start, $lt: end } };

        if (req.user.role === 'admin') {
            const area = await Area.findOne({ authority: req.user.id });
            if (!area) {
                return res.status(404).json({ message: "Area not found for this admin" });
            }
            matchStage.assignedTo = area._id;
        }

        const [totals, byArea, avgResolutionAgg] = await Promise.all([
            Ticket.aggregate([
                { $match: matchStage },
                { $group: {
                    _id: null,
                    total: { $sum: 1 },
                    resolved: { $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] } },
                    avgRisk: { $avg: "$riskRating" },
                } },
            ]),
            Ticket.aggregate([
                { $match: matchStage },
                { $group: { _id: "$assignedTo", count: { $sum: 1 }, avgRisk: { $avg: "$riskRating" } } },
                { $sort: { count: -1 } },
            ]),
            Ticket.aggregate([
                { $match: { ...matchStage, status: 'resolved', resolvedAt: { $ne: null } } },
                { $project: { resolutionDays: { $divide: [{ $subtract: ["$resolvedAt", "$createdAt"] }, 1000 * 60 * 60 * 24] } } },
                { $group: { _id: null, avgResolutionDays: { $avg: "$resolutionDays" } } },
            ]),
        ]);

        const areaIds = byArea.map(a => a._id).filter(Boolean);
        const areas = await Area.find({ _id: { $in: areaIds } });
        const areaBreakdown = byArea.map(a => ({
            areaName: areas.find(ar => ar._id.equals(a._id))?.name || "Unknown",
            ticketCount: a.count,
            avgRiskRating: a.avgRisk ? Number(a.avgRisk.toFixed(1)) : null,
        }));

        res.json({
            year,
            totalTickets: totals[0]?.total || 0,
            resolvedTickets: totals[0]?.resolved || 0,
            avgRiskRating: totals[0]?.avgRisk ? Number(totals[0].avgRisk.toFixed(1)) : null,
            avgResolutionDays: avgResolutionAgg[0]?.avgResolutionDays
                ? Number(avgResolutionAgg[0].avgResolutionDays.toFixed(1))
                : null,
            areaBreakdown,
        });
    } catch (error) {
        next(error);
    }
};
