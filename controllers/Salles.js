import express from "express"
import db from "../persistance/db.js"
import { verifyToken } from "../Middleware/authmw.js";
import { validateSalle } from "../Middleware/validationmw.js";
import { filterSalles } from "../queries/salleQueries.js"
const router = express.Router();

router.get("/", async (req, res) => {
    const query = filterSalles({
        prixMin: req.query.prixMin,
        prixMax: req.query.prixMax,
        dateMin: req.query.dateMin,
        dateMax: req.query.dateMax
    });
    var salles = await db.Salle.findAll(query);
    res.json(salles);
});

router.post("/", verifyToken, validateSalle, async (req, res) => {
    const userRoles = req.user.role;
    const userId = req.user.sub;

    if (!userRoles.includes("proprietaire")) {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const { nom, addresse, longitude, latitude, description, capacite, prix } = req.body;
        const newSalle = await db.Salle.create({
            Nom: nom,
            Addresse: addresse,
            Description: description,
            Capacite: capacite,
            Prix: prix,
            Longitude: longitude,
            Latitude: latitude,
            UserId: userId
        });
        res.status(201).json(newSalle);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const salle = await db.Salle.findByPk(req.params.id);
        if (salle) {
            res.json(salle);
        } else {
            res.status(404).json({ message: "Salle not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", verifyToken, validateSalle, async (req, res) => {
    const userRoles = req.user.role;
    const userId = req.user.sub;

    try {
        const salle = await db.Salle.findByPk(req.params.id);
        if (!salle) {
            return res.status(404).json({ message: "Salle not found" });
        }

        if (salle.UserId !== userId && !userRoles.includes("admin")) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const { nom, addresse, longitude, latitude, description, capacite, prix } = req.body;
        await salle.update({
            Nom: nom,
            Addresse: addresse,
            Description: description,
            Capacite: capacite,
            Prix: prix,
            Longitude: longitude,
            Latitude: latitude
        });
        res.json(salle);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", verifyToken, async (req, res) => {
    const userRoles = req.user.role;
    const userId = req.user.sub;

    try {
        const salle = await db.Salle.findByPk(req.params.id);
        if (!salle) {
            return res.status(404).json({ message: "Salle not found" });
        }

        if (salle.UserId !== userId && !userRoles.includes("admin")) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await salle.destroy();
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});


export default router;