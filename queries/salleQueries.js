import { Op } from '@sequelize/core';
import db from "../persistance/db.js"

export const filterSalles = (filter) => {
    const query = {
        where: {
            '$Reservations.id$': null
        },
        include: [{
            model: db.Reservation,
            required: false,
            where: {
                [Op.and]: [
                    { DateHeureDebut: { [Op.lt]: filter.dateMax } },
                    { DateHeureFin: { [Op.gt]: filter.dateMin } }
                ]
            }
        }]
    };
    if (filter.prixMin || filter.prixMax) {
        query.where.Prix = {
            ...(filter.prixMin && { [Op.gte]: filter.prixMin }),
            ...(filter.prixMax && { [Op.lte]: filter.prixMax })
        };
    }
    return query;
};

export default {
    filterSalles
};
