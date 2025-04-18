import React, { useState, useEffect } from 'react';
import Character2D from '../2d/Character2D';

// Definição da interface para o jogador
interface Player {
  id: string;
  username: string;
  character?: {
    type: string;
    color: string;
  };
}

// Interface para props do componente
interface LobbyWithCharactersProps {
  players: Player[];
  gameStatus: string;
  onStartGame: () => void;
  currentUserId: string;
}

/**
 * Componente de lobby que exibe personagens 2D dos jogadores
 */
export default function LobbyWithCharacters({ 
  players = [], 
  gameStatus = 'waiting',
  onStartGame = () => {},
  currentUserId = ''
}: LobbyWithCharactersProps) {
  const [lobbyPlayers, setLobbyPlayers] = useState<Player[]>(players);

  // Atualiza jogadores quando a prop muda
  useEffect(() => {
    setLobbyPlayers(players);
  }, [players]);

  // Determina a animação baseada no status do jogo
  const getCharacterAnimation = (status: string): string => {
    switch (status) {
      case 'starting':
        return 'dance';
      case 'in_progress':
        return 'walk';
      default:
        return 'idle';
    }
  };

  // Verifica se o usuário atual é o administrador
  const isAdmin = lobbyPlayers.length > 0 && 
    lobbyPlayers[0].id === currentUserId;

  // Renderiza slots de jogadores
  const renderPlayerSlots = () => {
    // Criar 6 slots para jogadores
    const slots: Array<Player | null> = Array(6).fill(null);
    
    // Preencher slots com jogadores existentes
    lobbyPlayers.forEach((player, index) => {
      if (index < slots.length) {
        slots[index] = player;
      }
    });

    return slots.map((player, index) => (
      <div key={index} className="flex flex-col items-center">
        <div className="bg-gray-100 rounded-lg p-4 w-36 h-36 flex items-center justify-center">
          {player ? (
            <div className="text-center">
              <Character2D 
                type={player.character?.type || 'default'} 
                color={player.character?.color || '#3498db'} 
                animation={getCharacterAnimation(gameStatus)}
                size="medium"
              />
              <p className="mt-2 font-medium text-sm truncate max-w-full">{player.username}</p>
            </div>
          ) : (
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="mt-2">Aguardando...</p>
            </div>
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Sala de Espera</h2>
      
      {/* Status do jogo */}
      <div className="mb-6">
        <div className={`text-center py-2 px-4 rounded-full font-medium ${
          gameStatus === 'waiting' ? 'bg-yellow-100 text-yellow-800' : 
          gameStatus === 'starting' ? 'bg-blue-100 text-blue-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {gameStatus === 'waiting' ? 'Aguardando jogadores...' : 
           gameStatus === 'starting' ? 'Iniciando em breve!' : 
           'Jogo em andamento'}
        </div>
      </div>
      
      {/* Grid de jogadores */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {renderPlayerSlots()}
      </div>
      
      {/* Botão de iniciar (apenas para o admin) */}
      {isAdmin && gameStatus === 'waiting' && lobbyPlayers.length >= 2 && (
        <div className="flex justify-center">
          <button 
            onClick={onStartGame}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
          >
            Iniciar Jogo
          </button>
        </div>
      )}
      
      {/* Mensagem de aguardando mais jogadores */}
      {gameStatus === 'waiting' && lobbyPlayers.length < 2 && (
        <div className="text-center text-gray-500">
          Aguardando pelo menos 2 jogadores para iniciar...
        </div>
      )}
      
      {/* Código de convite */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-1">Convide seus amigos usando o código:</p>
        <div className="bg-gray-100 py-2 px-4 rounded inline-block font-mono font-medium">
          RPX-{Math.random().toString(36).substring(2, 8).toUpperCase()}
        </div>
      </div>
    </div>
  );
} 