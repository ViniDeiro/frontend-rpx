import mongoose from 'mongoose';

// URI de conexão com o MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rpx-platform';

if (!MONGODB_URI) {
  throw new Error('Por favor, defina a variável de ambiente MONGODB_URI');
}

// Variável para conexão persistente
let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = { 
  conn: null, 
  promise: null 
};

export async function connectToDatabase() {
  // Se já houver uma conexão, retorne-a
  if (cached.conn) {
    return cached.conn;
  }

  // Se não houver uma promessa de conexão em andamento, crie uma
  if (!cached.promise) {
    console.log('Tentando conectar ao MongoDB em:', MONGODB_URI);
    cached.promise = mongoose.connect(MONGODB_URI)
      .then((mongoose) => {
        console.log('✅ Conectado ao MongoDB com sucesso!');
        return mongoose;
      })
      .catch((err) => {
        console.error('❌ Erro ao conectar ao MongoDB:', err);
        cached.promise = null;
        console.log('❌ Falha na conexão com MongoDB - verifique as configurações e conexão de rede');
        throw err;
      });
  }

  // Aguarde a promessa ser resolvida
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    console.error("Erro crítico na conexão:", err);
    throw err; // Lançar erro para que o problema real seja exibido
  }
}

// Função para verificar se estamos usando modo simulado - sempre retorna false
export function isUsingSimulatedMode() {
  return false; // Sempre retorna false, forçando o uso exclusivo do MongoDB
}

// Para desconectar quando necessário
export async function disconnectFromDatabase() {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('Desconectado do MongoDB com sucesso!');
  }
} 