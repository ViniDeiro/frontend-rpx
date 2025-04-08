'use client';

import React, { useState } from 'react';
import { X, Copy, CheckCircle, Clock, Users, AlertCircle, User } from 'react-feather';
import { Match } from '@/types/match';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import { formatCurrency } from '@/utils/formatters';

type Team = {
  id: string;
  name: string;
  players: {
    id: string;
    name: string;
    avatar?: string;
    isReady: boolean;
    isCaptain: boolean;
  }[];
};

interface MatchRoomModalProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
  onSubmitResult: () => void;
}

const MatchRoomModal: React.FC<MatchRoomModalProps> = ({ match, isOpen, onClose, onSubmitResult }) => {
  const { user } = useAuth();
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  
  // Dados mockados da sala
  const roomId = `RPX${Math.floor(10000 + Math.random() * 90000)}`;
  const roomPassword = `pass${Math.floor(100 + Math.random() * 900)}`;
  
  // Gerar times mockados
  const generateMockTeams = (): Team[] => {
    const teamSize = match.teamSize || 1;
    const totalPlayers = match.teamSize ? match.teamSize * 2 : 2;
    
    // Time 1 (incluindo o usuário atual)
    const team1Players = Array(teamSize).fill(null).map((_, i) => {
      if (i === 0 && user) {
        // O primeiro jogador é o usuário atual (capitão)
        return {
          id: user.id,
          name: user.name,
          avatar: user.avatarId || '/images/avatars/default.png',
          isReady: true,
          isCaptain: true,
        };
      }
      
      // Preencher vagas restantes como vazias ou com jogadores aleatórios
      if (match.playersJoined && i < match.playersJoined && i > 0) {
        return {
          id: `player-team1-${i}`,
          name: `Jogador ${i + 1}`,
          avatar: '/images/avatars/default.png',
          isReady: Math.random() > 0.3, // 70% de chance de estar pronto
          isCaptain: false,
        };
      }
      
      // Vaga vazia
      return {
        id: `empty-team1-${i}`,
        name: 'Aguardando jogador...',
        isReady: false,
        isCaptain: false,
      };
    });
    
    // Time 2 (adversários)
    const team2Players = Array(teamSize).fill(null).map((_, i) => {
      if (match.status === 'in_progress' || Math.random() > 0.5) {
        return {
          id: `player-team2-${i}`,
          name: `Adversário ${i + 1}`,
          avatar: '/images/avatars/default.png',
          isReady: Math.random() > 0.3, // 70% de chance de estar pronto
          isCaptain: i === 0, // O primeiro jogador é o capitão
        };
      }
      
      // Vaga vazia
      return {
        id: `empty-team2-${i}`,
        name: 'Aguardando jogador...',
        isReady: false,
        isCaptain: false,
      };
    });
    
    return [
      {
        id: 'team1',
        name: 'Seu Time',
        players: team1Players,
      },
      {
        id: 'team2',
        name: 'Time Adversário',
        players: team2Players,
      },
    ];
  };
  
  const teams = generateMockTeams();
  
  const copyToClipboard = (text: string, type: 'roomId' | 'password') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'roomId') {
        setCopiedRoomId(true);
        setTimeout(() => setCopiedRoomId(false), 2000);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg border border-gray-700 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold">{match.title || 'Sala de Partida'}</h2>
              <p className="text-gray-400 mt-1 flex items-center gap-2">
                <Clock size={16} />
                <span>Aguardando jogadores...</span>
              </p>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="p-3 bg-background border border-gray-700 rounded-lg mb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-400 text-sm">ID da Sala:</span>
                  <span className="font-mono font-bold">{roomId}</span>
                  <button
                    onClick={() => copyToClipboard(roomId, 'roomId')}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copiar ID da sala"
                  >
                    {copiedRoomId ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">Senha:</span>
                  <span className="font-mono font-bold">{roomPassword}</span>
                  <button
                    onClick={() => copyToClipboard(roomPassword, 'password')}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copiar senha"
                  >
                    {copiedPassword ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          {/* Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-background rounded-lg p-4 flex items-center gap-3">
              <Users className="text-purple-400" size={20} />
              <div>
                <div className="text-sm text-gray-400">Formato</div>
                <div className="font-semibold">
                  {match.mode?.charAt(0).toUpperCase() + match.mode?.slice(1) || 'N/A'} ({match.teamSize || 1}x{match.teamSize || 1})
                </div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-4 flex items-center gap-3">
              <DollarSign className="text-purple-400" size={20} />
              <div>
                <div className="text-sm text-gray-400">Entrada</div>
                <div className="font-semibold">{formatCurrency(match.entryFee || 0)}</div>
              </div>
            </div>
            
            <div className="bg-background rounded-lg p-4 flex items-center gap-3">
              <Trophy className="text-purple-400" size={20} />
              <div>
                <div className="text-sm text-gray-400">Prêmio</div>
                <div className="font-semibold">{formatCurrency(match.prize || 0)}</div>
              </div>
            </div>
          </div>
          
          {/* Odds e Retorno */}
          <div className="bg-background rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="text-yellow-500" size={20} />
              <div>
                <div className="text-sm text-gray-400">Odd</div>
                <div className="font-bold text-yellow-500">
                  {match.odd ? match.odd.toFixed(2) : '2.00'}x
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="text-sm text-gray-400">Ganho</div>
              <div className="font-bold text-green-500">
                {formatCurrency(match.prize || 0)}
              </div>
            </div>
          </div>
          
          {/* Atenção */}
          <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
            <div>
              <p className="text-yellow-500 font-semibold mb-1">Atenção!</p>
              <p className="text-gray-300 text-sm">
                Use o ID e senha acima para entrar na sala de jogo. Certifique-se de que todos os jogadores estejam prontos antes de iniciar a partida.
                Após a partida, volte aqui e clique em "Partida Finalizada" para enviar o resultado.
              </p>
            </div>
          </div>
          
          {/* Informações de Pagamento */}
          {match.teamSize && match.teamSize > 1 && match.paymentOption && (
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-4 mb-6 flex items-start gap-3">
              <DollarSign className="text-blue-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-blue-500 font-semibold mb-1">Método de Pagamento: {match.paymentOption === 'captain' ? 'Capitão Paga' : 'Dividido'}</p>
                <p className="text-gray-300 text-sm">
                  {match.paymentOption === 'captain' 
                    ? `O capitão pagará o valor total de ${formatCurrency(match.entryFee || 0)} e receberá todo o prêmio em caso de vitória. Os demais jogadores receberão apenas XP e pontos de nível.` 
                    : `Cada jogador pagará ${formatCurrency((match.entryFee || 0) / match.teamSize)} (${formatCurrency(match.entryFee || 0)} ÷ ${match.teamSize}). Em caso de vitória, o prêmio de ${formatCurrency(match.prize || 0)} será dividido igualmente entre todos os jogadores.`}
                </p>
              </div>
            </div>
          )}
          
          {/* Teams */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {teams.map((team) => (
              <div key={team.id} className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gray-800 py-3 px-4 font-semibold">{team.name}</div>
                <div className="p-2">
                  {team.players.map((player) => (
                    <div 
                      key={player.id} 
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="relative h-10 w-10 rounded-full overflow-hidden border border-gray-700 bg-gray-900">
                        {player.avatar ? (
                          <Image 
                            src={player.avatar} 
                            alt={player.name} 
                            fill 
                            sizes="40px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full w-full text-gray-500">
                            <User size={20} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{player.name}</span>
                          {player.isCaptain && (
                            <span className="bg-purple-900/50 text-purple-400 text-xs px-2 py-0.5 rounded">
                              Capitão
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm">
                          {player.isReady ? (
                            <span className="text-green-500 flex items-center gap-1">
                              <CheckCircle size={12} /> Pronto
                            </span>
                          ) : (
                            <span className="text-yellow-500 flex items-center gap-1">
                              <Clock size={12} /> Aguardando
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Voltar
            </button>
            
            <button
              onClick={onSubmitResult}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors"
            >
              Partida Finalizada
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para ícone de troféu (não existe no react-feather)
const DollarSign = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const Trophy = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const Star = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export default MatchRoomModal; 