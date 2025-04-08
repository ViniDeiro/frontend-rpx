'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Plus, X, UserPlus, Share2, MessageCircle, Settings, PlayCircle, DollarSign, Users } from 'react-feather';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import CrownIcon from '@/components/ui/CrownIcon';
import { Match } from '@/types/match';
import MatchRoomModal from '@/components/modals/MatchRoomModal';

// Tipos para o formato do lobby
type LobbyType = 'solo' | 'duo' | 'squad';

// Tipo para jogador no lobby
interface LobbyPlayer {
  id: string;
  name: string;
  avatar: string;
  level: number;
  rank?: string;
  isLeader?: boolean;
}

export default function LobbyPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [lobbyType, setLobbyType] = useState<LobbyType>('solo');
  const [players, setPlayers] = useState<LobbyPlayer[]>([]);
  const [showLobbyAnimation, setShowLobbyAnimation] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [paymentOption, setPaymentOption] = useState<'captain' | 'split'>('captain');
  
  // Estados para a funcionalidade de busca de partida
  const [isSearchingMatch, setIsSearchingMatch] = useState(false);
  const [foundMatch, setFoundMatch] = useState<Match | null>(null);
  const [showMatchRoomModal, setShowMatchRoomModal] = useState(false);
  
  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);
  
  // Inicializar o lobby quando o usuário for carregado
  useEffect(() => {
    if (user) {
      // Iniciar com o próprio usuário como líder
      const currentPlayer: LobbyPlayer = {
        id: user.id,
        name: user.name,
        avatar: user.avatarId || '/images/avatars/default.svg',
        level: user.level || 1,
        rank: 'diamante', // Exemplo, idealmente viria do perfil do usuário
        isLeader: true
      };
      
      setPlayers([currentPlayer]);
      
      // Mostrar animação de entrada no lobby
      setShowLobbyAnimation(true);
      
      // Esconder a animação após 2 segundos
      setTimeout(() => {
        setShowLobbyAnimation(false);
      }, 2000);
    }
  }, [user]);
  
  // Adicionar um jogador ao lobby (simulado)
  const addPlayer = () => {
    // Verificar se já atingiu o limite do lobby
    if (
      (lobbyType === 'solo' && players.length >= 1) ||
      (lobbyType === 'duo' && players.length >= 2) ||
      (lobbyType === 'squad' && players.length >= 4)
    ) {
      return;
    }
    
    // Simular adição de um novo jogador
    const mockPlayers = [
      {
        id: 'mock1',
        name: 'PlayerPRO',
        avatar: '/images/avatars/blue.svg',
        level: 42,
        rank: 'platina'
      },
      {
        id: 'mock2',
        name: 'GameMaster99',
        avatar: '/images/avatars/green.svg',
        level: 27,
        rank: 'ouro'
      },
      {
        id: 'mock3',
        name: 'BetWinner2023',
        avatar: '/images/avatars/purple.svg',
        level: 15,
        rank: 'prata'
      }
    ];
    
    // Pegar um jogador aleatório da lista de mock
    const randomIndex = Math.floor(Math.random() * mockPlayers.length);
    const newPlayer = mockPlayers[randomIndex];
    
    if (!players.some(p => p.id === newPlayer.id)) {
      setPlayers([...players, newPlayer]);
    }
  };
  
  // Remover um jogador do lobby
  const removePlayer = (playerId: string) => {
    // Não permite remover o líder (você mesmo)
    if (players.find(p => p.id === playerId)?.isLeader) {
      return;
    }
    
    setPlayers(players.filter(p => p.id !== playerId));
  };
  
  // Mudança de tipo de lobby
  const changeLobbyType = (type: LobbyType) => {
    setLobbyType(type);
    
    // Manter apenas o líder ao mudar o tipo
    const leader = players.find(p => p.isLeader);
    if (leader) {
      setPlayers([leader]);
    }
  };
  
  // Calcular slots disponíveis baseado no tipo de lobby
  const getAvailableSlots = () => {
    const maxPlayers = lobbyType === 'solo' ? 1 : lobbyType === 'duo' ? 2 : 4;
    return Array(maxPlayers - players.length).fill(null);
  };
  
  // Iniciar jogo
  const startGame = () => {
    // Iniciar a animação de busca de partida
    setIsSearchingMatch(true);
    
    // Simular o tempo de busca (2-4 segundos)
    const searchTime = Math.floor(Math.random() * 2000) + 2000;
    
    setTimeout(() => {
      // Criar uma partida mockada que corresponde às especificações do lobby
      const mockMatch: Match = {
        id: `match-${Date.now()}`,
        title: `Partida ${lobbyType.charAt(0).toUpperCase() + lobbyType.slice(1)} #${Math.floor(10000 + Math.random() * 90000)}`,
        mode: lobbyType,
        type: 'regular',
        teamSize: lobbyType === 'solo' ? 1 : lobbyType === 'duo' ? 2 : 4,
        status: 'in_progress',
        entryFee: 10,
        prize: 18,
        odd: 1.8,
        platform: 'mixed',
        createdAt: new Date().toISOString(),
        paymentOption: lobbyType !== 'solo' ? paymentOption : 'split',
      };
      
      // Parar a animação de busca e mostrar a partida encontrada
      setIsSearchingMatch(false);
      setFoundMatch(mockMatch);
      
      // Exibir o modal da sala após um pequeno delay
      setTimeout(() => {
        setShowMatchRoomModal(true);
      }, 800);
    }, searchTime);
  };
  
  // Fechar o modal da sala
  const handleCloseRoomModal = () => {
    setShowMatchRoomModal(false);
    setFoundMatch(null);
  };
  
  // Redirecionar para a tela de envio de resultado
  const handleSubmitResult = () => {
    setShowMatchRoomModal(false);
    
    // Implementar lógica para exibir o modal de envio de resultado
    alert("Função para enviar resultado será implementada em breve.");
  };
  
  // Mostrar componente de loading enquanto carrega
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando lobby...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      {/* Animação de entrada no lobby */}
      {showLobbyAnimation && (
        <AnimatePresence>
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="text-4xl md:text-6xl font-bold text-purple-500 mb-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                Bem-vindo ao Lobby
              </motion.div>
              <motion.div 
                className="text-xl text-gray-300"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                Você é o capitão da equipe
              </motion.div>
              <motion.div
                className="mt-8"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <div className="w-16 h-16 mx-auto relative">
                  <div className="absolute inset-0 bg-yellow-500 rounded-full opacity-20 animate-pulse-shadow"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CrownIcon size={40} className="text-yellow-500" />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Animação de busca de partida */}
      {isSearchingMatch && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-card-bg rounded-xl p-8 text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Procurando partida...</h2>
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-purple-500 border-r-purple-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-t-yellow-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin-slow-reverse"></div>
              <div className="absolute inset-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-400">RPX</span>
              </div>
            </div>
            <p className="text-gray-300 mb-2">Buscando partidas compatíveis para {lobbyType}...</p>
            <p className="text-sm text-gray-500">({lobbyType === 'solo' ? '1x1' : lobbyType === 'duo' ? '2x2' : '4x4'})</p>
          </div>
        </div>
      )}
      
      {/* Animação de partida encontrada */}
      {foundMatch && !showMatchRoomModal && (
        <AnimatePresence>
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-card-bg rounded-xl p-8 text-center max-w-md mx-auto overflow-hidden relative"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Efeitos de fundo */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-green-900/30 to-card-bg opacity-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 1 }}
              />
              
              {/* Círculo pulsante */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  className="w-32 h-32 rounded-full bg-green-500/10 absolute"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ 
                    duration: 1.5, 
                    times: [0, 0.7, 1],
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="w-48 h-48 rounded-full bg-green-500/5 absolute"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.8, 1.2] }}
                  transition={{ 
                    duration: 1.8, 
                    times: [0, 0.7, 1],
                    ease: "easeInOut",
                    delay: 0.1
                  }}
                />
              </motion.div>
              
              {/* Partículas de celebração */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ 
                    background: i % 3 === 0 ? '#10B981' : i % 3 === 1 ? '#8B5CF6' : '#FBBF24',
                    boxShadow: i % 3 === 0 ? '0 0 8px #10B981' : i % 3 === 1 ? '0 0 8px #8B5CF6' : '0 0 8px #FBBF24',
                    top: '50%',
                    left: '50%',
                  }}
                  initial={{ x: 0, y: 0, opacity: 0 }}
                  animate={{ 
                    x: Math.cos(i * 30 * Math.PI / 180) * (80 + Math.random() * 40),
                    y: Math.sin(i * 30 * Math.PI / 180) * (80 + Math.random() * 40),
                    opacity: [0, 1, 0],
                  }}
                  transition={{ 
                    duration: 1 + Math.random() * 0.5,
                    delay: 0.2,
                    ease: "easeOut"
                  }}
                />
              ))}
              
              {/* Conteúdo */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  className="mb-4 text-green-500 flex justify-center"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 200, 
                    damping: 15,
                    delay: 0.2
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold mb-2 text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  Partida encontrada!
                </motion.h2>
                
                <motion.div
                  className="w-16 h-1 bg-gradient-to-r from-green-500 to-purple-500 rounded-full mb-3"
                  initial={{ width: 0 }}
                  animate={{ width: 64 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                />
                
                <motion.p 
                  className="text-xl text-purple-400 mb-6 font-semibold"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  {foundMatch.title}
                </motion.p>
                
                <motion.div 
                  className="bg-card-hover rounded-lg p-3 mb-6 w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-400">Formato:</span>
                    <span className="text-white font-medium">{foundMatch.mode} ({foundMatch.teamSize}x{foundMatch.teamSize})</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Plataforma:</span>
                    <span className="text-white font-medium capitalize">{foundMatch.platform}</span>
                  </div>
                </motion.div>
                
                <motion.p 
                  className="text-gray-300 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  Preparando sala de jogo...
                </motion.p>
                
                <motion.div 
                  className="w-full bg-gray-700 h-2 rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.3 }}
                >
                  <motion.div 
                    className="bg-gradient-to-r from-purple-500 to-green-500 h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ 
                      delay: 1.1, 
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Modal da sala da partida */}
      {foundMatch && showMatchRoomModal && (
        <MatchRoomModal
          match={foundMatch}
          isOpen={showMatchRoomModal}
          onClose={handleCloseRoomModal}
          onSubmitResult={handleSubmitResult}
        />
      )}
      
      <div className="container mx-auto">
        {/* Cabeçalho do Lobby */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Lobby de Apostas</h1>
          
          <div className="flex gap-4">
            <button
              onClick={() => setInviteModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-card-bg border border-gray-700 hover:bg-gray-800 flex items-center gap-2"
            >
              <UserPlus size={20} />
              Convidar
            </button>
            
            <button
              onClick={() => setSettingsOpen(true)}
              className="px-4 py-2 rounded-lg bg-card-bg border border-gray-700 hover:bg-gray-800 flex items-center gap-2"
            >
              <Settings size={20} />
              Configurações
            </button>
          </div>
        </div>
        
        {/* Seletor de tipo de lobby */}
        <div className="bg-card-bg rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Escolha o formato do lobby</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => changeLobbyType('solo')}
              className={`
                p-4 rounded-lg border transition-all
                ${lobbyType === 'solo' 
                  ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                  : 'border-gray-700 bg-card-hover hover:border-gray-500'}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <User size={32} className={lobbyType === 'solo' ? 'text-purple-400' : 'text-gray-400'} />
                <span className="mt-2 font-medium">Solo</span>
                <p className="text-xs text-gray-400 mt-1">Apenas você</p>
              </div>
            </button>
            
            <button
              onClick={() => changeLobbyType('duo')}
              className={`
                p-4 rounded-lg border transition-all
                ${lobbyType === 'duo' 
                  ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                  : 'border-gray-700 bg-card-hover hover:border-gray-500'}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex">
                  <User size={32} className={lobbyType === 'duo' ? 'text-purple-400' : 'text-gray-400'} />
                  <User size={32} className={lobbyType === 'duo' ? 'text-purple-400' : 'text-gray-400'} />
                </div>
                <span className="mt-2 font-medium">Duo</span>
                <p className="text-xs text-gray-400 mt-1">Você + 1 jogador</p>
              </div>
            </button>
            
            <button
              onClick={() => changeLobbyType('squad')}
              className={`
                p-4 rounded-lg border transition-all
                ${lobbyType === 'squad' 
                  ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                  : 'border-gray-700 bg-card-hover hover:border-gray-500'}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex flex-wrap justify-center w-20">
                  <User size={24} className={lobbyType === 'squad' ? 'text-purple-400' : 'text-gray-400'} />
                  <User size={24} className={lobbyType === 'squad' ? 'text-purple-400' : 'text-gray-400'} />
                  <User size={24} className={lobbyType === 'squad' ? 'text-purple-400' : 'text-gray-400'} />
                  <User size={24} className={lobbyType === 'squad' ? 'text-purple-400' : 'text-gray-400'} />
                </div>
                <span className="mt-2 font-medium">Squad</span>
                <p className="text-xs text-gray-400 mt-1">Você + 3 jogadores</p>
              </div>
            </button>
          </div>
        </div>
        
        {/* Seletor de método de pagamento - Mostra apenas para duo e squad */}
        {lobbyType !== 'solo' && (
          <div className="bg-card-bg rounded-xl border border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Método de pagamento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentOption('captain')}
                className={`
                  p-4 rounded-lg border transition-all
                  ${paymentOption === 'captain' 
                    ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                    : 'border-gray-700 bg-card-hover hover:border-gray-500'}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <DollarSign size={32} className={paymentOption === 'captain' ? 'text-purple-400' : 'text-gray-400'} />
                  <span className="mt-2 font-medium">Capitão Paga</span>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    O capitão paga o valor total da entrada e recebe todo o prêmio caso vença.
                    Os demais jogadores ganham apenas XP e pontos.
                  </p>
                </div>
              </button>
              
              <button
                onClick={() => setPaymentOption('split')}
                className={`
                  p-4 rounded-lg border transition-all
                  ${paymentOption === 'split' 
                    ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                    : 'border-gray-700 bg-card-hover hover:border-gray-500'}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <Users size={32} className={paymentOption === 'split' ? 'text-purple-400' : 'text-gray-400'} />
                  <span className="mt-2 font-medium">Dividir Custos</span>
                  <p className="text-xs text-gray-400 mt-1 text-center">
                    O valor da entrada é dividido entre todos os membros do time.
                    Em caso de vitória, o prêmio também é dividido igualmente.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}
        
        {/* Área do Lobby */}
        <div className="bg-card-bg rounded-xl border border-gray-700 p-6 mb-8 relative overflow-hidden">
          {/* Background temático */}
          <div className="absolute inset-0 opacity-10 bg-gradient-to-b from-purple-900 to-transparent pointer-events-none"></div>
          
          <h2 className="text-xl font-bold mb-6 relative z-10">Jogadores no Lobby</h2>
          
          {/* Grid de jogadores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {/* Jogadores atuais */}
            {players.map((player) => (
              <div 
                key={player.id}
                className={`
                  relative rounded-xl p-4 border-2 transition-all
                  ${player.isLeader 
                    ? 'border-yellow-500 bg-yellow-900/10' 
                    : 'border-green-500 bg-green-900/10'}
                `}
              >
                {/* Coroa para o líder */}
                {player.isLeader && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 p-1 rounded-full">
                    <CrownIcon size={16} className="text-black" />
                  </div>
                )}
                
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 ${player.isLeader ? 'border-yellow-500' : 'border-gray-700'}`}>
                    <Image
                      src={player.avatar}
                      alt={player.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Info */}
                  <div>
                    <div className="font-bold">{player.name}</div>
                    <div className="text-sm text-gray-400">Nível {player.level}</div>
                    <div className="text-sm text-purple-400">Rank: {player.rank}</div>
                  </div>
                  
                  {/* Botão de remover (exceto para o líder) */}
                  {!player.isLeader && (
                    <button 
                      onClick={() => removePlayer(player.id)}
                      className="absolute top-2 right-2 p-1 rounded-full hover:bg-red-800/30"
                    >
                      <X size={16} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Slots vazios */}
            {getAvailableSlots().map((_, index) => (
              <div 
                key={`empty-${index}`}
                className="border-2 border-dashed border-gray-700 rounded-xl p-4 flex flex-col items-center justify-center hover:border-purple-500/50 transition-colors"
              >
                <button 
                  onClick={addPlayer}
                  className="w-12 h-12 rounded-full bg-card-hover hover:bg-purple-900/20 flex items-center justify-center"
                >
                  <Plus size={24} className="text-gray-400" />
                </button>
                <span className="text-sm text-gray-500 mt-2">Adicionar jogador</span>
              </div>
            ))}
          </div>
          
          {/* Botão de iniciar */}
          <div className="mt-8 flex justify-center">
            <button 
              onClick={startGame}
              className="px-8 py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlayCircle size={24} />
              Iniciar Jogo
            </button>
          </div>
        </div>
        
        {/* Chat de Lobby (simplificado) */}
        <div className="bg-card-bg rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Chat da Equipe</h2>
            <MessageCircle size={20} className="text-gray-400" />
          </div>
          
          <div className="h-32 mb-4 bg-gray-900/50 rounded-lg p-3 overflow-y-auto">
            <p className="text-gray-400 text-sm">O chat será ativado quando todos os jogadores entrarem no lobby.</p>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-purple-500"
              disabled
            />
            <button
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 