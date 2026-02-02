import express from "express"
import db from "../persistance/db.js"
import "dotenv/config";
import security from "../security/security.js"
import jwt from "jsonwebtoken"
import { validateSignup } from "../Middleware/validationmw.js";
const router = express.Router();


router.post("/login", async (req, res) => {
    var result = await db.User.findOne({
        where: {
            Email: req.body.email,
        },
        include: "Roles"
    });
    if (result === null || result === undefined) {
        return res.sendStatus(401);
    }

    const valid = await security.comparePassword(req.body.password, result.Password);
    if (!valid) {
        return res.sendStatus(401);
    }

    const payload = { sub: result.Id, role: result.Roles.map(r => r.Nom) };
    const secret = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secret, {
        expiresIn: '15m'
    });
    res.json({ token: token });
});

router.post("/signup", validateSignup, async (req, res) => {
    try {
        const { email, password, nom, prenom, date, role } = req.body;

        const existingUser = await db.User.findOne({ where: { Email: email } });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const newUser = await db.User.create({
            Email: email,
            Password: password,
            Nom: nom,
            Prenom: prenom,
            DateNaissance: date,
            Valid: false
        });

        const clientRole = await db.Role.findOne({ where: { Nom: role } });
        if (clientRole) {
            await newUser.addRole(clientRole);
        }
        res.status(201).json({message : 'user successfully created'});
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;