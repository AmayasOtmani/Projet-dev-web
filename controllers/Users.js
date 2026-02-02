import express from "express";
import db from "../persistance/db.js";
import { verifyToken } from "../Middleware/authmw.js";
import security from "../security/security.js";

const router = express.Router();

const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role.includes("admin")) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
};

router.get("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await db.User.findAll({
            attributes: { exclude: ['Password'] },
            include:
            {
                model : db.Role,
                through: { attributes: [] }
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id/activate", verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.Valid = true;
        await user.save();
        res.json({ message: "User activated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await db.User.findByPk(req.user.sub, {
            attributes: { exclude: ['Password'] },
            include: db.Role
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/me", verifyToken, async (req, res) => {
    const userId = req.user.sub;
    const { nom, prenom, email, password } = req.body;

    try {
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (nom) user.Nom = nom;
        if (prenom) user.Prenom = prenom;
        if (email) user.Email = email;
        if (password) {
            user.Password = await security.hashPassword(password);
        }

        await user.save();
        res.json({
            message: "Profile updated successfully", user: {
                Id: user.Id,
                Nom: user.Nom,
                Prenom: user.Prenom,
                Email: user.Email,
                Valid: user.Valid
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
