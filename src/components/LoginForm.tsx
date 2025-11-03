import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Mail, Lock, Eye, EyeOff, Brain } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onNavigateToRegister?: () => void;
  onLoginSuccess?: () => void;
}

export function LoginForm({ onNavigateToRegister, onLoginSuccess }: LoginFormProps) {
  const { login, resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);


  // BR-002: Validação de formato de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // BR-003: Senha deve ter no mínimo 8 caracteres
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetar erros
    setEmailError('');
    setPasswordError('');
    
    let hasError = false;
    
    // Validar email
    if (!validateEmail(email)) {
      setEmailError('Formato de e-mail inválido');
      hasError = true;
    }
    
    // Validar senha
    if (!validatePassword(password)) {
      setPasswordError('Senha deve ter no mínimo 8 caracteres');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
 
    // // Lógica de login será implementada posteriormente
    // console.log('Login:', { email, password });
    
    // // Simular sucesso
    // if (onLoginSuccess) {
    //   onLoginSuccess();
    // }

    try {
        await login({ nome: email, email, senha: password });
        if (onLoginSuccess) {
          onLoginSuccess();
        }
    } catch (error: any) {
        if (error.response && error.response.status === 401) {
        setPasswordError('Usuário ou senha inválidos');
        } else {
        setPasswordError('Erro ao conectar com o servidor');
        }
        console.error('Login error:', error);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPasswordDialog(true);
    setResetEmailSent(false);
    setResetEmail('');
    setResetEmailError('');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    setResetEmailError('');
    
    if (!validateEmail(resetEmail)) {
      setResetEmailError('Formato de e-mail inválido');
      setIsSending(false);
      return;
    }
    
    // Simular envio de email de recuperação
    // console.log('Enviar email de recuperação para:', resetEmail);
    // setResetEmailSent(true);

    try {
        await resetPassword({ email: resetEmail });
        setResetEmailSent(true);
        // Fechar o dialog após 3 segundos
        setTimeout(() => {
        setShowForgotPasswordDialog(false);
        setResetEmailSent(false);
        setResetEmail('');
        setIsSending(false);
        }, 3000);
    } catch (error: any) {
        if (error.response) {
        // Se backend retornar erro, mostra mensagem
        setResetEmailError(error.response.data.detail || 'Erro ao enviar email de recuperação');
        } else {
        setResetEmailError('Erro de conexão com o servidor');
        }
        console.error('Erro ao enviar email de recuperação:', error);
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
            <h1 className="text-[#333333] mb-2">Acesse sua conta</h1>
            <p className="text-[#717182]">Bem-vindo ao Diário de Enxaqueca</p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors"
                  required
                  aria-label="Email"
                />
              </div>
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
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
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors"
                  required
                  aria-label="Senha"
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
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            {/* Link Esqueci Senha */}
            <div className="flex justify-end">
              <a
                href="#"
                className="text-[#6C63FF] hover:text-[#FF6F91] transition-colors"
                onClick={handleForgotPassword}
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Botão Entrar */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md transition-all duration-200 hover:shadow-lg"
              disabled={isSending}
            >
              {isSending ? 'Enviando...' : 'ENTRAR'}  
            </Button>

            {/* Link Cadastro */}
            <div className="text-center pt-4">
              <p className="text-[#717182]">
                Não tem conta?{' '}
                <a
                  href="#"
                  className="text-[#6C63FF] hover:text-[#FF6F91] transition-colors"
                  onClick={onNavigateToRegister}
                >
                  Cadastre-se
                </a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Dialog Esqueci Senha */}
      <Dialog open={showForgotPasswordDialog} onOpenChange={setShowForgotPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          {!resetEmailSent ? (
            <>
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6C63FF] to-[#FF6F91] rounded-full flex items-center justify-center shadow-md">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                </div>
                <DialogTitle className="text-center">Recuperar Senha</DialogTitle>
                <DialogDescription className="text-center">
                  Digite seu e-mail para receber instruções de recuperação de senha.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="resetEmail" className="text-[#333333]">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                    <Input
                      id="resetEmail"
                      type="email"
                      placeholder="seu@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors"
                      required
                      aria-label="Email para recuperação"
                    />
                  </div>
                  {resetEmailError && <p className="text-red-500 text-sm">{resetEmailError}</p>}
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForgotPasswordDialog(false)}
                    className="flex-1"
                    >
                    Cancelar
                    </Button>
                    <Button
                    type="submit"
                    className="flex-1 bg-[#6C63FF] hover:bg-[#5850E6] text-white"
                    >
                    Enviar
                    </Button>
                </div>
                </form>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <DialogTitle className="text-center">E-mail Enviado!</DialogTitle>
                <DialogDescription className="text-center">
                  Enviamos instruções de recuperação para<br />
                  <strong className="text-[#333333]">{resetEmail}</strong>
                </DialogDescription>
              </DialogHeader>

              <div className="pt-4 text-center">
                <p className="text-sm text-[#717182]">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}