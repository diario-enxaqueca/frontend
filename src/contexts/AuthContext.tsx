/**
 * Contexto de Autenticação
 * Gerencia estado global de autenticação com JWT
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as apiClient from '../services/apiClient';
import { UserOut, UserCreate, UserLogin, UserUpdate, ResetPasswordRequest } from '../lib/types';
import { toast } from 'sonner@2.0.3';

interface AuthContextType {
  user: UserOut | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: UserLogin) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => void;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateCurrentUser: (data: UserUpdate) => Promise<UserOut>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário ao inicializar (se token existir)
  useEffect(() => {
    const loadUser = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          apiClient.clearAuthToken();
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (data: UserLogin) => {
    try {
      await apiClient.login(data);
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao fazer login';
      toast.error(message);
      throw error;
    }
  };

  const register = async (data: UserCreate) => {
    try {
      await apiClient.register(data);
      toast.success('Cadastro realizado! Faça login para continuar.');
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao registrar';
      toast.error(message);
      throw error;
    }
  };

  const logout = () => {
    apiClient.logout();
    setUser(null);
    toast.success('Logout realizado com sucesso!');
  };

  const resetPassword = async (data: ResetPasswordRequest) => {
    try {
      const response = await apiClient.resetPassword(data);
      toast.success(response.message);
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erro ao redefinir senha';
      toast.error(message);
      throw error;
    }
  };

  const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    try {
        const response = await apiClient.changePassword(data);
        toast.success(response.message);
    } catch (error: any) {
        const message = error.response?.data?.detail || 'Erro ao alterar senha';
        toast.error(message);
        throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const updateCurrentUser = async (data: UserUpdate) => {
    try {
        const updatedUser = await apiClient.updateCurrentUser(data);
        setUser(updatedUser);
        toast.success('Dados atualizados com sucesso!');
        return updatedUser; // Opcional, se precisar usar retorna na UI
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        toast.error('Erro ao atualizar perfil');
        throw error;
    }
    };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        resetPassword,
        refreshUser,
        updateCurrentUser,
        changePassword, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
