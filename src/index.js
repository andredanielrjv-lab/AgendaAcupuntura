const admin = require('firebase-admin');

// Inicialização segura
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function verificarAgendamentos() {
  const amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);
  const dataFormatada = amanha.toISOString().split('T')[0]; 

  console.log(`Verificando agendamentos para: ${dataFormatada}`);

  const snapshot = await db.collection('dias_disponiveis')
    .where('data', '==', dataFormatada)
    .where('status', '==', 'reservado')
    .where('lembreteEnviado', '==', null)
    .get();

  if (snapshot.empty) {
    console.log('Nenhum agendamento pendente para amanhã.');
    return;
  }

  snapshot.forEach(doc => {
    const agendamento = doc.data();
    const mensagem = `Boa tarde, gostaria de lembrar a você de sua consulta agendada com a Renata, acupunturista! Para o dia: ${agendamento.data} às ${agendamento.hora}. Por favor, retorne essa mensagem confirmando! Caso precise, nosso contato é (11) 96494-5810.`;

    if (process.env.DRY_RUN === 'true') {
      console.log(`[DRY RUN] Simulando envio para ${agendamento.telefoneCliente}: ${mensagem}`);
    } else {
      console.log(`Enviando para ${agendamento.telefoneCliente}...`);
    }
  });
}

verificarAgendamentos().catch(console.error);
