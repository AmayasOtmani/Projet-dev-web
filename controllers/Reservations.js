import express from "express";
import db from "../persistance/db.js";
import { verifyToken } from "../Middleware/authmw.js";
import { validateReservation } from "../Middleware/validationmw.js";
import { Op } from "sequelize";

const router = express.Router();

router.post("/", verifyToken, validateReservation, async (req, res) => {
    const userId = req.user.sub;
    const { salleId, dateHeureDebut, dateHeureFin } = req.body;

    try {
        const salle = await db.Salle.findByPk(salleId);
        if (!salle) {
            return res.status(404).json({ message: "Salle not found" });
        }

        const overlappingReservation = await db.Reservation.findOne({
            where: {
                SalleId: salleId,
                [Op.or]: [
                    {
                        DateHeureDebut: {
                            [Op.between]: [dateHeureDebut, dateHeureFin],
                        },
                    },
                    {
                        DateHeureFin: {
                            [Op.between]: [dateHeureDebut, dateHeureFin],
                        },
                    },
                ],
            },
        });

        if (overlappingReservation) {
            return res.status(409).json({ message: "Salle not available for the selected time" });
        }

        const newReservation = await db.Reservation.create({
            UserId: userId,
            SalleId: salleId,
            DateHeureDebut: dateHeureDebut,
            DateHeureFin: dateHeureFin,
        });

        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/", verifyToken, async (req, res) => {
    const userId = req.user.sub;
    try {
        const reservations = await db.Reservation.findAll({ 
            where: { UserId: userId },
            include: db.Salle // Include Salle data
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const userId = req.user.sub;
    const userRoles = req.user.role;

    try {
        const reservation = await db.Reservation.findByPk(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        if (reservation.UserId !== userId && !userRoles.includes("admin")) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await reservation.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
