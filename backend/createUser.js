const bcrypt = require('bcryptjs');
const db = require('./config/db');

async function createUser() {
  const nom = 'Admin';
  const email = 'admin@atelier.com';
  const plainPassword = 'admin123';

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  try {
    await db.query(
      'INSERT INTO users (nom, email, password) VALUES (?, ?, ?)',
      [nom, email, hashedPassword]
    );
    console.log('Utilisateur créé avec succès !');
    console.log('Email:', email);
    console.log('Mot de passe (non haché, pour vous rappeler):', plainPassword);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
  process.exit();
}

createUser();