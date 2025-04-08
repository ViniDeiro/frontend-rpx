'use client';

import { useState } from 'react';
import { Calendar, Award, Clock, Users, ChevronRight, Filter, Search } from 'react-feather';
import Link from 'next/link';

// Dados simulados de torneios
interface Tournament {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  format: string;
  status: 'registrando' | 'em_andamento' | 'completo';
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  image: string;
}

const mockTournaments: Tournament[] = [
  {
    id: 1,
    name: 'Torneio Semanal #42',
    description: 'Competição semanal com premiação em dinheiro.',
    startDate: '2023-04-10T18:00:00',
    endDate: '2023-04-10T22:00:00',
    format: 'Solo',
    status: 'registrando',
    entryFee: 25,
    prizePool: 1250,
    maxParticipants: 64,
    currentParticipants: 48,
    image: '/images/tournaments/weekly.jpg'
  },
  {
    id: 2,
    name: 'Copa RPX - Edição Especial',
    description: 'Grande torneio mensal com os melhores jogadores.',
    startDate: '2023-04-15T15:00:00',
    endDate: '2023-04-15T23:00:00',
    format: 'Duo',
    status: 'registrando',
    entryFee: 50,
    prizePool: 5000,
    maxParticipants: 128,
    currentParticipants: 86,
    image: '/images/tournaments/monthly.jpg'
  },
  {
    id: 3,
    name: 'Torneio Relâmpago',
    description: 'Competição rápida com inscrição gratuita.',
    startDate: '2023-04-08T20:00:00',
    endDate: '2023-04-08T22:00:00',
    format: 'Solo',
    status: 'completo',
    entryFee: 0,
    prizePool: 500,
    maxParticipants: 32,
    currentParticipants: 32,
    image: '/images/tournaments/flash.jpg'
  },
  {
    id: 4,
    name: 'Liga Profissional RPX',
    description: 'Torneio com os melhores times da plataforma.',
    startDate: '2023-04-20T17:00:00',
    endDate: '2023-04-20T23:00:00',
    format: 'Squad',
    status: 'registrando',
    entryFee: 100,
    prizePool: 10000,
    maxParticipants: 50,
    currentParticipants: 22,
    image: '/images/tournaments/pro.jpg'
  },
  {
    id: 5,
    name: 'Torneio Diário',
    description: 'Competição diária com premiação em itens.',
    startDate: '2023-04-07T19:00:00',
    endDate: '2023-04-07T21:00:00',
    format: 'Solo',
    status: 'em_andamento',
    entryFee: 10,
    prizePool: 300,
    maxParticipants: 32,
    currentParticipants: 30,
    image: '/images/tournaments/daily.jpg'
  }
];

export default function TournamentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [formatFilter, setFormatFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');

  // Filtrar torneios com base nos filtros
  const filteredTournaments = mockTournaments.filter(tournament => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat = formatFilter === 'todos' || tournament.format.toLowerCase() === formatFilter;
    const matchesStatus = statusFilter === 'todos' || tournament.status === statusFilter;
    
    return matchesSearch && matchesFormat && matchesStatus;
  });

  // Formatador de status para exibição
  const getStatusDisplay = (status: 'registrando' | 'em_andamento' | 'completo') => {
    switch (status) {
      case 'registrando':
        return { label: 'Inscrições Abertas', class: 'bg-green-100 text-green-800' };
      case 'em_andamento':
        return { label: 'Em Andamento', class: 'bg-blue-100 text-blue-800' };
      case 'completo':
        return { label: 'Finalizado', class: 'bg-gray-100 text-gray-800' };
      default:
        return { label: status, class: 'bg-gray-100 text-gray-800' };
    }
  };

  // Formatador de datas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Torneios RPX</h1>
          <p className="text-gray-400 max-w-3xl">
            Participe dos nossos torneios diários, semanais e mensais. Prove sua habilidade 
            e ganhe prêmios exclusivos e dinheiro real.
          </p>
        </div>
        
        {/* Filtros */}
        <div className="bg-gray-900/50 rounded-xl p-5 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Busca */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                className="bg-gray-800 block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm"
                placeholder="Buscar torneios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtro de Formato */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-auto">
                <label htmlFor="format-filter" className="block text-sm font-medium text-gray-400 mb-1">
                  Formato
                </label>
                <select
                  id="format-filter"
                  className="bg-gray-800 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm rounded-md text-white"
                  value={formatFilter}
                  onChange={(e) => setFormatFilter(e.target.value)}
                >
                  <option value="todos">Todos os formatos</option>
                  <option value="solo">Solo</option>
                  <option value="duo">Duo</option>
                  <option value="squad">Squad</option>
                </select>
              </div>
              
              {/* Filtro de Status */}
              <div className="w-full sm:w-auto">
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-400 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="bg-gray-800 block w-full pl-3 pr-10 py-2 text-base border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 sm:text-sm rounded-md text-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="todos">Todos os status</option>
                  <option value="registrando">Inscrições Abertas</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="completo">Finalizado</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Lista de Torneios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div 
              key={tournament.id} 
              className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden transition-all hover:shadow-purple-500/20 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Imagem de capa do torneio (placeholder) */}
              <div className="h-48 bg-purple-900/30 relative flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-gray-900 to-transparent">
                  <Award size={64} className="text-purple-400 opacity-30" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold text-white">{tournament.name}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusDisplay(tournament.status).class}`}>
                      {getStatusDisplay(tournament.status).label}
                    </span>
                    <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {tournament.format}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Detalhes do torneio */}
              <div className="p-4">
                <p className="text-gray-400 text-sm mb-4">{tournament.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar size={16} className="text-purple-400 mr-2" />
                    <span className="text-gray-300">
                      {formatDate(tournament.startDate)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock size={16} className="text-purple-400 mr-2" />
                    <span className="text-gray-300">
                      {new Date(tournament.startDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(tournament.endDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Users size={16} className="text-purple-400 mr-2" />
                    <span className="text-gray-300">
                      {tournament.currentParticipants}/{tournament.maxParticipants} participantes
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <div>
                    <p className="text-sm text-gray-500">Inscrição</p>
                    <p className="text-lg font-bold text-white">
                      {tournament.entryFee > 0 ? `R$ ${tournament.entryFee},00` : 'Grátis'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Premiação</p>
                    <p className="text-lg font-bold text-purple-400">R$ {tournament.prizePool},00</p>
                  </div>
                </div>
              </div>
              
              {/* Botão de ação */}
              <div className="px-4 py-3 bg-gray-900 border-t border-gray-800">
                <Link href={`/tournaments/${tournament.id}`} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">
                    {tournament.status === 'registrando' ? 'Inscrever-se' : 
                     tournament.status === 'em_andamento' ? 'Ver detalhes' : 
                     'Ver resultados'}
                  </span>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Caso não encontre torneios */}
        {filteredTournaments.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-gray-800 mb-4">
              <Award size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white">Nenhum torneio encontrado</h3>
            <p className="text-gray-400 mt-2">Tente ajustar seus filtros ou aguarde novos torneios.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFormatFilter('todos');
                setStatusFilter('todos');
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-purple-500 text-sm font-medium rounded-md text-purple-400 bg-transparent hover:bg-purple-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              <Filter size={16} className="mr-2" />
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 