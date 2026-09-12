const db = require('../config/db');

function formatDateForMysql(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`;
}

function formatDateForFrontend(mysqlDate) {
  if (!mysqlDate) return '';
  const date = new Date(mysqlDate);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// === ARTICLES ===

exports.getAllItems = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM stock_items ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { nom, categorie, quantite, unite } = req.body;
    const [result] = await db.query(
      'INSERT INTO stock_items (nom, categorie, quantite, unite) VALUES (?, ?, ?, ?)',
      [nom, categorie, quantite, unite]
    );
    res.status(201).json({ id: result.insertId, nom, categorie, quantite, unite });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, categorie, quantite, unite } = req.body;
    await db.query(
      'UPDATE stock_items SET nom=?, categorie=?, quantite=?, unite=? WHERE id=?',
      [nom, categorie, quantite, unite, id]
    );
    res.json({ id, nom, categorie, quantite, unite });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM stock_items WHERE id = ?', [id]);
    res.json({ message: 'Article supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// === MOUVEMENTS ===

exports.getAllMovements = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT sm.id, sm.item_id, si.nom AS item_nom, sm.type, sm.quantite, sm.date
       FROM stock_movements sm
       JOIN stock_items si ON sm.item_id = si.id
       ORDER BY sm.id DESC`
    );
    const formatted = rows.map(m => ({
      id: m.id,
      itemId: m.item_id,
      itemNom: m.item_nom,
      type: m.type,
      quantite: m.quantite,
      date: formatDateForFrontend(m.date),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createMovement = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { itemId, type, quantite, date } = req.body;

    const [items] = await connection.query('SELECT * FROM stock_items WHERE id = ?', [itemId]);
    if (items.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Article introuvable' });
    }

    const item = items[0];
    let newQuantite = item.quantite;

    if (type === 'Entrée') {
      newQuantite += quantite;
    } else {
      newQuantite = Math.max(0, newQuantite - quantite);
    }

    await connection.query('UPDATE stock_items SET quantite = ? WHERE id = ?', [newQuantite, itemId]);

    await connection.query(
      'INSERT INTO stock_movements (item_id, type, quantite, date) VALUES (?, ?, ?, ?)',
      [itemId, type, quantite, formatDateForMysql(date)]
    );

    await connection.commit();
    res.status(201).json({ message: 'Mouvement enregistré', newQuantite });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  } finally {
    connection.release();
  }
};