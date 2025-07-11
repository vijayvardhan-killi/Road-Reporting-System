import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js'; 

const authMiddleware = (req , res , next) => {
    try {
        const authHeader = req.headers.authorization;
        // Check if the authorization header is present and starts with 'Bearer '
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message : 'No token provided'});
        }

        // Extract the token from the authorization header
        const token = authHeader.split(' ')[1];

        // Verify the token using the secret key
        const decoded = jwt.verify(token , JWT_SECRET);

        //attach the user info to request
        req.user = {
            id :decoded.userId ,
            email : decoded.email,
            role : decoded.role
        }

        next();


    }catch (error) {
        console.error('Error in authentication middleware:', error);
        return res.status(500).json({message: 'Internal server error' ,type :"JWT Error"});
    }
};


export default authMiddleware;







