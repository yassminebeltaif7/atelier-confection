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

exports.getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY id DESC');
    const formatted = rows.map(t => ({
      id: t.id,
      titre: t.titre,
      description: t.description,
      productionAssociee: t.production_associee,
      responsable: t.responsable,
      priorite: t.priorite,
      statut: t.statut,
      dateDebut: formatDateForFrontend(t.date_debut),
      dateLimite: formatDateForFrontend(t.date_limite),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { titre, description, productionAssociee, responsable, priorite, statut, dateDebut, dateLimite } = req.body;
    const [result] = await db.query(
      'INSERT INTO tasks (titre, description, production_associee, responsable, priorite, statut, date_debut, date_limite) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [titre, description, productionAssociee, responsable, priorite, statut, formatDateForMysql(dateDebut), formatDateForMysql(dateLimite)]
    );
    res.status(201).json({ id: result.insertId, titre, description, productionAssociee, responsable, priorite, statut, dateDebut, dateLimite });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, productionAssociee, responsable, priorite, statut, dateDebut, dateLimite } = req.body;
    await db.query(
      'UPDATE tasks SET titre=?, description=?, production_associee=?, responsable=?, priorite=?, statut=?, date_debut=?, date_limite=? WHERE id=?',
      [titre, description, productionAssociee, responsable, priorite, statut, formatDateForMysql(dateDebut), formatDateForMysql(dateLimite), id]
    );
    res.json({ id, titre, description, productionAssociee, responsable, priorite, statut, dateDebut, dateLimite });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};