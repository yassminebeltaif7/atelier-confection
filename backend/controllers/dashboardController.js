const db = require('../config/db');

function formatDateForFrontend(mysqlDate) {
  if (!mysqlDate) return '';
  const date = new Date(mysqlDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

exports.getStats = async (req, res) => {
  try {
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ ordersInProgress }]] = await db.query(
      "SELECT COUNT(*) AS ordersInProgress FROM orders WHERE statut IN ('En préparation', 'En production')"
    );
    const [[{ ordersCompleted }]] = await db.query(
      "SELECT COUNT(*) AS ordersCompleted FROM orders WHERE statut IN ('Terminée', 'Livrée')"
    );
    const [[{ ordersLate }]] = await db.query(
      "SELECT COUNT(*) AS ordersLate FROM orders WHERE date_livraison < CURDATE() AND statut NOT IN ('Livrée', 'Annulée')"
    );
    const [[{ totalProducts }]] = await db.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[{ lowStockProducts }]] = await db.query(
      'SELECT COUNT(*) AS lowStockProducts FROM products WHERE quantite <= stock_minimum'
    );
    const [[{ tasksInProgress }]] = await db.query(
      "SELECT COUNT(*) AS tasksInProgress FROM tasks WHERE statut = 'En cours'"
    );
    const [[{ tasksLate }]] = await db.query(
      "SELECT COUNT(*) AS tasksLate FROM tasks WHERE date_limite < CURDATE() AND statut NOT IN ('Terminé', 'Annulé')"
    );

    res.json({
      totalOrders, ordersInProgress, ordersCompleted, ordersLate,
      totalProducts, lowStockProducts, tasksInProgress, tasksLate
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getRecentOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT numero, client, produit, statut, date_livraison FROM orders ORDER BY id DESC LIMIT 5'
    );
    const formatted = rows.map(o => ({
      orderNumber: o.numero,
      client: o.client,
      product: o.produit,
      status: o.statut,
      deliveryDate: formatDateForFrontend(o.date_livraison),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getUpcomingTasks = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT titre, date_limite, priorite FROM tasks
       WHERE statut NOT IN ('Terminé', 'Annulé') AND date_limite >= CURDATE()
       ORDER BY date_limite ASC LIMIT 5`
    );
    const formatted = rows.map(t => ({
      title: t.titre,
      dueDate: formatDateForFrontend(t.date_limite),
      priority: t.priorite,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getStockAlerts = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT nom, quantite, stock_minimum FROM products WHERE quantite <= stock_minimum ORDER BY quantite ASC LIMIT 5'
    );
    const formatted = rows.map(p => ({
      productName: p.nom,
      currentQuantity: p.quantite,
      minQuantity: p.stock_minimum,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};