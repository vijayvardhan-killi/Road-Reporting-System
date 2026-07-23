import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        default : null ,
        index : true ,
    } ,
    isAnonymous : {
        type : Boolean ,
        default : false ,
    },
    // required only for anonymous reports so a real contact exists on file
    reporterPhone : {
        type : String ,
        match : [/^\+?[0-9]{7,15}$/ , "Please provide a valid phone number"] ,
    },
    // added location field
    title:{
        type:String,
        required:true,

    },
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
        default : null ,
    },

    description : {
        type : String ,
        minLength : 20 ,
        maxLength : 500 ,
        required : [true , "Description is required"] ,
    } ,

    // civilian-assessed risk, 1 (minor) to 10 (severe/hazardous)
    riskRating : {
        type : Number ,
        min : 1 ,
        max : 10 ,
        required : [true , "Risk rating is required"] ,
    },

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
    },
    // guards against double-awarding points if status flips back and forth
    pointsAwarded : {
        type : Boolean ,
        default : false ,
    }
}, {timestamps : true}) ;

ticketSchema.pre('validate', function(next) {
    if (this.isAnonymous && !this.reporterPhone) {
        return next(new Error('A phone number is required for anonymous reports'));
    }
    if (!this.isAnonymous && !this.user) {
        return next(new Error('A signed-in ticket must have a user'));
    }
    next();
});



const Ticket = mongoose.model('Ticket' , ticketSchema);

export default Ticket