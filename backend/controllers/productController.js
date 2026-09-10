const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { nom, reference, categorie, taille, couleur, quantite, stockMinimum } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (nom, reference, categorie, taille, couleur, quantite, stock_minimum) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, reference, categorie, taille, couleur, quantite, stockMinimum]
    );
    res.status(201).json({ id: result.insertId, nom, reference, categorie, taille, couleur, quantite, stockMinimum });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, reference, categorie, taille, couleur, quantite, stockMinimum } = req.body;
    await db.query(
      'UPDATE products SET nom = ?, reference = ?, categorie = ?, taille = ?, couleur = ?, quantite = ?, stock_minimum = ? WHERE id = ?',
      [nom, reference, categorie, taille, couleur, quantite, stockMinimum, id]
    );
    res.json({ id, nom, reference, categorie, taille, couleur, quantite, stockMinimum });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};