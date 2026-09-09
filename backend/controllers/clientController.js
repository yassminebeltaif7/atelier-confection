const db = require('../config/db');

exports.getAllClients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createClient = async (req, res) => {
  try {
    const { nom, prenom, telephone, email, adresse } = req.body;
    const [result] = await db.query(
      'INSERT INTO clients (nom, prenom, telephone, email, adresse) VALUES (?, ?, ?, ?, ?)',
      [nom, prenom, telephone, email, adresse]
    );
    res.status(201).json({ id: result.insertId, nom, prenom, telephone, email, adresse });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom, prenom, telephone, email, adresse } = req.body;
    await db.query(
      'UPDATE clients SET nom = ?, prenom = ?, telephone = ?, email = ?, adresse = ? WHERE id = ?',
      [nom, prenom, telephone, email, adresse, id]
    );
    res.json({ id, nom, prenom, telephone, email, adresse });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ message: 'Client supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
