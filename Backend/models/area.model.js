import mongoose from "mongoose";

const areaSchema = new mongoose.Schema({
    name : {
        type : String ,
        required : [true , "Area name is required"] ,
        unique : true ,
        trim : true ,
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
    authority : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'User' ,
        required : true ,
    }
}, {timestamps : true});


areaSchema.index({location : '2dsphere'}); // Create a 2dsphere index for geospatial queries

const Area = mongoose.model('Area', areaSchema);

export default Area;