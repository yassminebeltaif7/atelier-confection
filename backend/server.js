const express = require("express");
const cors = require("cors");

require("./config/db");

const clientRoutes = require("./routes/clientRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const productionRoutes = require("./routes/productionRoutes");
const taskRoutes = require("./routes/taskRoutes");
const stockRoutes = require("./routes/stockRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API Atelier de Confection fonctionne"
  });
});

app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/productions", productionRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", authRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});