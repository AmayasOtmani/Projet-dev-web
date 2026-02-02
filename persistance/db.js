import { Sequelize, DataTypes } from 'sequelize';
import { hashPassword } from '../security/security.js';
const IdType = () => ({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
})
const sequelize = new Sequelize('sqlite::memory:');
const User = sequelize.define('User', {
    Id: IdType(),
    Nom: DataTypes.STRING,
    Prenom: DataTypes.STRING,
    Email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    DateNaissance: DataTypes.DATE,
    Password: DataTypes.STRING,
    Valid:DataTypes.BOOLEAN,
});
const Role = sequelize.define('Role', {
    Id: IdType(),
    Nom: DataTypes.STRING,
});

const Salle = sequelize.define('Salle', {
    Id: IdType(),
    Nom: DataTypes.STRING,
    Addresse: DataTypes.STRING,
    Description: DataTypes.STRING,
    Capacite: DataTypes.INTEGER,
    Prix: DataTypes.FLOAT,
    Longitude: DataTypes.FLOAT,
    Latitude: DataTypes.FLOAT,
    UserId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'Id'
        }
    }
});

const Commentaire = sequelize.define('Commentaire', {
    Id: IdType(),
    Text:DataTypes.STRING,
});
const Avis = sequelize.define('Avis', {
    Id: IdType(),
    Note : DataTypes.FLOAT,
});

const Reservation = sequelize.define('Reservation', {
    Id: IdType(),
    DateHeureDebut: DataTypes.DATE,
    DateHeureFin: DataTypes.DATE
});

User.belongsToMany(Role, { through: 'UserRoles' });
Role.belongsToMany(User, { through: 'UserRoles' });

User.hasMany(Salle, { foreignKey: 'UserId' });
Salle.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(Reservation, { foreignKey: 'UserId' });
Salle.hasMany(Reservation, { foreignKey: 'SalleId' });

Reservation.belongsTo(User, { foreignKey: 'UserId' });
Reservation.belongsTo(Salle, { foreignKey: 'SalleId' });

Commentaire.belongsTo(User, { foreignKey: 'UserId' });
Commentaire.belongsTo(Salle, { foreignKey: 'SalleId' });

Avis.belongsTo(User, { foreignKey: 'UserId' });
Avis.belongsTo(Salle, { foreignKey: 'SalleId' });

User.beforeCreate(async (user) => {
    user.Password = await hashPassword(user.Password);
});
User.beforeUpdate(async (user) => {
    if (user.changed('Password')) {
        user.Password = await hashPassword(user.Password);
    }
});

await sequelize.sync({ force: true });

/*
seed data
 */
const admin = await User.create({
    Nom: "Admin",
    Prenom: "Admin",
    Email: "admin@gmail.com",
    DateNaissance: new Date(),
    Password: "password"
})

const prop = await User.create({
    Nom: "prop",
    Prenom: "prop",
    Valid:true,
    Email: "prop@gmail.com",
    DateNaissance: new Date(),
    Password: "password"
});

const client = await User.create({
    Nom: "cli",
    Prenom: "cli",
    Email: "cli@gmail.com",
    Valid:true,
    DateNaissance: new Date(),
    Password: "password"
});
const roles = ["admin", "client", "proprietaire"];

let createdRoles = [];

for (const role of roles) {
    const [roleInstance] = await Role.findOrCreate({
        where: { Nom: role }
    });
    createdRoles.push(roleInstance);
}

const roleInstances = createdRoles.map((role) => role);

await admin.addRole(
    roleInstances.find(r => r.Nom === "admin")
);
await prop.addRole(
    roleInstances.find(r => r.Nom === "proprietaire")
);
await client.addRole(
    roleInstances.find(r => r.Nom === "client")
);
export default {
    User,
    Role,
    Salle,
    Reservation,
    Avis,
    Commentaire
};