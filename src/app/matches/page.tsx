'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { Match } from '@/types/match';
import { Search, Filter, DollarSign, Users, Clock, Monitor, Smartphone, Grid, BarChart2, Plus, X, Star } from 'react-feather';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MatchRoomModal from '@/components/modals/MatchRoomModal';
import SubmitResultModal from '@/components/modals/SubmitResultModal';

// Tipos para as plataformas
type Platform = 'emulator' | 'mobile' | 'mixed' | 'tactical';
type Tab = 'partidas' | 'criar';

// Componente principal envolvido em Suspense
function MatchesContent() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  
  // Obter parâmetros do lobby, se existirem
  const lobbyFormat = searchParams?.get('format');
  const teamSize = searchParams?.get('team_size');
  const paymentMethod = searchParams?.get('payment');
  
  const [activeTab, setActiveTab] = useState<Tab>('partidas');
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>(lobbyFormat || '');
  const [selectedTeamSize, setSelectedTeamSize] = useState<string>(teamSize || '');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('mixed');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para criação de partida
  const [createMatchMode, setCreateMatchMode] = useState<string>(lobbyFormat || 'solo');
  const [createMatchTeamSize, setCreateMatchTeamSize] = useState<number>(lobbyFormat === 'solo' ? 1 : lobbyFormat === 'duo' ? 2 : 4);
  const [createMatchPlatform, setCreateMatchPlatform] = useState<Platform>('mixed');
  const [createMatchEntryFee, setCreateMatchEntryFee] = useState<number>(10);
  const [createMatchCustomFee, setCreateMatchCustomFee] = useState<number>(150);
  const [isCustomFee, setIsCustomFee] = useState<boolean>(false);
  const [matchTitle, setMatchTitle] = useState<string>('');
  const [teamFormation, setTeamFormation] = useState<'formed' | 'random'>('formed');
  const [paymentOption, setPaymentOption] = useState<'captain' | 'split'>('captain');
  
  // Valores padrão para apostas
  const standardValues = [2, 3, 5, 10, 20, 50, 100];
  
  // Informações sobre plataformas
  const platforms = [
    { id: 'emulator', name: 'Emulador', icon: <Monitor size={20} /> },
    { id: 'mobile', name: 'Mobile', icon: <Smartphone size={20} /> },
    { id: 'mixed', name: 'Misto', icon: <Grid size={20} /> },
    { id: 'tactical', name: 'Tático', icon: <BarChart2 size={20} /> }
  ];

  // Estados para os modais
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  
  // Função para abrir o modal da sala de partida
  const openRoomModal = (match: Match) => {
    setSelectedMatch(match);
    setIsRoomModalOpen(true);
  };
  
  // Função para abrir o modal de envio de resultado
  const openResultModal = () => {
    setIsRoomModalOpen(false);
    setIsResultModalOpen(true);
  };
  
  // Função para fechar todos os modais
  const closeModals = () => {
    setIsRoomModalOpen(false);
    setIsResultModalOpen(false);
  };
  
  // Função para enviar o resultado da partida
  const handleSubmitResult = (result: {
    matchId: string;
    winner: 'team1' | 'team2';
    screenshot: File | null;
    comment: string;
  }) => {
    // Aqui você implementaria a lógica para enviar o resultado ao backend
    console.log('Resultado enviado:', result);
    
    // Mock: Atualize o estado da partida para "completed" no frontend
    if (selectedMatch) {
      const updatedMatches = matches.map(m => 
        m.id === selectedMatch.id ? { ...m, status: 'completed' } : m
      );
      setMatches(updatedMatches);
    }
    
    // Feche o modal
    closeModals();
    
    // Notifique o usuário
    alert('Resultado enviado com sucesso! Nossa equipe irá analisar e liberar o pagamento em breve.');
  };

  // Buscar partidas da API
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/matches');
        const matchesData = Array.isArray(response.data) ? response.data : [];
        
        // Mock data se a API não retornar dados suficientes
        if (matchesData.length === 0) {
          const mockMatches = generateMockMatches();
          setMatches(mockMatches);
          setFilteredMatches(mockMatches);
        } else {
        setMatches(matchesData);
        setFilteredMatches(matchesData);
        }
      } catch (err) {
        console.error('Erro ao carregar partidas:', err);
        // Usar dados mockados em caso de erro
        const mockMatches = generateMockMatches();
        setMatches(mockMatches);
        setFilteredMatches(mockMatches);
        setError('Não foi possível carregar as partidas reais. Exibindo dados de exemplo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Filtrar partidas
  useEffect(() => {
    let filtered = Array.isArray(matches) ? [...matches] : [];

    if (searchQuery) {
      filtered = filtered.filter(match => 
        match.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.mode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtrar por modo (formato) - Isso agora também lida com o tamanho da equipe
    if (selectedMode) {
      filtered = filtered.filter(match => match.mode === selectedMode);
    }

    // Filtrar por status
    if (selectedStatus) {
      filtered = filtered.filter(match => match.status === selectedStatus);
    }

    // Filtrar por plataforma
    if (selectedPlatform) {
      filtered = filtered.filter(match => {
        // No modo misto, não mostrar partidas 1x1 (solo)
        if (selectedPlatform === 'mixed' && match.teamSize === 1) {
          return false;
        }
        
        // Se não tiver plataforma definida, mostrar em todas
        if (!match.platform) return true;
        
        return match.platform === selectedPlatform;
      });
    }

    setFilteredMatches(filtered);
  }, [matches, searchQuery, selectedMode, selectedStatus, selectedPlatform]);

  // Atualizar o tamanho da equipe quando o modo mudar
  useEffect(() => {
    if (selectedMode) {
      // Solo = 1, Duo = 2, Squad = 4
      const teamSize = selectedMode === 'solo' ? '1' : selectedMode === 'duo' ? '2' : '4';
      setSelectedTeamSize(teamSize);
    }
  }, [selectedMode]);

  // Calcular número total de jogadores baseado no tamanho da equipe
  const getTotalPlayers = (teamSize: number) => {
    return teamSize * 2; // 2 equipes
  };

  // Gerar dados de exemplo para partidas
  const generateMockMatches = (): Match[] => {
    const modes = ['solo', 'duo', 'squad'];
    const platforms = ['emulator', 'mobile', 'mixed', 'tactical'];
    const statuses = ['open', 'in_progress', 'completed'];
    const standardFees = [2, 3, 5, 10, 20, 50, 100];
    
    return Array(15).fill(null).map((_, i) => {
      const mode = modes[Math.floor(Math.random() * modes.length)];
      const teamSize = mode === 'solo' ? 1 : mode === 'duo' ? 2 : 4;
      const totalPlayers = teamSize * 2;
      const entryFee = standardFees[Math.floor(Math.random() * standardFees.length)];
      const randomPlayers = Math.floor(Math.random() * (totalPlayers - 1));
      
      // Gerar odd aleatória entre 1.80 e 2.15
      const odd = Math.round((1.80 + Math.random() * 0.35) * 100) / 100;
      
      return {
        id: `match-${i}`,
        title: `Partida ${i + 1}`,
        mode,
        teamSize,
        type: Math.random() > 0.5 ? 'ranked' : 'casual',
        platform: platforms[Math.floor(Math.random() * platforms.length)] as any,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        entryFee,
        odd,
        // Prêmio é o retorno potencial (entrada * odd)
        prize: Math.round(entryFee * odd),
        playersJoined: randomPlayers,
        totalPlayers,
        teamFormation: mode !== 'solo' ? (Math.random() > 0.5 ? 'formed' : 'random') : undefined,
        paymentOption: mode !== 'solo' ? (Math.random() > 0.5 ? 'captain' : 'split') : undefined,
        startTime: new Date(Date.now() + Math.floor(Math.random() * 3600000)).toISOString()
      };
    });
  };

  // Criar uma nova partida
  const handleCreateMatch = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Validar se o título da partida foi preenchido
    if (!matchTitle.trim()) {
      alert('Por favor, informe um título para a partida');
      return;
    }

    // Determinar o valor da entrada
    const entryFee = isCustomFee ? createMatchCustomFee : createMatchEntryFee;
    
    // Gerar odd aleatória entre 1.80 e 2.15
    const odd = Math.round((1.80 + Math.random() * 0.35) * 100) / 100;

    // Criar objeto da partida
    const newMatch = {
      title: matchTitle,
      mode: createMatchMode,
      teamSize: createMatchTeamSize,
      platform: createMatchPlatform,
      entryFee: entryFee,
      odd: odd,
      // Prêmio é o retorno potencial (entrada * odd)
      prize: Math.round(entryFee * odd),
      type: 'casual', // Por padrão, todas as partidas criadas são casuais
      status: 'open',
      playersJoined: createMatchMode === 'solo' ? 1 : teamFormation === 'formed' ? createMatchTeamSize : 1,
      totalPlayers: getTotalPlayers(createMatchTeamSize),
      teamFormation: createMatchMode !== 'solo' ? teamFormation : undefined,
      paymentOption: createMatchMode === 'solo' ? 'split' : paymentOption,
      createdBy: user?.id
    };

    try {
      // Comentado por enquanto, já que estamos usando dados mockados
      // const response = await api.post('/matches', newMatch);
      
      // Adicionar a nova partida ao estado local
      const matchWithId = {
        ...newMatch,
        id: `match-${Date.now()}`, // ID temporário
        startTime: new Date(Date.now() + 10 * 60000).toISOString(), // Começa em 10 minutos
      };
      
      setMatches([matchWithId, ...matches]);
      
      // Limpar o formulário
      setMatchTitle('');
      setIsCustomFee(false);
      setCreateMatchEntryFee(10);
      setCreateMatchCustomFee(150);
      
      // Voltar para a aba de partidas
      setActiveTab('partidas');
      
      alert('Partida criada com sucesso!');
    } catch (error) {
      console.error('Erro ao criar partida:', error);
      alert('Ocorreu um erro ao criar a partida. Tente novamente.');
    }
  };

  // Configurar estados iniciais com base nos parâmetros da URL
  useEffect(() => {
    if (lobbyFormat) {
      setSelectedMode(lobbyFormat);
      setCreateMatchMode(lobbyFormat);
    }
    
    if (teamSize) {
      setSelectedTeamSize(teamSize);
      setCreateMatchTeamSize(Number(teamSize));
    }
    
    if (paymentMethod && (paymentMethod === 'captain' || paymentMethod === 'split')) {
      setPaymentOption(paymentMethod);
    }
  }, [lobbyFormat, teamSize, paymentMethod]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  // Render matches
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Partidas</h1>
          
          {activeTab === 'partidas' && (
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Buscar partidas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-card-bg border border-gray-700 focus:outline-none focus:border-purple-500"
              />
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2 rounded-lg bg-card-bg border border-gray-700 hover:bg-gray-800 flex items-center gap-2"
            >
              <Filter size={20} />
              Filtros
            </button>
            </div>
          )}
        </div>

        {/* Abas */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('partidas')}
            className={`px-4 py-3 font-medium transition-colors ${activeTab === 'partidas' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            Partidas Disponíveis
          </button>
          <button
            onClick={() => setActiveTab('criar')}
            className={`px-4 py-3 font-medium transition-colors flex items-center gap-2 ${activeTab === 'criar' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400 hover:text-white'}`}
          >
            <Plus size={18} />
            Criar Partida
          </button>
        </div>

        {activeTab === 'partidas' ? (
          <>
            {/* Seletor de plataforma - Sempre visível */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Plataforma</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id as Platform)}
                    className={`
                      p-4 rounded-lg border transition-all flex flex-col items-center justify-center
                      ${selectedPlatform === platform.id 
                        ? 'border-purple-500 bg-purple-900/20 shadow-[0_0_10px_rgba(147,51,234,0.3)]' 
                        : 'border-gray-700 bg-card-hover hover:border-gray-500'}
                    `}
                  >
                    <div className={selectedPlatform === platform.id ? 'text-purple-400' : 'text-gray-400'}>
                      {platform.icon}
                    </div>
                    <span className="mt-2">{platform.name}</span>
                  </button>
                ))}
          </div>
        </div>

        {isFilterOpen && (
              <div className="mb-8 p-6 bg-card-bg rounded-xl border border-gray-700 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                    <label className="block text-sm text-gray-300 mb-2">Modo de Jogo</label>
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                      className="w-full p-2 rounded-lg bg-background border border-gray-700 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Todos os modos</option>
                      <option value="solo">Solo (1x1)</option>
                      <option value="duo">Duo (2x2)</option>
                      <option value="squad">Squad (4x4)</option>
                </select>
              </div>
              
              <div>
                    <label className="block text-sm text-gray-300 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2 rounded-lg bg-background border border-gray-700 focus:outline-none focus:border-purple-500"
                >
                  <option value="">Todos os status</option>
                  <option value="open">Aberto</option>
                  <option value="in_progress">Em andamento</option>
                  <option value="completed">Finalizado</option>
                </select>
              </div>
            </div>
          </div>
        )}

            {/* Mensagem quando não há partidas disponíveis */}
            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 bg-card-bg rounded-xl border border-gray-700">
                <div className="text-gray-400 text-xl mb-4">Não encontramos partidas com esses filtros</div>
                <button 
                  onClick={() => {
                    setSelectedMode('');
                    setSelectedStatus('');
                    setSearchQuery('');
                    // Manter a plataforma selecionada
                  }}
                  className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMatches.map((match) => (
                  <div 
                    key={match.id}
                    className="bg-card-bg p-6 rounded-xl border border-gray-700 hover:border-purple-600/30 transition-colors shadow-lg"
                  >
            <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-400">
                        {match.mode?.charAt(0).toUpperCase() + match.mode?.slice(1) || 'Desconhecido'} • {match.type?.charAt(0).toUpperCase() + match.type?.slice(1) || 'Casual'}
                      </span>
                      <span className={`text-sm px-2 py-1 rounded ${
                        match.status === 'open' 
                          ? 'bg-green-900/20 text-green-400' 
                          : match.status === 'in_progress' 
                            ? 'bg-blue-900/20 text-blue-400' 
                            : 'bg-gray-900/20 text-gray-400'
                      }`}>
                        {match.status === 'open' 
                          ? 'Aberto' 
                          : match.status === 'in_progress' 
                            ? 'Em andamento' 
                            : 'Finalizado'}
              </span>
            </div>
                    
                    <h3 className="text-lg font-bold mb-3">{match.title || `Partida #${match.id}`}</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                        <Users className="text-purple-400" size={20} />
                        <span>{(match.teamSize || 0) > 1 ? `${match.teamSize} jogadores por equipe` : '1 jogador'}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="text-purple-400">💰</span>
                        <span>Entrada: {formatCurrency(match.entryFee || 10)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Star className="text-yellow-500" size={20} />
                        <span>Odd: <span className="text-yellow-500 font-medium">{match.odd ? match.odd.toFixed(2) : '2.00'}x</span></span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="text-purple-400" size={20} />
                        <span>
                          {match.status === 'open' 
                            ? 'Início em breve' 
                            : match.status === 'in_progress' 
                              ? 'Em andamento' 
                              : 'Finalizado'}
                        </span>
                      </div>
                      
                      {(match.teamSize || 0) > 1 && match.paymentOption && (
                        <div className="flex items-center gap-3">
                          <DollarSign className="text-purple-400" size={20} />
                          <span>
                            Pagamento: {match.paymentOption === 'captain' ? 'Capitão paga' : 'Dividido'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-background rounded">
                        <p className="text-sm text-gray-400 mb-1">Prêmio</p>
                        <p className="font-semibold text-purple-400">{formatCurrency(match.prize || 100)}</p>
                      </div>
                      <div className="text-center p-3 bg-background rounded">
                        <p className="text-sm text-gray-400 mb-1">Jogadores</p>
                        <p className="font-semibold text-purple-400">{match.playersJoined || 0}/{match.totalPlayers || 2}</p>
                      </div>
                    </div>
                    
                    <button 
                      className={`w-full mt-6 py-2 rounded-lg transition-colors ${
                        match.status === 'open' 
                          ? 'bg-purple-700 text-white hover:bg-purple-800' 
                          : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                      }`}
                      disabled={match.status !== 'open'}
                      onClick={() => match.status === 'open' && openRoomModal(match)}
                    >
                      {match.status === 'open' ? 'Participar' : 'Indisponível'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Formulário para criação de partida
          <div className="bg-card-bg p-6 rounded-xl border border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Criar Nova Partida</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Título da Partida</label>
                <input
                  type="text"
                  value={matchTitle}
                  onChange={(e) => setMatchTitle(e.target.value)}
                  placeholder="Ex: Partida Rápida 1x1"
                  className="w-full p-3 rounded-lg bg-background border border-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Modo de Jogo</label>
                  <select
                    value={createMatchMode}
                    onChange={(e) => {
                      const mode = e.target.value;
                      setCreateMatchMode(mode);
                      
                      // Atualizar tamanho da equipe com base no modo
                      if (mode === 'solo') setCreateMatchTeamSize(1);
                      else if (mode === 'duo') setCreateMatchTeamSize(2);
                      else setCreateMatchTeamSize(4);
                    }}
                    className="w-full p-3 rounded-lg bg-background border border-gray-700 focus:outline-none focus:border-purple-500"
                  >
                    <option value="solo">Solo (1x1)</option>
                    <option value="duo">Duo (2x2)</option>
                    <option value="squad">Squad (4x4)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Plataforma</label>
                  <select
                    value={createMatchPlatform}
                    onChange={(e) => setCreateMatchPlatform(e.target.value as Platform)}
                    className="w-full p-3 rounded-lg bg-background border border-gray-700 focus:outline-none focus:border-purple-500"
                  >
                    <option value="emulator">Emulador</option>
                    <option value="mobile">Mobile</option>
                    <option value="mixed">Misto</option>
                    <option value="tactical">Tático</option>
                  </select>
                </div>
              </div>
              
              {/* Opções específicas para formatos 2x2 e 4x4 */}
              {createMatchMode !== 'solo' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Formação de Times</label>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setTeamFormation('formed')}
                        className="w-full p-3 rounded-lg border border-purple-500 bg-purple-900/20"
                      >
                        Times Formados
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Você já tem um time formado e entrarão juntos.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Opção de Pagamento</label>
                    <div className="flex gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setPaymentOption('captain')}
                        className={`flex-1 p-3 rounded-lg border transition-all ${
                          paymentOption === 'captain' 
                            ? 'border-purple-500 bg-purple-900/20' 
                            : 'border-gray-700 bg-card-hover'
                        }`}
                      >
                        Capitão Paga
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentOption('split')}
                        className={`flex-1 p-3 rounded-lg border transition-all ${
                          paymentOption === 'split' 
                            ? 'border-purple-500 bg-purple-900/20' 
                            : 'border-gray-700 bg-card-hover'
                        }`}
                      >
                        Dividir Custos
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {paymentOption === 'captain' 
                        ? 'O capitão paga o valor total da entrada e recebe todo o prêmio caso vença. Os demais jogadores ganham apenas XP e pontos para subir de nível.' 
                        : 'O valor da entrada é dividido entre todos os membros do time. Em caso de vitória, o prêmio também é dividido igualmente.'}
                    </p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm text-gray-300 mb-4">Valor da Entrada</label>
                
                {!isCustomFee ? (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      {standardValues.map(value => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setCreateMatchEntryFee(value)}
                          className={`p-3 rounded-lg border transition-all ${
                            createMatchEntryFee === value 
                              ? 'border-purple-500 bg-purple-900/20' 
                              : 'border-gray-700 bg-card-hover'
                          }`}
                        >
                          {formatCurrency(value)}
                        </button>
                      ))}
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setIsCustomFee(true)}
                      className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Definir valor personalizado
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="number"
                        min="101"
                        value={createMatchCustomFee}
                        onChange={(e) => setCreateMatchCustomFee(Number(e.target.value))}
                        className="w-full p-3 rounded-lg bg-background border border-gray-700 focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomFee(false)}
                        className="p-2 text-red-400 hover:text-red-300"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">
                      Valor personalizado a partir de R$ 101,00
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mb-2 text-sm text-gray-300">Resumo da Partida</div>
              <div className="bg-background p-4 rounded-lg border border-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Formato:</span>
                  <span>
                    {createMatchMode.charAt(0).toUpperCase() + createMatchMode.slice(1)} ({createMatchTeamSize}x{createMatchTeamSize})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plataforma:</span>
                  <span>
                    {createMatchPlatform === 'emulator' ? 'Emulador' : 
                     createMatchPlatform === 'mobile' ? 'Mobile' : 
                     createMatchPlatform === 'mixed' ? 'Misto' : 'Tático'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Valor de entrada:</span>
                  <span className="text-green-400">{formatCurrency(isCustomFee ? createMatchCustomFee : createMatchEntryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Odd estimada:</span>
                  <span className="text-yellow-500">~2.00x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ganho estimado:</span>
                  <span className="text-purple-400">
                    {formatCurrency((isCustomFee ? createMatchCustomFee : createMatchEntryFee) * 2)}
                  </span>
                </div>
                {createMatchMode !== 'solo' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pagamento:</span>
                      <span>{paymentOption === 'captain' ? 'Capitão paga' : 'Dividido'}</span>
            </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('partidas')}
                  className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleCreateMatch}
                  className="px-6 py-3 bg-purple-700 text-white font-medium rounded-lg hover:bg-purple-800 transition-colors"
                >
                  Criar Partida
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      {selectedMatch && (
        <>
          <MatchRoomModal
            match={selectedMatch}
            isOpen={isRoomModalOpen}
            onClose={closeModals}
            onSubmitResult={openResultModal}
          />
          <SubmitResultModal
            match={selectedMatch}
            isOpen={isResultModalOpen}
            onClose={closeModals}
            onSubmit={handleSubmitResult}
          />
        </>
      )}
    </div>
  );
}

// Componente wrapper que usa Suspense
export default function MatchesPage() {
  return (
    <Suspense fallback={<div className="container py-16 flex justify-center"><div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <MatchesContent />
    </Suspense>
  );
} 