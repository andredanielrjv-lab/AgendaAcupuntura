const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  })
});

const db = getFirestore();

async function verificarAgendamentos() {
  console.log('Buscando todos os documentos da coleção dias_disponiveis...');

  const snapshot = await db.collection('dias_disponiveis').get();

  if (snapshot.empty) {
    console.log('A coleção dias_disponiveis está vazia.');
    return;
  }

  snapshot.forEach(doc => {
    const dados = doc.data();
    console.log(`ID: ${doc.id} | Data: ${dados.data} | Status: ${dados.status} | Cliente: ${dados.nomeCliente}`);
  });
}

verificarAgendamentos().catch(console.error);
