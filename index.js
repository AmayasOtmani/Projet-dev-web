import express from "express"
import salleController from "./controllers/Salles.js";
import authController from "./controllers/Auth.js";
import reservationsController from "./controllers/Reservations.js";
import avisController from "./controllers/Avis.js";
import usersController from "./controllers/Users.js";
import statisticsController from "./controllers/Statistics.js";
import cors from "cors";
const app = express();
app.use(cors());

app.use(express.json());
app.use("/salles", salleController);
app.use("/auth",authController);
app.use("/reservations", reservationsController);
app.use("/avis", avisController);
app.use("/users", usersController);
app.use("/statistics", statisticsController);
app.listen(3000, () => {
  console.log("Server running on port 3000");
});