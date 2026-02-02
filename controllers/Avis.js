import express from "express";
import db from "../persistance/db.js";
import { verifyToken } from "../Middleware/authmw.js";
import { validateAvis } from "../Middleware/validationmw.js";
import { Op } from "sequelize";

const router = express.Router();

router.post("/", verifyToken, validateAvis, async (req, res) => {
    const userId = req.user.sub;
    const { salleId, note, text } = req.body;

    try {
        const pastReservation = await db.Reservation.findOne({
            where: {
                UserId: userId,
                SalleId: salleId,
                DateHeureFin: {
                    [Op.lt]: new Date(),
                },
            },
        });

        if (!pastReservation) {
            return res.status(403).json({ message: "You can only review a salle after a past reservation." });
        }

        if (note !== undefined) {
            await db.Avis.create({
                UserId: userId,
                SalleId: salleId,
                Note: note,
            });
        }

        if (text !== undefined) {
            await db.Commentaire.create({
                UserId: userId,
                SalleId: salleId,
                Text: text,
            });
        }

        res.status(201).json({ message: "Review created successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/salles/:salleId", async (req, res) => {
    const { salleId } = req.params;
    try {
        const avis = await db.Avis.findAll({ where: { SalleId: salleId } });
        const commentaires = await db.Commentaire.findAll({ where: { SalleId: salleId } });
        res.json({ avis, commentaires });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/avis/:id", verifyToken, async (req, res) => {
    const userRoles = req.user.role;
    if (!userRoles.includes("admin")) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const avis = await db.Avis.findByPk(req.params.id);
        if (!avis) {
            return res.status(404).json({ message: "Avis not found" });
        }
        await avis.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/commentaires/:id", verifyToken, async (req, res) => {
    const userRoles = req.user.role;
    if (!userRoles.includes("admin")) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const commentaire = await db.Commentaire.findByPk(req.params.id);
        if (!commentaire) {
            return res.status(404).json({ message: "Commentaire not found" });
        }
        await commentaire.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
