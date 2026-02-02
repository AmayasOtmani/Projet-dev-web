const validateSignup = (req, res, next) => {
    const { email, password, nom, prenom } = req.body;

    if (!email || !password || !nom || !prenom) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }
    next();
};
const validateSalle = (req, res, next) => {
    const { nom, addresse, longitude, latitude, description, capacite, prix } = req.body;
    if (!nom || !addresse || !longitude || !latitude || !description || !capacite || !prix) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if(longitude > 180 || longitude < -180 || latitude > 90 || latitude < -90) {
        return res.status(400).json({ message: "Invalid longitude or latitude" });
    }
    if (parseInt(capacite) <= 0) {
        return res.status(400).json({ message: "Capacite must be a positive integer" });
    }
    if (parseInt(capacite) <= 0) {
        return res.status(400).json({ message: "Prix must be a positive number" });
    }
    next();
}
const validateReservation = (req, res, next) => {
    const { salleId, dateHeureDebut, dateHeureFin } = req.body;
    if (!salleId || !dateHeureDebut || !dateHeureFin) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const startDate = new Date(dateHeureDebut);
    const endDate = new Date(dateHeureFin);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
    }

    if (startDate >= endDate) {
        return res.status(400).json({ message: "End date must be after start date" });
    }

    next();
};

const validateAvis = (req, res, next) => {
    const { salleId, note, text } = req.body;
    if (!salleId) {
        return res.status(400).json({ message: "salleId is required" });
    }

    if (note === undefined && text === undefined) {
        return res.status(400).json({ message: "At least one of note or text is required" });
    }

    if (note !== undefined) {
        if (parseFloat(note) < 0 || parseFloat(note) > 5) {
            return res.status(400).json({ message: "Note must be a number between 0 and 5" });
        }
    }

    next();
};

export { validateSignup, validateSalle, validateReservation, validateAvis };
