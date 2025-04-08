'use client';

import React from 'react';
import { User, Activity, DollarSign, Award, Package, Clock, ArrowUp, ArrowDown } from 'react-feather';
import Link from 'next/link';

// Componente para os cards de métricas
function MetricCard({ 
  title, 
  value, 
  description, 
  icon, 
  change, 
  isPositive,
  link
}: { 
  title: string; 
  value: string; 
  description: string; 
  icon: React.ReactNode;
  change?: string;
  isPositive?: boolean;
  link?: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-1 text-2xl font-semibold text-gray-900">{value}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="p-2 bg-gray-100 rounded-lg">
          {icon}
        </div>
      </div>
      
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isPositive ? <ArrowUp size={12} className="mr-1" /> : <ArrowDown size={12} className="mr-1" />}
            {change}
          </span>
          <span className="ml-2 text-xs text-gray-500">desde o mês passado</span>
        </div>
      )}
      
      {link && (
        <Link href={link} className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center">
          Ver detalhes
        </Link>
      )}
    </div>
  );
}

// Componente para items de atividade recente
function ActivityItem({ 
  icon, 
  description, 
  time 
}: { 
  icon: React.ReactNode;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
      <div className="p-2 bg-gray-100 rounded-lg">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-900">{description}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  // Dados simulados para o dashboard
  const dashboardData = {
    totalUsers: 2458,
    activeUsers: 876,
    totalMatches: 1245,
    activeMatches: 32,
    revenue: 78650.75,
    transactions: 4521,
    lastRegistrations: [
      { id: 1, name: 'João Silva', email: 'joao@email.com', date: '2023-04-06' },
      { id: 2, name: 'Maria Santos', email: 'maria@email.com', date: '2023-04-06' },
      { id: 3, name: 'Pedro Alves', email: 'pedro@email.com', date: '2023-04-05' },
      { id: 4, name: 'Ana Pereira', email: 'ana@email.com', date: '2023-04-05' },
    ],
    recentMatches: [
      { id: 101, type: 'Squad', players: 16, status: 'Em andamento', startTime: '14:30' },
      { id: 102, type: 'Dupla', players: 8, status: 'Finalizada', startTime: '13:15' },
      { id: 103, type: 'Solo', players: 6, status: 'Aguardando', startTime: '15:45' },
      { id: 104, type: 'Squad', players: 20, status: 'Finalizada', startTime: '12:00' },
    ]
  };

  // Formatador de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Usuários" 
          value={dashboardData.totalUsers.toString()} 
          description={`${dashboardData.activeUsers} ativos`}
          icon={<User className="text-blue-500" />}
          change="+12%"
          isPositive={true}
          link="/admin/usuarios"
        />
        
        <MetricCard 
          title="Partidas" 
          value={dashboardData.totalMatches.toString()} 
          description={`${dashboardData.activeMatches} ativas`}
          icon={<Activity className="text-green-500" />}
          change="+5.3%"
          isPositive={true}
          link="/admin/partidas"
        />
        
        <MetricCard 
          title="Faturamento" 
          value={formatCurrency(dashboardData.revenue)} 
          description={`${dashboardData.transactions} transações`}
          icon={<DollarSign className="text-purple-500" />}
          change="+23.1%"
          isPositive={true}
          link="/admin/financeiro"
        />
        
        <MetricCard 
          title="Personagens" 
          value="15" 
          description="8 disponíveis gratuitamente"
          icon={<Package className="text-orange-500" />}
          change="3 novos"
          isPositive={true}
          link="/admin/personagens"
        />
      </div>

      {/* Seção de gráficos - Placeholder para implementação futura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Usuários Cadastrados</h2>
          <div className="bg-gray-50 h-64 rounded flex items-center justify-center text-gray-500">
            Gráfico de usuários cadastrados por dia (implementação futura)
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Receita</h2>
          <div className="bg-gray-50 h-64 rounded flex items-center justify-center text-gray-500">
            Gráfico de receita por dia (implementação futura)
          </div>
        </div>
      </div>

      {/* Seção de tabelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Últimos usuários cadastrados */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Últimos Cadastros</h2>
            <Link href="/admin/usuarios" className="text-sm text-purple-600 hover:text-purple-800">
              Ver todos
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.lastRegistrations.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                      {new Date(user.date).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Partidas recentes */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Partidas Recentes</h2>
            <Link href="/admin/partidas" className="text-sm text-purple-600 hover:text-purple-800">
              Ver todas
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horário
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                      #{match.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                      {match.type}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        match.status === 'Em andamento' 
                          ? 'bg-green-100 text-green-800' 
                          : match.status === 'Aguardando' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                      {match.startTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Seção de atividades recentes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Atividades Recentes</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActivityItem 
            icon={<User className="text-blue-500" />}
            description="Novo usuário cadastrado: João Silva"
            time="5 minutos atrás"
          />
          <ActivityItem 
            icon={<DollarSign className="text-green-500" />}
            description="Nova transação: R$ 150,00 - ID #54321"
            time="15 minutos atrás"
          />
          <ActivityItem 
            icon={<Activity className="text-purple-500" />}
            description="Partida #102 finalizada com 8 jogadores"
            time="30 minutos atrás"
          />
          <ActivityItem 
            icon={<Award className="text-yellow-500" />}
            description="Novo prêmio reivindicado: Pacote Premium - ID #8765"
            time="1 hora atrás"
          />
          <ActivityItem 
            icon={<Package className="text-orange-500" />}
            description="Nova skin adicionada: Ninja Espacial"
            time="2 horas atrás"
          />
          <ActivityItem 
            icon={<Clock className="text-red-500" />}
            description="Manutenção programada: 22/05/2023 às 03:00"
            time="3 horas atrás"
          />
        </div>
      </div>
    </div>
  );
} 