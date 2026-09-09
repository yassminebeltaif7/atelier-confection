const express = require("express");
const cors = require("cors");

require("./config/db");

const clientRoutes = require("./routes/clientRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Atelier de Confection fonctionne"
  });
});

app.use("/api/clients", clientRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});