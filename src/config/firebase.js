import admin from 'firebase-admin';
import fs from 'fs';

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // 🌐 Cas Render (variable d'environnement)
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  // 💻 Cas local (fichier JSON)
  serviceAccount = JSON.parse(
    fs.readFileSync('src/config/serviceAccountKey.json', 'utf8')
  );
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
