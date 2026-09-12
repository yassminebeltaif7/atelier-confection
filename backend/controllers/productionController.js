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

exports.getAllProductions = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM productions ORDER BY id DESC');
    const formatted = rows.map(p => ({
      id: p.id,
      commandeNumero: p.commande_numero,
      produit: p.produit,
      quantite: p.quantite,
      etapeActuelle: p.etape_actuelle,
      dateDebut: formatDateForFrontend(p.date_debut),
      datePrevueFin: formatDateForFrontend(p.date_prevue_fin),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createProduction = async (req, res) => {
  try {
    const { commandeNumero, produit, quantite, etapeActuelle, dateDebut, datePrevueFin } = req.body;
    const [result] = await db.query(
      'INSERT INTO productions (commande_numero, produit, quantite, etape_actuelle, date_debut, date_prevue_fin) VALUES (?, ?, ?, ?, ?, ?)',
      [commandeNumero, produit, quantite, etapeActuelle, formatDateForMysql(dateDebut), formatDateForMysql(datePrevueFin)]
    );
    res.status(201).json({ id: result.insertId, commandeNumero, produit, quantite, etapeActuelle, dateDebut, datePrevueFin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateProduction = async (req, res) => {
  try {
    const { id } = req.params;
    const { commandeNumero, produit, quantite, etapeActuelle, dateDebut, datePrevueFin } = req.body;
    await db.query(
      'UPDATE productions SET commande_numero=?, produit=?, quantite=?, etape_actuelle=?, date_debut=?, date_prevue_fin=? WHERE id=?',
      [commandeNumero, produit, quantite, etapeActuelle, formatDateForMysql(dateDebut), formatDateForMysql(datePrevueFin), id]
    );
    res.json({ id, commandeNumero, produit, quantite, etapeActuelle, dateDebut, datePrevueFin });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteProduction = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM productions WHERE id = ?', [id]);
    res.json({ message: 'Production supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};