'use client';

import { useState, useEffect } from 'react';
import { Search, TrendingUp, Target, Filter, Users, ChevronUp, ChevronDown, Star, Award } from 'react-feather';
import Link from 'next/link';

interface Player {
  id: number;
  username: string;
  winRate: number;
  totalMatches: number;
  victories: number;
  earnings: number;
  rank: string;
  avatar?: string;
  streak?: number;
  lastMatches?: ('win' | 'loss' | 'draw')[];
  rankingChange?: number;
}

// Logo simplificado
const RpxLogo = () => {
  return (
    <div className="bg-purple-700 text-white font-bold text-xl px-3 py-1.5 rounded">
      RPX
    </div>
  );
};

export default function RankingPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('winrate');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlayer, setExpandedPlayer] = useState<number | null>(null);

  // Dados de exemplo para jogadores
  const playersData: Player[] = [
    {
      id: 1,
      username: 'ProKiller99',
      winRate: 78,
      totalMatches: 456,
      victories: 356,
      earnings: 12500,
      rank: 'Mestre',
      streak: 8,
      lastMatches: ['win', 'win', 'win', 'win', 'loss', 'win', 'win', 'win'],
      rankingChange: 0
    },
    {
      id: 2,
      username: 'FireStorm',
      winRate: 72,
      totalMatches: 390,
      victories: 281,
      earnings: 8700,
      rank: 'Diamante',
      streak: 3,
      lastMatches: ['win', 'win', 'win', 'loss', 'loss', 'win', 'loss', 'win'],
      rankingChange: 2
    },
    {
      id: 3,
      username: 'SniperElite',
      winRate: 68,
      totalMatches: 520,
      victories: 354,
      earnings: 9800,
      rank: 'Mestre',
      streak: 0,
      lastMatches: ['loss', 'win', 'loss', 'win', 'win', 'win', 'loss', 'win'],
      rankingChange: -1
    },
    {
      id: 4,
      username: 'NinjaFF',
      winRate: 65,
      totalMatches: 380,
      victories: 247,
      earnings: 7200,
      rank: 'Diamante',
      streak: 2,
      lastMatches: ['win', 'win', 'loss', 'win', 'loss', 'loss', 'win', 'win'],
      rankingChange: 1
    },
    {
      id: 5,
      username: 'HeadshotKing',
      winRate: 62,
      totalMatches: 410,
      victories: 254,
      earnings: 6500,
      rank: 'Diamante',
      streak: 1,
      lastMatches: ['win', 'loss', 'loss', 'win', 'loss', 'win', 'win', 'loss'],
      rankingChange: -2
    },
    {
      id: 6,
      username: 'LegendaryShooter',
      winRate: 58,
      totalMatches: 480,
      victories: 278,
      earnings: 5900,
      rank: 'Ouro',
      streak: 0,
      lastMatches: ['loss', 'loss', 'win', 'win', 'loss', 'win', 'loss', 'win'],
      rankingChange: 0
    },
    {
      id: 7,
      username: 'GhostWarrior',
      winRate: 55,
      totalMatches: 320,
      victories: 176,
      earnings: 4700,
      rank: 'Prata',
      streak: 0,
      lastMatches: ['loss', 'win', 'loss', 'win', 'loss', 'win', 'loss', 'win'],
      rankingChange: 3
    },
    {
      id: 8,
      username: 'RapidFire',
      winRate: 52,
      totalMatches: 300,
      victories: 156,
      earnings: 3800,
      rank: 'Prata',
      streak: 1,
      lastMatches: ['win', 'loss', 'win', 'loss', 'win', 'loss', 'win', 'loss'],
      rankingChange: 0
    },
    {
      id: 9,
      username: 'ShadowHunter',
      winRate: 49,
      totalMatches: 280,
      victories: 137,
      earnings: 3200,
      rank: 'Bronze',
      streak: 0,
      lastMatches: ['loss', 'win', 'loss', 'win', 'loss', 'win', 'loss', 'loss'],
      rankingChange: -1
    },
    {
      id: 10,
      username: 'EagleEye',
      winRate: 45,
      totalMatches: 260,
      victories: 117,
      earnings: 2800,
      rank: 'Bronze',
      streak: 2,
      lastMatches: ['win', 'win', 'loss', 'loss', 'loss', 'win', 'loss', 'loss'],
      rankingChange: 5
    }
  ];

  useEffect(() => {
    // Simulando requisição à API
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        // Em produção, descomentar a linha abaixo e remover a simulação
        // const response = await api.get('/rankings');
        // setPlayers(response.data);
        
        // Simulando delay da API
        setTimeout(() => {
          setPlayers(playersData);
          sortPlayers(playersData, selectedCategory);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Erro ao carregar ranking:', err);
        setError('Não foi possível carregar o ranking. Tente novamente mais tarde.');
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  // Ordenar jogadores
  const sortPlayers = (data: Player[], category: string) => {
    let sorted;
    switch (category) {
      case 'winrate':
        sorted = [...data].sort((a, b) => b.winRate - a.winRate);
        break;
      case 'earnings':
        sorted = [...data].sort((a, b) => b.earnings - a.earnings);
        break;
      case 'victories':
        sorted = [...data].sort((a, b) => b.victories - a.victories);
        break;
      default:
        sorted = [...data].sort((a, b) => b.winRate - a.winRate);
    }
    setFilteredPlayers(sorted);
  };

  // Filtrar jogadores
  useEffect(() => {
    let filtered = [...players];

    if (searchQuery) {
      filtered = filtered.filter(player => 
        player.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    sortPlayers(filtered, selectedCategory);
  }, [players, searchQuery, selectedCategory]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    }).format(value);
  };

  const togglePlayerDetails = (playerId: number) => {
    if (expandedPlayer === playerId) {
      setExpandedPlayer(null);
    } else {
      setExpandedPlayer(playerId);
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Mestre': return 'text-purple-400';
      case 'Diamante': return 'text-blue-400';
      case 'Ouro': return 'text-yellow-400';
      case 'Prata': return 'text-slate-400';
      case 'Bronze': return 'text-amber-600';
      default: return 'text-slate-300';
    }
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 70) return 'bg-green-500';
    if (winRate >= 60) return 'bg-green-400';
    if (winRate >= 50) return 'bg-blue-500';
    if (winRate >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Star className="text-yellow-400" size={20} />;
      case 2:
        return <Star className="text-gray-400" size={20} />;
      case 3:
        return <Star className="text-amber-600" size={20} />;
      default:
        return <span className="w-5 text-center">{position}</span>;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const top3Players = filteredPlayers.slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <RpxLogo />
            <h1 className="text-3xl font-bold">Ranking</h1>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="text"
                placeholder="Buscar jogador..."
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
              <span>Filtros</span>
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="mb-8 p-4 bg-card-bg rounded-lg border border-gray-700 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Ordenar por</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 rounded bg-background border border-gray-700 focus:outline-none focus:border-purple-500"
                >
                  <option value="winrate">Taxa de Vitória</option>
                  <option value="earnings">Ganhos Totais</option>
                  <option value="victories">Vitórias</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Jogadores */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award size={24} className="text-yellow-400" />
            <span>Top Jogadores</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {top3Players.map((player, index) => (
              <div key={player.id} className="bg-card-bg rounded-xl overflow-hidden border border-gray-700 shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                      ${index === 0 ? 'bg-yellow-500/30 text-yellow-400' : 
                        index === 1 ? 'bg-slate-400/30 text-slate-300' : 
                        'bg-amber-600/30 text-amber-500'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-bold text-lg flex items-center gap-2">
                        {player.username}
                        {player.streak && player.streak >= 3 && (
                          <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full flex items-center">
                            <TrendingUp size={12} className="mr-1" />
                            {player.streak} streak
                          </span>
                        )}
                      </div>
                      <div className={`text-sm ${getRankColor(player.rank)}`}>{player.rank}</div>
                    </div>
                  </div>
                  
                  <div>
                    {player.rankingChange && player.rankingChange > 0 && (
                      <div className="flex items-center text-green-400">
                        <ChevronUp size={16} />
                        <span>{player.rankingChange}</span>
                      </div>
                    )}
                    {player.rankingChange && player.rankingChange < 0 && (
                      <div className="flex items-center text-red-400">
                        <ChevronDown size={16} />
                        <span>{Math.abs(player.rankingChange)}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Taxa de Vitória</span>
                    <span className="font-medium">{player.winRate}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2.5">
                    <div 
                      className={`${getWinRateColor(player.winRate)} h-2.5 rounded-full`} 
                      style={{ width: `${player.winRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div>
                    <div className="text-sm text-gray-300">Partidas</div>
                    <div className="font-medium">{player.totalMatches}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Vitórias</div>
                    <div className="font-medium">{player.victories}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Ganhos</div>
                    <div className="font-medium text-purple-400">{formatCurrency(player.earnings)}</div>
                  </div>
                </div>
                
                {player.lastMatches && (
                  <div>
                    <div className="text-sm text-gray-300 mb-2">Últimas partidas</div>
                    <div className="flex gap-1">
                      {player.lastMatches.map((result, i) => (
                        <div 
                          key={i} 
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                            ${result === 'win' ? 'bg-green-500/20 text-green-400' : 
                              result === 'loss' ? 'bg-red-500/20 text-red-400' : 
                              'bg-slate-500/20 text-slate-400'}
                          `}
                        >
                          {result === 'win' ? 'V' : result === 'loss' ? 'D' : 'E'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tabela de Ranking */}
        <div className="bg-card-bg rounded-xl border border-gray-700 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-4 py-3 text-left">Posição</th>
                  <th className="px-4 py-3 text-left">Jogador</th>
                  <th className="px-4 py-3 text-center">Taxa de Vitória</th>
                  <th className="px-4 py-3 text-center">Partidas</th>
                  <th className="px-4 py-3 text-center">Vitórias</th>
                  <th className="px-4 py-3 text-right">Ganhos</th>
                  <th className="px-4 py-3 text-center">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPlayers.map((player, index) => (
                  <>
                    <tr 
                      key={player.id} 
                      className={`hover:bg-gray-800/30 transition-colors ${index < 3 ? 'bg-background/50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {index < 3 ? (
                            <div className={`
                              w-6 h-6 rounded-full flex items-center justify-center font-bold
                              ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                                index === 1 ? 'bg-slate-400/20 text-slate-300' : 
                                'bg-amber-600/20 text-amber-500'}
                            `}>
                              {index + 1}
                            </div>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                          
                          {player.rankingChange && player.rankingChange > 0 && (
                            <span className="ml-2 text-green-400 text-xs flex items-center">
                              <ChevronUp size={14} />
                              {player.rankingChange}
                            </span>
                          )}
                          {player.rankingChange && player.rankingChange < 0 && (
                            <span className="ml-2 text-red-400 text-xs flex items-center">
                              <ChevronDown size={14} />
                              {Math.abs(player.rankingChange)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-background rounded-full flex items-center justify-center text-purple-400`}>
                            {player.username.substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {player.username}
                              {player.streak && player.streak >= 3 && (
                                <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full flex items-center">
                                  <TrendingUp size={10} className="mr-0.5" />
                                  {player.streak}
                                </span>
                              )}
                            </div>
                            <div className={`text-xs ${getRankColor(player.rank)}`}>{player.rank}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center gap-1 mb-1">
                            <span>{player.winRate}%</span>
                            {player.winRate >= 65 && <Star size={12} className="text-yellow-400" />}
                          </div>
                          <div className="w-full bg-background rounded-full h-1.5 max-w-24">
                            <div 
                              className={`${getWinRateColor(player.winRate)} h-1.5 rounded-full`} 
                              style={{ width: `${player.winRate}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">{player.totalMatches}</td>
                      <td className="px-4 py-3 text-center">{player.victories}</td>
                      <td className="px-4 py-3 text-right font-medium text-purple-400">{formatCurrency(player.earnings)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => togglePlayerDetails(player.id)}
                          className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded"
                        >
                          {expandedPlayer === player.id ? 
                            <ChevronUp size={16} /> : 
                            <ChevronDown size={16} />
                          }
                        </button>
                      </td>
                    </tr>
                    
                    {/* Detalhes expandidos do jogador */}
                    {expandedPlayer === player.id && (
                      <tr className="bg-background/50">
                        <td colSpan={7} className="px-6 py-4">
                          <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <h4 className="text-sm text-gray-300 mb-2">Histórico de Partidas</h4>
                                <div className="flex gap-1 flex-wrap">
                                  {player.lastMatches?.map((result, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                                        ${result === 'win' ? 'bg-green-500/20 text-green-400' : 
                                          result === 'loss' ? 'bg-red-500/20 text-red-400' : 
                                          'bg-slate-500/20 text-slate-400'}
                                      `}
                                    >
                                      {result === 'win' ? 'V' : result === 'loss' ? 'D' : 'E'}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm text-gray-300 mb-2">Estatísticas</h4>
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="bg-card-bg p-2 rounded">
                                    <div className="text-xs text-gray-300">Taxa Vitória</div>
                                    <div className="font-medium">{player.winRate}%</div>
                                  </div>
                                  <div className="bg-card-bg p-2 rounded">
                                    <div className="text-xs text-gray-300">Vitórias</div>
                                    <div className="font-medium">{player.victories}</div>
                                  </div>
                                  <div className="bg-card-bg p-2 rounded">
                                    <div className="text-xs text-gray-300">Sequência</div>
                                    <div className="font-medium">{player.streak}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-end">
                              <Link 
                                href={`/players/${player.id}`}
                                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded text-sm"
                              >
                                Ver Perfil Completo
                              </Link>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
} 