'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// Interface para o usuário que vem da API
type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  balance: number;
  createdAt: string;
  username?: string;
  level?: number;
  avatarId?: string;
  bannerId?: string;
  achievements?: string[];
  purchases?: string[];
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSimulatedMode: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  updateCustomization: (type: 'avatar' | 'banner', itemId: string) => Promise<void>;
  createLocalUser: (userData: any) => void;
  toggleSimulatedMode: () => void;
  loginAsDemoUser: () => void;
};

// Criando o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuário demo para modo simulado
const demoUser: User = {
  id: 'demo-123',
  name: 'Usuário Demonstração',
  email: 'demo@rpx.com',
  phone: '(11) 99999-9999',
  birthdate: '1990-01-01',
  balance: 5000,
  createdAt: new Date().toISOString(),
  username: 'usuario_demo_1234',
  level: 10,
  avatarId: '1',
  bannerId: '1',
  achievements: ['achievement1', 'achievement2'],
  purchases: ['item1', 'item2']
};

// Função para gerar username a partir do nome
const generateUsername = (name: string): string => {
  // Remove espaços e caracteres especiais
  const baseUsername = name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '_');
  
  // Adiciona um sufixo aleatório para garantir unicidade
  const randomSuffix = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
  return `${baseUsername}_${randomSuffix}`;
};

// Função para gerar um ID único
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulatedMode, setIsSimulatedMode] = useState(false);
  const router = useRouter();

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const validateToken = async () => {
      try {
        // Verificar se existe um modo simulado ativo
        const simulatedMode = localStorage.getItem('simulated_mode') === 'true';
        setIsSimulatedMode(simulatedMode);
        
        // Se estiver em modo simulado, verificar se há um usuário local
        if (simulatedMode) {
          const localUser = localStorage.getItem('local_user');
          if (localUser) {
            setUser(JSON.parse(localUser));
          } else {
            // Criar usuário demo automaticamente se não existir usuário local
            localStorage.setItem('local_user', JSON.stringify(demoUser));
            setUser(demoUser);
          }
          setIsLoading(false);
          return;
        }

        // Verificar se existe um token no localStorage
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        // Validar o token com a API
        try {
          const response = await fetch('/api/auth/validate-token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Token inválido');
          }

          const data = await response.json();
          setUser(data.user);
        } catch (error) {
          console.error('Erro ao validar token:', error);
          localStorage.removeItem('auth_token');
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    validateToken();
  }, []);

  // Login automático como usuário demo
  const loginAsDemoUser = () => {
    setUser(demoUser);
    localStorage.setItem('local_user', JSON.stringify(demoUser));
    localStorage.setItem('simulated_mode', 'true');
    setIsSimulatedMode(true);
    router.push('/profile');
  };

  // Função para criar um usuário local (modo simulado)
  const createLocalUser = (userData: any) => {
    // Gerar dados fictícios para o usuário local
    const localUser: User = {
      id: generateUniqueId(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '',
      birthdate: userData.birthdate || '',
      balance: 1000, // Saldo inicial fictício
      createdAt: new Date().toISOString(),
      username: userData.username || generateUsername(userData.name),
      level: 1,
      avatarId: '1', // Avatar padrão
      bannerId: '1', // Banner padrão
      achievements: [],
      purchases: []
    };

    // Salvar o usuário local no localStorage
    localStorage.setItem('local_user', JSON.stringify(localUser));
    localStorage.setItem('simulated_mode', 'true');
    
    // Atualizar o estado
    setUser(localUser);
    setIsSimulatedMode(true);
  };

  // Função para alternar entre modo real e simulado
  const toggleSimulatedMode = () => {
    const newMode = !isSimulatedMode;
    setIsSimulatedMode(newMode);
    localStorage.setItem('simulated_mode', newMode.toString());
    
    if (newMode) {
      // Ao ativar o modo simulado, sempre usar o usuário demo
      localStorage.setItem('local_user', JSON.stringify(demoUser));
      setUser(demoUser);
    } else {
      // Ao desativar o modo simulado, tentar carregar usuário real
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
      } else {
        // Aqui deveria recarregar o usuário real, mas simplificamos para apenas limpar
        setUser(null);
      }
    }
  };

  // Função de login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Se estiver em modo simulado, aceitar qualquer login e usar o demo
      if (isSimulatedMode) {
        setUser(demoUser);
        localStorage.setItem('local_user', JSON.stringify(demoUser));
        setIsLoading(false);
        return;
      }

      // Usando o proxy configurado no Next.js
      console.log('Enviando solicitação de login para: /api/auth/login');

      // Login usando o proxy do Next.js
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      // Verificar se a resposta não é OK
      if (!response.ok) {
        // Primeiro tentar obter o texto da resposta
        const responseText = await response.text();
        
        try {
          // Tentar analisar o texto como JSON
          const errorData = JSON.parse(responseText);
          throw new Error(errorData.message || 'Erro ao fazer login');
        } catch (jsonError) {
          // Se não conseguir analisar como JSON, usar o texto da resposta
          console.error('Erro na resposta não-JSON:', responseText);
          throw new Error('Erro na comunicação com o servidor. Tente novamente mais tarde.');
        }
      }
      
      // Se a resposta for OK, tentamos analisar o JSON
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (jsonError) {
        console.error('Erro ao analisar JSON da resposta:', jsonError, 'Texto recebido:', text);
        throw new Error('Erro ao processar resposta do servidor. Tente novamente mais tarde.');
      }
      
      // Verificar se o token existe na resposta
      if (!data.token && data.data?.token) {
        data.token = data.data.token;
      }
      
      if (!data.user && data.data?.user) {
        data.user = data.data.user;
      }
      
      // Armazenar token
      localStorage.setItem('auth_token', data.token);
      
      // Atualizar estado do usuário
      setUser(data.user);
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (userData: any) => {
    setIsLoading(true);
    
    try {
      // Se estiver em modo simulado, criar usuário local
      if (isSimulatedMode) {
        createLocalUser(userData);
        setIsLoading(false);
        return;
      }

      // Adicionar um username aos dados de registro
      const userDataWithUsername = {
        ...userData,
        username: generateUsername(userData.name),
      };

      console.log('Tentando registrar com dados:', {
        ...userDataWithUsername,
        password: '[PROTEGIDO]'
      });

      // Usando o proxy configurado no Next.js
      console.log('Enviando solicitação para: /api/auth/register');

      // Registro usando o proxy do Next.js
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataWithUsername),
      });
      
      // Verificar se a resposta não é OK
      if (!response.ok) {
        // Primeiro tentar obter o texto da resposta
        const responseText = await response.text();
        
        try {
          // Tentar analisar o texto como JSON
          const errorData = JSON.parse(responseText);
          console.error('Erro na resposta da API de registro:', errorData);
          throw new Error(errorData.message || 'Erro ao registrar usuário');
        } catch (jsonError) {
          // Se não conseguir analisar como JSON, usar o texto da resposta
          console.error('Erro na resposta não-JSON do registro:', responseText);
          throw new Error('Erro na comunicação com o servidor de registro. Tente novamente mais tarde.');
        }
      }
      
      // Se a resposta for OK, tentamos analisar o JSON
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
        console.log('Usuário registrado com sucesso na API:', data.user?.id || data.data?.user?.id || 'ID não disponível');
      } catch (jsonError) {
        console.error('Erro ao analisar JSON da resposta de registro:', jsonError, 'Texto recebido:', text);
        throw new Error('Erro ao processar resposta do servidor de registro. Tente novamente mais tarde.');
      }
      
      // Verificar se o token existe na resposta
      if (!data.token && data.data?.token) {
        data.token = data.data.token;
      }
      
      if (!data.user && data.data?.user) {
        data.user = data.data.user;
      }
      
      // Armazenar token
      localStorage.setItem('auth_token', data.token);
      
      // Atualizar estado do usuário
      setUser(data.user);
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.message || 'Falha no registro. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = async (userData: Partial<User>) => {
    setIsLoading(true);
    
    try {
      // Se estiver em modo simulado, atualizar usuário local
      if (isSimulatedMode && user) {
        const updatedUser = { ...user, ...userData };
        localStorage.setItem('local_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsLoading(false);
        return;
      }

      // Atualização usando a API
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao atualizar perfil');
      }
      
      const data = await response.json();
      
      // Atualizar estado do usuário
      setUser(data.user);
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      throw new Error(error.message || 'Falha ao atualizar perfil. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para atualizar customizações do perfil
  const updateCustomization = async (type: 'avatar' | 'banner', itemId: string) => {
    setIsLoading(true);
    
    try {
      // Se estiver em modo simulado, atualizar usuário local
      if (isSimulatedMode && user) {
        const updatedUser = { 
          ...user, 
          ...(type === 'avatar' ? { avatarId: itemId } : { bannerId: itemId })
        };
        localStorage.setItem('local_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsLoading(false);
        return;
      }

      // Atualização usando a API
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        throw new Error('Usuário não autenticado');
      }
      
      const response = await fetch('/api/users/customization', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, itemId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ao atualizar ${type}`);
      }
      
      const data = await response.json();
      
      // Atualizar estado do usuário
      setUser(data.user);
    } catch (error: any) {
      console.error(`Erro ao atualizar ${type}:`, error);
      throw new Error(error.message || `Falha ao atualizar ${type}. Tente novamente mais tarde.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    // Remover token do localStorage
    localStorage.removeItem('auth_token');
    
    // Se estiver em modo simulado, manter o modo mas limpar o usuário
    if (isSimulatedMode) {
      setUser(null);
    } else {
      // Limpar estado do usuário
      setUser(null);
    }
    
    // Redirecionar para a página inicial
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isSimulatedMode,
        login,
        register,
        logout,
        updateUser,
        updateCustomization,
        createLocalUser,
        toggleSimulatedMode,
        loginAsDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para facilitar o acesso ao contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 