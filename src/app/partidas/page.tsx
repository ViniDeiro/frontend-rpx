'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Clock, Users, DollarSign, Eye } from 'react-feather';

// Interface para as partidas
interface Match {
  id: number;
  name: string;
  format: string;
  entry: number;
  prize: number;
  status: string;
  startTime: string;
  players: number;
  maxPlayers: number;
  roomId?: string;
  roomPassword?: string;
  configuredRoom?: boolean;
}

// Dados simulados - seriam substituídos por chamadas à API real
const getMatches = (): Match[] => {
  return [
    { 
      id: 1, 
      name: 'Partida 1', 
      format: 'Squad (4x4)',
      entry: 3.00,
      prize: 6.00,
      status: 'em_espera',
      startTime: '2023-05-15T19:30:00',
      players: 12,
      maxPlayers: 16,
      roomId: 'RPX62336',
      roomPassword: 'pass505',
      configuredRoom: true
    },
    { 
      id: 2, 
      name: 'Partida 2', 
      format: 'Dupla (2x2)',
      entry: 5.00,
      prize: 20.00,
      status: 'em_breve',
      startTime: '2023-05-15T20:30:00',
      players: 6,
      maxPlayers: 10,
      configuredRoom: false
    },
    { 
      id: 3, 
      name: 'Partida 3', 
      format: 'Solo',
      entry: 2.50,
      prize: 10.00,
      status: 'em_andamento',
      startTime: '2023-05-15T18:00:00',
      players: 8,
      maxPlayers: 8,
      roomId: 'RPX75432',
      roomPassword: 'pass123',
      configuredRoom: true
    },
    { 
      id: 4, 
      name: 'Partida 4', 
      format: 'Squad (4x4)',
      entry: 3.00,
      prize: 6.00,
      status: 'em_espera',
      startTime: '2023-05-15T21:30:00',
      players: 8,
      maxPlayers: 16,
      roomId: 'RPX62336',
      roomPassword: 'pass505',
      configuredRoom: true
    },
    { 
      id: 5, 
      name: 'Partida 5', 
      format: 'Dupla (2x2)',
      entry: 10.00,
      prize: 50.00,
      status: 'finalizada',
      startTime: '2023-05-15T17:00:00',
      players: 10,
      maxPlayers: 10,
      roomId: 'RPX12345',
      roomPassword: 'oldpass',
      configuredRoom: true
    }
  ];
};

export default function MatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    // Simulando carregamento de dados da API
    const loadMatches = () => {
      setIsLoading(true);
      try {
        const matchesData = getMatches();
        setMatches(matchesData);
        setFilteredMatches(matchesData);
      } catch (error) {
        console.error('Erro ao carregar partidas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, []);

  // Filtrar partidas quando o termo de busca ou filtro ativo muda
  useEffect(() => {
    let filtered = [...matches];

    // Filtrar por status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(match => match.status === activeFilter);
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.format.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMatches(filtered);
  }, [matches, searchTerm, activeFilter]);

  // Helper para obter estilo de status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'em_espera':
        return { color: 'bg-yellow-100 text-yellow-800', text: 'Aguardando jogadores' };
      case 'em_breve':
        return { color: 'bg-blue-100 text-blue-800', text: 'Em breve' };
      case 'em_andamento':
        return { color: 'bg-green-100 text-green-800', text: 'Em andamento' };
      case 'finalizada':
        return { color: 'bg-gray-100 text-gray-800', text: 'Finalizada' };
      case 'cancelada':
        return { color: 'bg-red-100 text-red-800', text: 'Cancelada' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: status };
    }
  };

  // Helper para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Helper para formatar tempo
  const formatTime = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper para verificar se a partida está disponível
  const isMatchAvailable = (status: string) => {
    return status === 'em_espera' || status === 'em_breve';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-800 border-r-transparent"></div>
          <p className="mt-4 text-lg text-gray-800">Carregando partidas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Partidas Disponíveis</h1>
        <p className="text-gray-600 max-w-3xl">
          Encontre partidas para jogar, participe e ganhe prêmios. Você pode filtrar por tipo de partida e usar a busca para encontrar partidas específicas.
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar partida..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-purple-500 focus:border-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg border ${
              activeFilter === 'all' 
                ? 'bg-purple-100 text-purple-800 border-purple-300' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setActiveFilter('em_breve')}
            className={`px-4 py-2 rounded-lg border ${
              activeFilter === 'em_breve' 
                ? 'bg-purple-100 text-purple-800 border-purple-300' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Em breve
          </button>
          <button
            onClick={() => setActiveFilter('em_espera')}
            className={`px-4 py-2 rounded-lg border ${
              activeFilter === 'em_espera' 
                ? 'bg-purple-100 text-purple-800 border-purple-300' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Aguardando
          </button>
          <button
            onClick={() => setActiveFilter('em_andamento')}
            className={`hidden sm:block px-4 py-2 rounded-lg border ${
              activeFilter === 'em_andamento' 
                ? 'bg-purple-100 text-purple-800 border-purple-300' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            Em andamento
          </button>
        </div>
      </div>

      {/* Lista de partidas */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => {
            const statusStyle = getStatusStyle(match.status);
            return (
              <div 
                key={match.id} 
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {match.name || `Partida #${match.id}`}
                    </h3>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyle.color}`}>
                      {statusStyle.text}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      {formatTime(match.startTime)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <Users size={16} className="mr-2 text-gray-400" />
                      {match.format} • {match.players}/{match.maxPlayers} jogadores
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign size={16} className="mr-2 text-gray-400" />
                      Entrada: {formatCurrency(match.entry)}
                    </div>
                    
                    <div className="flex items-center text-sm font-medium text-purple-700">
                      <DollarSign size={16} className="mr-2 text-purple-500" />
                      Prêmio: {formatCurrency(match.prize)}
                    </div>
                  </div>
                  
                  {/* Barra de progresso dos jogadores */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(match.players / match.maxPlayers) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link 
                      href={`/partidas/${match.id}`}
                      className="flex-1 bg-purple-100 hover:bg-purple-200 text-purple-800 text-sm py-2 rounded-lg text-center font-medium flex items-center justify-center"
                    >
                      <Eye size={16} className="mr-1" />
                      Ver detalhes
                    </Link>
                    
                    {isMatchAvailable(match.status) && (
                      <button
                        onClick={() => router.push(`/partidas/${match.id}`)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg text-center font-medium"
                      >
                        Participar
                      </button>
                    )}
                  </div>

                  {/* Badge para quando a sala está configurada */}
                  {match.configuredRoom && (
                    <div className="mt-4 text-center">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Sala configurada
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
          <div className="text-gray-500 mb-4">
            <Filter size={40} className="mx-auto mb-2" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma partida encontrada</h3>
          <p className="text-gray-600 mb-4">
            Não encontramos partidas com os filtros selecionados. Tente ajustar seus critérios de busca.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setActiveFilter('all');
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
} 