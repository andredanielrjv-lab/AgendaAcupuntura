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
  const hoje = new Date();
  const amanha = new Date(hoje);
  amanha.setDate(hoje.getDate() + 1);
  const dataFormatada = amanha.toISOString().split('T')[0];

  console.log(`Verificando agendamentos para: ${dataFormatada}`);

  const snapshot = await db.collection('dias_disponiveis')
    .where('data', '==', dataFormatada)
    .where('status', '==', 'reservado')
    .get();

  if (snapshot.empty) {
    console.log('Nenhum agendamento pendente para amanhã.');
    return;
  }

  snapshot.forEach(doc => {
    const agendamento = doc.data();
    console.log(`Encontrado: ${agendamento.nomeClient} - ${agendamento.telefoneCliente} - ${agendamento.hora}`);
  });
}

verificarAgendamentos().catch(console.error);
