import { useState } from 'react';
import Image from 'next/image';
import { Edit, User } from 'react-feather';
import { useAuth } from '@/contexts/AuthContext';
import { AVATARS } from '@/data/customization';
import CustomizationSelector from './CustomizationSelector';

// Tipos e dados da moldura de rank importados do arquivo da página de perfil
type RankTier = 'bronze' | 'prata' | 'ouro' | 'platina' | 'diamante' | 'mestre' | 'challenger';

interface RankFrame {
  tier: RankTier;
  name: string;
  color: string;
  borderColor: string;
  image: string;
}

// Definição dos frames de rank (copiada do arquivo de perfil)
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

interface ProfileAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showEditButton?: boolean;
  rankTier?: RankTier; // Nova prop para o tier do rank
}

export default function ProfileAvatar({ 
  size = 'md', 
  showEditButton = true, 
  rankTier 
}: ProfileAvatarProps) {
  const { user } = useAuth();
  const [showSelector, setShowSelector] = useState(false);
  
  // Encontrar o avatar correto com base no ID do usuário
  const defaultAvatarId = 'default';
  const avatarId = user?.avatarId || defaultAvatarId;
  const avatar = AVATARS.find(a => a.id === avatarId) || AVATARS.find(a => a.id === defaultAvatarId)!;
  
  // Classes baseadas no tamanho
  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      border: 'border-4',
      editButton: 'w-6 h-6'
    },
    md: {
      container: 'w-24 h-24 -mt-12',
      border: 'border-4',
      editButton: 'w-8 h-8'
    },
    lg: {
      container: 'w-32 h-32 -mt-16',
      border: 'border-6',
      editButton: 'w-10 h-10'
    }
  }[size];
  
  // Funções para a moldura de rank
  const getRankColors = (tier?: RankTier) => {
    if (!tier) return { stroke: '#B45309', fill: '#D97706', highlight: '#F59E0B' };
    
    switch(tier) {
      case 'bronze': return { stroke: '#B45309', fill: '#D97706', highlight: '#F59E0B' };
      case 'prata': return { stroke: '#6B7280', fill: '#9CA3AF', highlight: '#D1D5DB' };
      case 'ouro': return { stroke: '#D97706', fill: '#F59E0B', highlight: '#FBBF24' };
      case 'platina': return { stroke: '#0D9488', fill: '#14B8A6', highlight: '#2DD4BF' };
      case 'diamante': return { stroke: '#3B82F6', fill: '#60A5FA', highlight: '#93C5FD' };
      case 'mestre': return { stroke: '#7E22CE', fill: '#A855F7', highlight: '#C084FC' };
      case 'challenger': return { stroke: '#C026D3', fill: '#E879F9', highlight: '#F0ABFC' };
      default: return { stroke: '#B45309', fill: '#D97706', highlight: '#F59E0B' };
    }
  };
  
  // Verificar se é um tier de alta classificação
  const isHighTier = rankTier ? ['diamante', 'mestre', 'challenger'].includes(rankTier) : false;
  const colors = getRankColors(rankTier);
  
  // Renderizar gemas para tiers superiores
  const renderGems = () => {
    if (!isHighTier) return null;
    
    return (
      <>
        {/* Gemas nos pontos norte, sul, leste, oeste */}
        <circle cx="110" cy="20" r="6" fill={colors.highlight} />
        <circle cx="110" cy="200" r="6" fill={colors.highlight} />
        <circle cx="20" cy="110" r="6" fill={colors.highlight} />
        <circle cx="200" cy="110" r="6" fill={colors.highlight} />
        
        {/* Para challenger, adicionar gemas extras */}
        {rankTier === 'challenger' && (
          <>
            <circle cx="50" cy="50" r="5" fill={colors.highlight} />
            <circle cx="170" cy="50" r="5" fill={colors.highlight} />
            <circle cx="50" cy="170" r="5" fill={colors.highlight} />
            <circle cx="170" cy="170" r="5" fill={colors.highlight} />
          </>
        )}
      </>
    );
  };
  
  return (
    <div className="relative">
      {/* Avatar */}
      <div className={`${sizeClasses.container} relative rounded-full overflow-hidden ${sizeClasses.border} border-gray-800 bg-gray-700 z-10`}>
        <Image
          src={avatar.image}
          alt={user?.name || 'Usuário'}
          fill
          priority
          className="object-cover"
        />
      </div>
      
      {/* Moldura de rank (definição SVG direta) - apenas se rankTier for fornecido */}
      {rankTier && (
        <div className="absolute inset-[-12%] w-[124%] h-[124%] z-0">
          <svg width="100%" height="100%" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Círculo base */}
            <circle cx="110" cy="110" r="105" stroke={colors.stroke} strokeWidth={isHighTier ? 6 : 4} fill="none" />
            
            {/* Detalhes decorativos nos pontos cardeais */}
            <path d="M110 5 L120 15 L110 25 L100 15 Z" fill={colors.fill} />
            <path d="M110 215 L120 205 L110 195 L100 205 Z" fill={colors.fill} />
            <path d="M5 110 L15 120 L25 110 L15 100 Z" fill={colors.fill} />
            <path d="M215 110 L205 120 L195 110 L205 100 Z" fill={colors.fill} />
            
            {/* Arcos decorativos */}
            <path d="M40 40 A100 100 0 0 1 180 40" stroke={colors.fill} strokeWidth="3" fill="none" />
            <path d="M40 180 A100 100 0 0 0 180 180" stroke={colors.fill} strokeWidth="3" fill="none" />
            
            {/* Detalhes adicionais para tiers altos */}
            {renderGems()}
            
            {/* Detalhes especiais para diamante */}
            {rankTier === 'diamante' && (
              <>
                <line x1="30" y1="30" x2="45" y2="45" stroke={colors.highlight} strokeWidth="2" strokeLinecap="round" />
                <line x1="190" y1="30" x2="175" y2="45" stroke={colors.highlight} strokeWidth="2" strokeLinecap="round" />
                <line x1="30" y1="190" x2="45" y2="175" stroke={colors.highlight} strokeWidth="2" strokeLinecap="round" />
                <line x1="190" y1="190" x2="175" y2="175" stroke={colors.highlight} strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </div>
      )}
      
      {/* Badge indicando o rank */}
      {rankTier && (
        <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${RANK_FRAMES[rankTier].color} text-white z-30`}>
          {RANK_FRAMES[rankTier].name}
        </div>
      )}
      
      {/* Botão de edição */}
      {showEditButton && (
        <button 
          onClick={() => setShowSelector(true)}
          className={`absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full p-1 transition-colors shadow-lg z-40`}
          aria-label="Editar avatar"
        >
          <Edit size={14} />
        </button>
      )}
      
      {/* Modal de seleção de avatar */}
      {showSelector && (
        <CustomizationSelector 
          type="avatar"
          items={AVATARS}
          selectedItemId={avatarId}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
} 