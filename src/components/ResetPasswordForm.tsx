import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader } from './ui/card';
import { Lock, Eye, EyeOff, Brain, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface ResetPasswordFormProps {
  token?: string; // Token recebido do email
  onResetSuccess?: () => void;
  onBackToLogin?: () => void;
}

export function ResetPasswordForm({ token, onResetSuccess, onBackToLogin }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // BR-003: Senha deve ter no mínimo 8 caracteres
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetar erros
    setPasswordError('');
    setConfirmPasswordError('');
    
    let hasError = false;
    
    // Validar senha
    if (!validatePassword(password)) {
      setPasswordError('Senha deve ter no mínimo 8 caracteres');
      hasError = true;
    }
    
    // Validar confirmação de senha
    if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não conferem');
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    // Simular requisição de reset de senha
    setIsLoading(true);
    
    setTimeout(() => {
      console.log('Resetar senha com token:', token);
      console.log('Nova senha:', password);
      
      setIsLoading(false);
      setResetSuccess(true);
      
      // Redirecionar para login após 3 segundos
      setTimeout(() => {
        if (onResetSuccess) {
          onResetSuccess();
        }
      }, 3000);
    }, 1500);
  };

  // Validação de força da senha
  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { strength: '', color: '', text: '' };
    if (pwd.length < 8) return { strength: 'weak', color: 'bg-red-500', text: 'Fraca' };
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z0-9]/.test(pwd)) strength++;
    
    if (strength <= 2) return { strength: 'weak', color: 'bg-red-500', text: 'Fraca' };
    if (strength <= 3) return { strength: 'medium', color: 'bg-yellow-500', text: 'Média' };
    return { strength: 'strong', color: 'bg-green-500', text: 'Forte' };
  };

  const passwordStrength = getPasswordStrength(password);

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="px-8 py-12">
            <div className="text-center space-y-6">
              {/* Ícone de Sucesso */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600" />
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-2">
                <h2 className="text-[#333333]">Senha alterada com sucesso!</h2>
                <p className="text-[#717182]">
                  Sua senha foi redefinida.<br />
                  Redirecionando para o login...
                </p>
              </div>

              {/* Botão para voltar ao login */}
              <Button
                onClick={onBackToLogin}
                className="w-full h-12 bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md transition-all duration-200"
              >
                VOLTAR PARA O LOGIN
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-[#333333] mb-2">Redefinir Senha</h1>
            <p className="text-[#717182]">Digite sua nova senha</p>
          </div>
        </CardHeader>

        <CardContent className="px-8 pb-8">
          {/* Alerta se token inválido/expirado (simulação) */}
          {!token && (
            <Alert className="mb-6 border-yellow-500 bg-yellow-50">
              <AlertDescription className="text-yellow-800">
                Link de recuperação inválido ou expirado. Solicite um novo link de recuperação.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#333333]">
                Nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors"
                  required
                  aria-label="Nova senha"
                  disabled={!token}
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

              {/* Indicador de força da senha */}
              {password.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded ${passwordStrength.color} transition-all`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'medium' || passwordStrength.strength === 'strong' ? passwordStrength.color : 'bg-gray-200'} transition-all`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'strong' ? passwordStrength.color : 'bg-gray-200'} transition-all`}></div>
                  </div>
                  <p className="text-xs text-[#717182]">
                    Força da senha: <span className={passwordStrength.strength === 'weak' ? 'text-red-500' : passwordStrength.strength === 'medium' ? 'text-yellow-500' : 'text-green-500'}>{passwordStrength.text}</span>
                  </p>
                </div>
              )}

              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            {/* Campo Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-[#333333]">
                Confirmar nova senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#717182]" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Digite a senha novamente"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 border-gray-300 focus:border-[#6C63FF] focus:ring-[#6C63FF] transition-colors"
                  required
                  aria-label="Confirmar nova senha"
                  disabled={!token}
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
              {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
            </div>

            {/* Dicas de senha segura */}
            <div className="bg-[#F5F5F5] p-4 rounded-lg">
              <p className="text-sm text-[#717182] mb-2">Dicas para uma senha segura:</p>
              <ul className="text-xs text-[#717182] space-y-1">
                <li className="flex items-start gap-2">
                  <span className={password.length >= 8 ? 'text-green-500' : 'text-gray-400'}>•</span>
                  Mínimo de 8 caracteres
                </li>
                <li className="flex items-start gap-2">
                  <span className={(/[a-z]/.test(password) && /[A-Z]/.test(password)) ? 'text-green-500' : 'text-gray-400'}>•</span>
                  Letras maiúsculas e minúsculas
                </li>
                <li className="flex items-start gap-2">
                  <span className={/\d/.test(password) ? 'text-green-500' : 'text-gray-400'}>•</span>
                  Números
                </li>
                <li className="flex items-start gap-2">
                  <span className={/[^a-zA-Z0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'}>•</span>
                  Caracteres especiais (!@#$%^&*)
                </li>
              </ul>
            </div>

            {/* Botão Redefinir Senha */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md transition-all duration-200 hover:shadow-lg"
              disabled={isLoading || !token}
            >
              {isLoading ? 'REDEFININDO...' : 'REDEFINIR SENHA'}
            </Button>

            {/* Link Voltar ao Login */}
            <div className="text-center pt-4">
              <a
                href="#"
                className="text-[#6C63FF] hover:text-[#FF6F91] transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  if (onBackToLogin) onBackToLogin();
                }}
              >
                ← Voltar para o login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
