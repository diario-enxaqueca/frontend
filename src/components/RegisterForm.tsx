import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import { Mail, Lock, Eye, EyeOff, Brain, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { UserCreate } from '../lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

interface RegisterFormProps {
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: () => void;
}

export function RegisterForm({ onNavigateToLogin, onRegisterSuccess }: RegisterFormProps) {
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    if (!name.trim()) {
      setNameError('Campo Nome é obrigatório');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Campo E-mail é obrigatório');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Formato de e-mail inválido');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Campo Senha é obrigatório');
      hasError = true;
    } else if (!validatePassword(password)) {
      setPasswordError('Senha deve ter no mínimo 8 caracteres');
      hasError = true;
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirmação de senha é obrigatória');
      hasError = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const data: UserCreate = {
        nome: name,
        email: email,
        senha: password,
      };

      await register(data);

      setShowSuccessModal(true);
      
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 400 || error.response.status === 409) {
          setEmailError('E-mail já cadastrado');
        } else {
          alert(`Erro ao registrar: ${error.response.data.message || 'Tente novamente mais tarde.'}`);
        }
      } else {
        alert('Não foi possível conectar ao servidor.');
      }
      console.error('Erro no registro:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-6 text-center pt-8">
          {/* Logo/Ícone */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#6C63FF] to-[#FF6F91] rounded-full flex items-center justify-center shadow-md">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Título */}
          <div>
            <h1 className="text-[#333333] mb-2">Crie sua conta</h1>
            <p className="text-[#717182]">Comece a acompanhar suas enxaquecas</p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Nome */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#333333]">
                Nome completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError('');
                  }}
                  className={`pl-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors ${
                    nameError ? 'border-[#E74C3C]' : ''
                  }`}
                  aria-label="Nome completo"
                  aria-invalid={!!nameError}
                />
              </div>
              {nameError && (
                <p className="text-[#E74C3C] text-sm">{nameError}</p>
              )}
            </div>

            {/* Campo Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#333333]">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={`pl-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors ${
                    emailError ? 'border-[#E74C3C]' : ''
                  }`}
                  aria-label="Email"
                  aria-invalid={!!emailError}
                />
              </div>
              {emailError && (
                <p className="text-[#E74C3C] text-sm">{emailError}</p>
              )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#333333]">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo de 8 caracteres"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  className={`pl-10 pr-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors ${
                    passwordError ? 'border-[#E74C3C]' : ''
                  }`}
                  aria-label="Senha"
                  aria-invalid={!!passwordError}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#333333] transition-colors"
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-[#E74C3C] text-sm">{passwordError}</p>
              )}
            </div>

            {/* Campo Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#333333]">
                Confirmar senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError('');
                  }}
                  className={`pl-10 pr-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors ${
                    confirmPasswordError ? 'border-[#E74C3C]' : ''
                  }`}
                  aria-label="Confirmar senha"
                  aria-invalid={!!confirmPasswordError}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#333333] transition-colors"
                  aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-[#E74C3C] text-sm">{confirmPasswordError}</p>
              )}
            </div>

            {/* Botão Cadastrar */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md transition-all duration-200 hover:shadow-lg mt-6"
            >
              CADASTRAR
            </Button>

            {/* Link Login */}
            <div className="text-center pt-4">
              <p className="text-[#717182]">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className="text-[#6C63FF] hover:text-[#FF6F91] transition-colors"
                >
                  Faça login
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal de Sucesso */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                </div>
            </div>
            <DialogTitle className="text-center">Cadastro realizado com sucesso!</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            Parabéns, sua conta foi criada.<br />
            Agora você pode fazer login.
          </div>
          <DialogFooter>
            <Button
                onClick={() => {
                setShowSuccessModal(false);
                if (onNavigateToLogin) onNavigateToLogin();
                }}
            >
                Ir para Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
