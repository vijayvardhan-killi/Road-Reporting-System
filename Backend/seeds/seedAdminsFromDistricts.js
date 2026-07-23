import mongoose from "mongoose";
import bcrypt  from "bcryptjs";
import { config } from "dotenv";
import { districtData } from "./data/districts.js";
import User from "../models/user.model.js";
import Area from "../models/area.model.js";

config({ path: ".env" });

const seedAdmins = async () => {
    try {
        const DB_URI = process.env.DB_URI;
        if (!DB_URI) {
            throw new Error("DB_URI is not set. Create a .env file (see .env.example).");
        }
        await mongoose.connect(DB_URI);
        console.log("Connected to MongoDB");

        for (const district of districtData) {
            const email = `admin.${district.name.toLowerCase().replace(/\s+/g, '')}@example.com`;

            const existingUser = await User.findOne({email : email});
            if (existingUser) {
                console.log(`User with email ${district.email} already exists.`);
                continue;
            }
            
            const SALT =await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash('admin123', SALT);

            const newUser = await User.create([{
                name : `Admin ${district.name}`,
                email,
                password : hashedPassword,
                role : 'admin',
            }]);

            await Area.create([{
                name : district.name , 
                location : {
                    type : "Point",
                    coordinates : [district.coordinates[1], district.coordinates[0]]
                },
                authority : newUser[0]._id
            }]);

            console.log(`Admin for ${district.name} created successfully.`);
        }
        console.log("All admins seeded successfully.");
        process.exit(0);
    }catch (error){
        console.error("Error During Seesding:", error);
        process.exit(1);
    }
}

seedAdmins()
