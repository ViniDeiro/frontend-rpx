'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Lock, Shield, Activity, LogOut, Edit, ChevronRight, Clock, Award, Star } from 'react-feather';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/formatters';
import ProfileBanner from '@/components/profile/ProfileBanner';
import ProfileAvatar from '@/components/profile/ProfileAvatar';

// Definição de tipos para rankings e insígnias
type RankTier = 'bronze' | 'prata' | 'ouro' | 'platina' | 'diamante' | 'mestre' | 'challenger';

interface RankFrame {
  tier: RankTier;
  name: string;
  color: string;
  borderColor: string;
  image: string;
}

// Dados mockados para rankings e insígnias
const RANK_FRAMES: Record<RankTier, RankFrame> = {
  bronze: {
    tier: 'bronze',
    name: 'Bronze',
    color: 'from-amber-700 to-amber-800',
    borderColor: 'border-amber-700',
    image: '/images/ranks/bronze.svg'
  },
  prata: {
    tier: 'prata',
    name: 'Prata',
    color: 'from-gray-400 to-gray-500',
    borderColor: 'border-gray-400',
    image: '/images/ranks/prata.svg'
  },
  ouro: {
    tier: 'ouro',
    name: 'Ouro',
    color: 'from-yellow-500 to-yellow-600',
    borderColor: 'border-yellow-500',
    image: '/images/ranks/ouro.svg'
  },
  platina: {
    tier: 'platina',
    name: 'Platina',
    color: 'from-teal-400 to-teal-500',
    borderColor: 'border-teal-400',
    image: '/images/ranks/platina.svg'
  },
  diamante: {
    tier: 'diamante',
    name: 'Diamante',
    color: 'from-blue-400 to-blue-500',
    borderColor: 'border-blue-400',
    image: '/images/ranks/diamond.svg'
  },
  mestre: {
    tier: 'mestre',
    name: 'Mestre',
    color: 'from-purple-500 to-purple-600',
    borderColor: 'border-purple-500',
    image: '/images/ranks/mestre.svg'
  },
  challenger: {
    tier: 'challenger',
    name: 'Challenger',
    color: 'from-fuchsia-500 to-fuchsia-600',
    borderColor: 'border-fuchsia-500',
    image: '/images/ranks/challenger.svg'
  }
};

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  date?: string;
  rarity: 'comum' | 'raro' | 'épico' | 'lendário';
}

// Dados mockados para rankings e insígnias
const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'Primeira Vitória',
    description: 'Ganhou sua primeira aposta',
    icon: '/images/badges/first-win.png',
    date: '2023-10-15',
    rarity: 'comum'
  },
  {
    id: 'hot_streak',
    name: 'Sequência Quente',
    description: 'Ganhou 5 apostas consecutivas',
    icon: '/images/badges/hot-streak.png',
    date: '2023-11-22',
    rarity: 'raro'
  },
  {
    id: 'high_roller',
    name: 'Alto Apostador',
    description: 'Apostou mais de R$1.000 em uma única aposta',
    icon: '/images/badges/high-roller.png',
    date: '2023-12-01',
    rarity: 'épico'
  },
  {
    id: 'tournament_1',
    name: 'Campeonato Regional 2023',
    description: 'Participou do Campeonato Regional 2023',
    icon: '/images/badges/tournament-regional.png',
    date: '2023-09-28',
    rarity: 'épico'
  },
  {
    id: 'national_champion',
    name: 'Campeão Nacional',
    description: 'Venceu o Campeonato Nacional 2023',
    icon: '/images/badges/national-champion.png',
    date: '2023-11-05',
    rarity: 'lendário'
  }
];

// Componente para exibir insígnias
const AchievementBadge = ({ achievement }: { achievement: Achievement }) => {
  const rarityColors = {
    comum: 'bg-gray-500',
    raro: 'bg-blue-500',
    épico: 'bg-purple-500',
    lendário: 'bg-yellow-500'
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${rarityColors[achievement.rarity]} bg-opacity-20 border-2 border-opacity-50 ${rarityColors[achievement.rarity].replace('bg-', 'border-')}`}>
        {/* Placeholder para ícone da insígnia */}
        {achievement.id === 'first_win' && <Award size={24} className="text-yellow-400" />}
        {achievement.id === 'hot_streak' && <Activity size={24} className="text-red-400" />}
        {achievement.id === 'high_roller' && <Star size={24} className="text-blue-400" />}
        {achievement.id === 'tournament_1' && <TrophyIcon size={24} className="text-purple-400" />}
        {achievement.id === 'national_champion' && <MedalIcon size={24} className="text-yellow-400" />}
      </div>
      <span className="text-xs mt-1 text-gray-300 font-medium">{achievement.name}</span>
    </div>
  );
};

// Ícones adicionais para uso nos componentes de insígnias
const TrophyIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 24} 
    height={props.size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={props.color || "currentColor"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const MedalIcon = (props: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={props.size || 24} 
    height={props.size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke={props.color || "currentColor"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
  >
    <path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" />
    <path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.11" />
    <path d="M8.21 10.11 7 1l5 3 5-3-1.21 9.11" />
  </svg>
);

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [redirecting, setRedirecting] = useState(false);
  const [userRank, setUserRank] = useState<RankTier>('bronze');
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setRedirecting(true);
      // Aguardar 2 segundos antes de redirecionar para mostrar a mensagem
      const timer = setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, router]);

  // Carregar rank e conquistas do usuário
  useEffect(() => {
    if (isAuthenticated && user) {
      // Aqui você faria uma chamada à API
      // Por enquanto estamos usando dados mockados
      
      // Simular rank baseado no ID do usuário
      const rankIndex = parseInt(user.id?.toString().slice(-1) || '0');
      const ranks: RankTier[] = ['bronze', 'prata', 'ouro', 'platina', 'diamante', 'mestre', 'challenger'];
      setUserRank(ranks[rankIndex % ranks.length]);
      
      // Simular conquistas
      // Em produção, buscaria do backend
      setUserAchievements(MOCK_ACHIEVEMENTS.slice(0, 3));
    }
  }, [isAuthenticated, user]);

  // Função para formatar a data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não disponível';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Exibir spinner enquanto carrega
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }

  // Exibir mensagem de redirecionamento se não estiver autenticado
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-500/10 text-red-400 p-4 rounded-lg border border-red-500/20 mb-4">
            <Shield size={40} className="mx-auto mb-2" />
            <h2 className="text-xl font-bold mb-2">Acesso Restrito</h2>
            <p>Você precisa estar logado para acessar esta página. Redirecionando para o login...</p>
          </div>
          <Link href="/auth/login" className="text-purple-500 hover:text-purple-400">
            Ir para o login agora
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl pb-12">
      {/* Cabeçalho do Perfil com Banner */}
      <div className="mb-8">
        <ProfileBanner />
        
        <div className="bg-card-bg border border-gray-700 rounded-b-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar com moldura de rank integrada */}
            <div className="ml-4">
              <ProfileAvatar size="lg" rankTier={userRank} />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
              <p className="text-gray-400 mb-2">{user?.email}</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                <div>
                  <span className="text-gray-400 text-sm">Saldo: </span>
                  <span className="text-green-400 font-semibold">{user?.balance !== undefined ? formatCurrency(user.balance) : 'R$0,00'}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Membro desde: </span>
                  <span className="text-gray-300">{formatDate(user?.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Nível: </span>
                  <span className="text-purple-400 font-semibold">{user?.level || 1}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <button 
                onClick={logout}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/20 transition"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
              
              <Link
                href="/profile/edit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition"
              >
                <Edit size={18} />
                <span>Editar Perfil</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Seções do Perfil */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna da esquerda */}
        <div className="lg:col-span-4 space-y-8">
          {/* Informações Pessoais */}
          <div className="bg-card-bg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User size={20} className="text-purple-500" />
                <span>Informações Pessoais</span>
              </h2>
              <Link 
                href="/profile/edit" 
                className="text-purple-500 hover:text-purple-400"
              >
                Editar
              </Link>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">Nome completo</p>
                <p className="text-gray-200">{user?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">E-mail</p>
                <p className="text-gray-200">{user?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Telefone</p>
                <p className="text-gray-200">Não cadastrado</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Data de nascimento</p>
                <p className="text-gray-200">Não cadastrado</p>
              </div>
            </div>
          </div>
          
          {/* Conquistas e Insígnias */}
          <div className="bg-card-bg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrophyIcon size={20} className="text-purple-500" />
                <span>Conquistas e Insígnias</span>
              </h2>
              <Link 
                href="/profile/achievements" 
                className="text-purple-500 hover:text-purple-400"
              >
                Ver todas
              </Link>
            </div>
            
            <div>
              <div className="mb-4">
                <h3 className="text-md font-semibold text-gray-300 mb-2">Rank atual</h3>
                <div className="flex items-center gap-3">
                  <ProfileAvatar size="sm" rankTier={userRank} showEditButton={false} />
                  <div>
                    <p className="font-medium">
                      {userRank && RANK_FRAMES[userRank] ? RANK_FRAMES[userRank].name : 'Bronze'}
                    </p>
                    <p className="text-sm text-gray-400">Top 15% dos apostadores</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-md font-semibold text-gray-300 mb-2">Insígnias recentes</h3>
                <div className="grid grid-cols-3 gap-2">
                  {userAchievements.map(achievement => (
                    <AchievementBadge key={achievement.id} achievement={achievement} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Segurança */}
          <div className="bg-card-bg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield size={20} className="text-purple-500" />
                <span>Segurança</span>
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Link 
                  href="/profile/change-password" 
                  className="flex justify-between items-center p-3 bg-card-hover rounded-lg hover:bg-gray-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-purple-500" />
                    <span>Alterar senha</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </Link>
              </div>
              
              <div>
                <Link 
                  href="/profile/two-factor" 
                  className="flex justify-between items-center p-3 bg-card-hover rounded-lg hover:bg-gray-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} className="text-purple-500" />
                    <span>Autenticação de dois fatores</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-500" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Coluna da direita */}
        <div className="lg:col-span-8">
          {/* Estatísticas de Apostas */}
          <div className="bg-card-bg border border-gray-700 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity size={20} className="text-purple-500" />
                <span>Estatísticas de Apostas</span>
              </h2>
              <Link 
                href="/profile/stats" 
                className="text-purple-500 hover:text-purple-400"
              >
                Ver detalhes
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card-hover rounded-lg p-4">
                <p className="text-gray-400 text-sm">Apostas realizadas</p>
                <p className="text-xl font-bold">38</p>
              </div>
              <div className="bg-card-hover rounded-lg p-4">
                <p className="text-gray-400 text-sm">Taxa de vitória</p>
                <p className="text-xl font-bold text-green-400">62%</p>
              </div>
              <div className="bg-card-hover rounded-lg p-4">
                <p className="text-gray-400 text-sm">Lucro total</p>
                <p className="text-xl font-bold text-green-400">R$1.280,50</p>
              </div>
              <div className="bg-card-hover rounded-lg p-4">
                <p className="text-gray-400 text-sm">Maior ganho</p>
                <p className="text-xl font-bold">R$500,00</p>
              </div>
            </div>
          </div>
          
          {/* Histórico de Atividades */}
          <div className="bg-card-bg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity size={20} className="text-purple-500" />
                <span>Histórico de Atividades</span>
              </h2>
              <Link 
                href="/profile/activity" 
                className="text-purple-500 hover:text-purple-400"
              >
                Ver tudo
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Atividade</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Data e Hora</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-700/50 hover:bg-card-hover transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500/10 p-2 rounded-full">
                          <Activity size={16} className="text-green-500" />
                        </div>
                        <span>Cadastro na plataforma</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400 flex items-center gap-2">
                      <Clock size={14} />
                      {formatDate(user?.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-green-500/10 text-green-500 text-xs px-2 py-1 rounded-full">
                        Concluído
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-card-hover transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-500/10 p-2 rounded-full">
                          <TrophyIcon size={16} className="text-purple-500" />
                        </div>
                        <span>Ganhou insígnia: {userAchievements[0]?.name || 'Primeira Vitória'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400 flex items-center gap-2">
                      <Clock size={14} />
                      {formatDate(userAchievements[0]?.date)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-purple-500/10 text-purple-500 text-xs px-2 py-1 rounded-full">
                        Conquista
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-700/50 hover:bg-card-hover transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-500/10 p-2 rounded-full">
                          <Activity size={16} className="text-blue-500" />
                        </div>
                        <span>Login na plataforma</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400 flex items-center gap-2">
                      <Clock size={14} />
                      {formatDate(new Date().toISOString())}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-blue-500/10 text-blue-500 text-xs px-2 py-1 rounded-full">
                        Concluído
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 