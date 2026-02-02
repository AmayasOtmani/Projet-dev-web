const { Op } = require("sequelize");
import db from "../persistance/db.js"

const filterSalles = (filter) => {
    const query = {
        include: {
            model: db.Reservation,
        }
    }
    if (filter.dateMin) {
        query.include.where.DateHeureFin = { [Op.lt]: filter.dateMin }
    }
    if (filter.dateMax) {
        query.include.where.DateHeureDebut = { [Op.gt]: filter.dateMax }
    }
    query.where.Prix = {
        ...(query.where.Prix || {}),
        ...(filter.prixMin && { [Op.gte]: filter.prixMin }),
        ...(filter.prixMax && { [Op.lte]: filter.prixMax })
    };
}
module.exports = {
    filterSalles
};
