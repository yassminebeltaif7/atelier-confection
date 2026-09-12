const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect.' });
    }

    res.json({
      message: 'Connexion réussie',
      user: { id: user.id, nom: user.nom, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};