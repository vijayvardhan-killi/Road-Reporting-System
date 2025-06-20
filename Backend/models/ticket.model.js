import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required :true ,
        index : true ,
    } ,
    // added location field
    location : {
        type : {
            type : String ,
            enum : ['Point'] ,
            default : 'Point' ,
        },

        coordinates : {
            type : [Number] , // [longitude, latitude]
            required : true ,
        }
    },
    
    photoUrl : {
        type : String ,
        required : [true , "Photo URL is required"] ,
    },

    description : {
        type : String ,
        minLength : 20 ,
        maxLength : 500 ,
        required : [true , "Description is required"] ,
    } ,

    status : {
        type : String ,
        enum : ['open', 'in_progress' , 'resolved'] ,
        default : 'open' ,
    },

    assignedTo : {
        type : mongoose.Schema.Types.ObjectId , 
        default : null ,
        ref : 'Area' , // Assuming the authority is an Area, change if necessary
        index : true,
    } ,
    resolvedAt : {
        type : Date 
    }
}, {timestamps : true}) ;



const Ticket = mongoose.model('Ticket' , ticketSchema);

export default Ticket