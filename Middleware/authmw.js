import jwt from "jsonwebtoken";
import "dotenv/config";

const verifyToken = (req, res, next) => {
    try {

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.sendStatus(401);
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.sendStatus(401);
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Invalid token
            }
            req.user = user;
            next();
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export { verifyToken };