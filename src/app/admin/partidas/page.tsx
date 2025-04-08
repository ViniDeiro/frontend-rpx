'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, Edit2, Trash2, Search, ChevronUp, ChevronDown, Copy, Eye, 
  Calendar, Users, DollarSign, Clock, Tag, Lock, Save, X, CheckCircle 
} from 'react-feather';
import Link from 'next/link';

// Definir a interface para Match
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
  roomId: string;
  roomPassword: string;
  configuredRoom: boolean;
  [key: string]: any; // Permite acesso indexado para ordenação
}

// Dados iniciais para simulação
const initialMatches: Match[] = [
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
    roomId: '',
    roomPassword: '',
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

// Componente principal
export default function AdminPartidas() {
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>(initialMatches);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMatch, setCurrentMatch] = useState<Match | null>(null);
  const [roomConfigModalOpen, setRoomConfigModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Ordenação e filtragem
  useEffect(() => {
    let filtered = [...matches];
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(match => 
        match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.format.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.roomId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(match => match.status === filterStatus);
    }
    
    // Ordenar
    filtered.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredMatches(filtered);
  }, [matches, searchTerm, sortField, sortDirection, filterStatus]);

  // Função para ordenar
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Função para editar partida
  const handleEditMatch = (match: Match) => {
    setCurrentMatch({...match});
    setIsModalOpen(true);
  };

  // Função para salvar partida
  const handleSaveMatch = () => {
    if (currentMatch) {
      if (currentMatch.id) {
        // Editar partida existente
        setMatches(matches.map(m => m.id === currentMatch.id ? currentMatch : m));
      } else {
        // Adicionar nova partida
        const newMatch = {
          ...currentMatch,
          id: Math.max(...matches.map(m => m.id)) + 1,
          configuredRoom: !!currentMatch.roomId
        };
        setMatches([...matches, newMatch]);
      }
      setIsModalOpen(false);
      setCurrentMatch(null);
    }
  };

  // Função para excluir partida
  const handleDeleteMatch = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta partida?')) {
      setMatches(matches.filter(match => match.id !== id));
    }
  };

  // Função para abrir modal de nova partida
  const handleNewMatch = () => {
    setCurrentMatch({ 
      id: 0,
      name: '', 
      format: 'Squad (4x4)',
      entry: 3.00,
      prize: 6.00,
      status: 'em_breve',
      startTime: new Date().toISOString().slice(0, 16),
      players: 0,
      maxPlayers: 16,
      roomId: '',
      roomPassword: '',
      configuredRoom: false
    });
    setIsModalOpen(true);
  };

  // Função para configurar sala
  const handleConfigureRoom = (match: Match) => {
    setCurrentMatch({...match});
    setRoomConfigModalOpen(true);
  };

  // Função para salvar configuração de sala
  const handleSaveRoomConfig = () => {
    if (currentMatch) {
      const updatedMatch = {
        ...currentMatch,
        configuredRoom: !!currentMatch.roomId && !!currentMatch.roomPassword
      };
      
      setMatches(matches.map(m => m.id === updatedMatch.id ? updatedMatch : m));
      setRoomConfigModalOpen(false);
      
      // Exibir mensagem de sucesso
      setSuccessMessage('Configuração da sala salva com sucesso!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Função para copiar ID ou senha da sala
  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage(`${type} copiado para a área de transferência!`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Helper para formatar datas
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  // Helper para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Helper para traduzir status
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_espera': return { label: 'Aguardando jogadores', color: 'bg-yellow-100 text-yellow-800' };
      case 'em_breve': return { label: 'Em breve', color: 'bg-blue-100 text-blue-800' };
      case 'em_andamento': return { label: 'Em andamento', color: 'bg-green-100 text-green-800' };
      case 'finalizada': return { label: 'Finalizada', color: 'bg-gray-100 text-gray-800' };
      case 'cancelada': return { label: 'Cancelada', color: 'bg-red-100 text-red-800' };
      default: return { label: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Partidas</h1>
        <button
          onClick={handleNewMatch}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <PlusCircle size={18} className="mr-2" />
          Nova Partida
        </button>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
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
          
          <div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-purple-500 focus:border-purple-500 w-full md:w-auto"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Todos os status</option>
              <option value="em_espera">Aguardando jogadores</option>
              <option value="em_breve">Em breve</option>
              <option value="em_andamento">Em andamento</option>
              <option value="finalizada">Finalizada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md flex items-center shadow-md z-50">
          <CheckCircle size={18} className="mr-2" />
          {successMessage}
        </div>
      )}

      {/* Tabela de Partidas */}
      <div className="bg-white overflow-hidden rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID
                    {sortField === 'id' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center">
                    Nome
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Formato
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Entrada/Prêmio
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sala
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMatches.map((match) => {
                const status = getStatusLabel(match.status);
                return (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{match.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {match.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.format}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Entrada: {formatCurrency(match.entry)}</div>
                      <div>Prêmio: {formatCurrency(match.prize)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {match.configuredRoom ? (
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center">
                            <Tag size={14} className="mr-1 text-gray-400" />
                            <span className="mr-2 font-medium">{match.roomId}</span>
                            <button
                              onClick={() => handleCopyToClipboard(match.roomId, 'ID da sala')}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                          <div className="flex items-center">
                            <Lock size={14} className="mr-1 text-gray-400" />
                            <span className="mr-2 font-medium">{match.roomPassword}</span>
                            <button
                              onClick={() => handleCopyToClipboard(match.roomPassword, 'Senha da sala')}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleConfigureRoom(match)}
                          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                        >
                          Configurar Sala
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditMatch(match)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar partida"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleConfigureRoom(match)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Configurar sala"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteMatch(match.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Excluir partida"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredMatches.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Nenhuma partida encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edição/Criação de Partida */}
      {isModalOpen && currentMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {currentMatch.id ? `Editar Partida #${currentMatch.id}` : 'Nova Partida'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Partida</label>
                  <input
                    type="text"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.name}
                    onChange={(e) => setCurrentMatch({...currentMatch, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Formato</label>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.format}
                    onChange={(e) => setCurrentMatch({...currentMatch, format: e.target.value})}
                  >
                    <option value="Solo">Solo</option>
                    <option value="Dupla (2x2)">Dupla (2x2)</option>
                    <option value="Squad (4x4)">Squad (4x4)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor de Entrada (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.entry}
                    onChange={(e) => setCurrentMatch({...currentMatch, entry: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor do Prêmio (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.prize}
                    onChange={(e) => setCurrentMatch({...currentMatch, prize: parseFloat(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora de Início</label>
                  <input
                    type="datetime-local"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.startTime}
                    onChange={(e) => setCurrentMatch({...currentMatch, startTime: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.status}
                    onChange={(e) => setCurrentMatch({...currentMatch, status: e.target.value})}
                  >
                    <option value="em_breve">Em breve</option>
                    <option value="em_espera">Aguardando jogadores</option>
                    <option value="em_andamento">Em andamento</option>
                    <option value="finalizada">Finalizada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número Máximo de Jogadores</label>
                  <input
                    type="number"
                    min="1"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.maxPlayers}
                    onChange={(e) => setCurrentMatch({...currentMatch, maxPlayers: parseInt(e.target.value)})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jogadores Inscritos</label>
                  <input
                    type="number"
                    min="0"
                    className="px-3 py-2 border border-gray-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.players}
                    onChange={(e) => setCurrentMatch({...currentMatch, players: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-md border border-purple-200">
                <h4 className="text-sm font-medium text-purple-800 mb-2 flex items-center">
                  <Eye size={16} className="mr-2" />
                  Configuração da Sala
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID da Sala</label>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Ex: RPX12345"
                        className="px-3 py-2 border border-gray-300 rounded-l-md w-full focus:ring-purple-500 focus:border-purple-500"
                        value={currentMatch.roomId}
                        onChange={(e) => setCurrentMatch({...currentMatch, roomId: e.target.value})}
                      />
                      {currentMatch.roomId && (
                        <button
                          onClick={() => handleCopyToClipboard(currentMatch.roomId, 'ID da sala')}
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md"
                          title="Copiar ID"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha da Sala</label>
                    <div className="flex">
                      <input
                        type="text"
                        placeholder="Ex: pass123"
                        className="px-3 py-2 border border-gray-300 rounded-l-md w-full focus:ring-purple-500 focus:border-purple-500"
                        value={currentMatch.roomPassword}
                        onChange={(e) => setCurrentMatch({...currentMatch, roomPassword: e.target.value})}
                      />
                      {currentMatch.roomPassword && (
                        <button
                          onClick={() => handleCopyToClipboard(currentMatch.roomPassword, 'Senha da sala')}
                          className="bg-gray-100 hover:bg-gray-200 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md"
                          title="Copiar senha"
                        >
                          <Copy size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveMatch}
                className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuração de Sala */}
      {roomConfigModalOpen && currentMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Configurar Sala - {currentMatch.name}
              </h3>
              <button 
                onClick={() => setRoomConfigModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <p className="text-sm text-gray-600">
                Configure o ID e senha da sala para que os jogadores possam entrar no jogo.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID da Sala</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Ex: RPX12345"
                    className="px-3 py-2 border border-gray-300 rounded-l-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.roomId}
                    onChange={(e) => setCurrentMatch({...currentMatch, roomId: e.target.value})}
                  />
                  {currentMatch.roomId && (
                    <button
                      onClick={() => handleCopyToClipboard(currentMatch.roomId, 'ID da sala')}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md"
                      title="Copiar ID"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Recomendamos usar o prefixo RPX seguido de números.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Senha da Sala</label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Ex: pass123"
                    className="px-3 py-2 border border-gray-300 rounded-l-md w-full focus:ring-purple-500 focus:border-purple-500"
                    value={currentMatch.roomPassword}
                    onChange={(e) => setCurrentMatch({...currentMatch, roomPassword: e.target.value})}
                  />
                  {currentMatch.roomPassword && (
                    <button
                      onClick={() => handleCopyToClipboard(currentMatch.roomPassword, 'Senha da sala')}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md"
                      title="Copiar senha"
                    >
                      <Copy size={16} />
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Use uma senha fácil de compartilhar com os jogadores.
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setRoomConfigModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRoomConfig}
                className="px-4 py-2 bg-purple-600 rounded-md text-white hover:bg-purple-700 flex items-center"
              >
                <Save size={16} className="mr-2" />
                Salvar Configuração
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 