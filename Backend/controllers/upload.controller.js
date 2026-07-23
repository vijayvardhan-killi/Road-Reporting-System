export const uploadPhoto = (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error("No file uploaded");
            error.statusCode = 400;
            throw error;
        }

        const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        res.status(201).json({
            success: true,
            message: "File uploaded successfully",
            url,
        });
    } catch (error) {
        next(error);
    }
};
