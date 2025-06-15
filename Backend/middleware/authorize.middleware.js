const authorize = (...roles) => {
    return (req , res , next) => {
        try {
            if (!req.user) {
                return res.status(401).json({message : 'Unauthorized'});
            }

            if(!roles.includes(req.user.role)) {
                return res.status(403).json({message : "Forbidden"});
            }

            next();
        }
        catch (error) {
            console.error('Error in authorization middleware:', error);
            return res.status(500).json({message : 'Internal server errror while authorixing'})
        }
    }
}


export default authorize;