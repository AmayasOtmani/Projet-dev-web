import express from "express";
import db from "../persistance/db.js";
import { verifyToken } from "../Middleware/authmw.js";
import { Op } from "sequelize";

const router = express.Router();

// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
    if (!req.user || !req.user.role.includes("admin")) {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    next();
};

router.get("/reservations/count", verifyToken, isAdmin, async (req, res) => {
    try {
        const count = await db.Reservation.count();
        res.json({ totalReservations: count });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/salles/:salleId/revenue", verifyToken, async (req, res) => {
    const { salleId } = req.params;
    const userId = req.user.sub;
    const userRoles = req.user.role;

    try {
        const salle = await db.Salle.findByPk(salleId);
        if (!salle) {
            return res.status(404).json({ message: "Salle not found" });
        }

        if (salle.UserId !== userId && !userRoles.includes("proprietaire")) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const reservations = await db.Reservation.findAll({
            where: { SalleId: salleId},
            include: [{ model: db.Salle, attributes: ['Prix'] }]
        });

        let totalRevenue = 0;
        for (const reservation of reservations) {
            const startDate = new Date(reservation.DateHeureDebut);
            const endDate = new Date(reservation.DateHeureFin);
            const durationHours = Math.abs(endDate - startDate) / 36e5;
            totalRevenue += durationHours * reservation.Salle.Prix;
        }
        res.json({ salleId: salleId, totalRevenue: totalRevenue });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/users/:userId/revenue", verifyToken, async (req, res) => {
    const { userId } = req.params;
    const authenticatedUserId = req.user.sub;
    const userRoles = req.user.role;

    if (userId !== authenticatedUserId && !userRoles.includes("admin")) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const salles = await db.Salle.findAll({ where: { UserId: userId } });
        const salleIds = salles.map(salle => salle.Id);

        const reservations = await db.Reservation.findAll({
            where: { SalleId: { [Op.in]: salleIds } },
            include: [{ model: db.Salle, attributes: ['Prix'] }]
        });

        let totalRevenue = 0;
        for (const reservation of reservations) {
            const startDate = new Date(reservation.DateHeureDebut);
            const endDate = new Date(reservation.DateHeureFin);
            const durationHours = Math.abs(endDate - startDate) / 36e5; // duration in hours
            totalRevenue += durationHours * reservation.Salle.Prix;
        }

        res.json({ userId: userId, totalRevenue: totalRevenue });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
