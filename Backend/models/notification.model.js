import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    // recipient is always a User (civilian who reported, or the admin who owns the area)
    recipient : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : true ,
        index : true ,
    },
    message : {
        type : String ,
        required : true ,
    },
    type : {
        type : String ,
        enum : ['ticket_created', 'ticket_resolved', 'ticket_status_changed'] ,
        required : true ,
    },
    ticket : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Ticket' ,
    },
    read : {
        type : Boolean ,
        default : false ,
    },
}, {timestamps : true});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
