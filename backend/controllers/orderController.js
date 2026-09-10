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

exports.getAllOrders = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM orders ORDER BY id DESC');
    const formatted = rows.map(o => ({
      id: o.id,
      numero: o.numero,
      client: o.client,
      produit: o.produit,
      quantite: o.quantite,
      taille: o.taille,
      couleur: o.couleur,
      dateCommande: formatDateForFrontend(o.date_commande),
      dateLivraison: formatDateForFrontend(o.date_livraison),
      statut: o.statut,
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { numero, client, produit, quantite, taille, couleur, dateCommande, dateLivraison, statut } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (numero, client, produit, quantite, taille, couleur, date_commande, date_livraison, statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [numero, client, produit, quantite, taille, couleur, formatDateForMysql(dateCommande), formatDateForMysql(dateLivraison), statut]
    );
    res.status(201).json({ id: result.insertId, numero, client, produit, quantite, taille, couleur, dateCommande, dateLivraison, statut });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { numero, client, produit, quantite, taille, couleur, dateCommande, dateLivraison, statut } = req.body;
    await db.query(
      'UPDATE orders SET numero=?, client=?, produit=?, quantite=?, taille=?, couleur=?, date_commande=?, date_livraison=?, statut=? WHERE id=?',
      [numero, client, produit, quantite, taille, couleur, formatDateForMysql(dateCommande), formatDateForMysql(dateLivraison), statut, id]
    );
    res.json({ id, numero, client, produit, quantite, taille, couleur, dateCommande, dateLivraison, statut });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM orders WHERE id = ?', [id]);
    res.json({ message: 'Commande supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};