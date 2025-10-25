import { useState } from 'react';
import { ArrowLeft, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

interface ProfileSettingsProps {
  onBack?: () => void;
}

export function ProfileSettings({ onBack }: ProfileSettingsProps) {
  const [name, setName] = useState('João Silva');
  const [email] = useState('joao.silva@email.com');
  const memberSince = '01 de Janeiro de 2025';

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleSaveChanges = () => {
    console.log('Salvar alterações:', { name, email });
    // Aqui você implementaria a lógica de salvar
  };

  const handleChangePassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      console.log('Alterar senha');
      setShowPasswordDialog(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  const handleDeleteAccount = () => {
    console.log('Excluir conta');
    // Aqui você implementaria a lógica de exclusão
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-[#333333]" />
            </Button>
            <h1 className="text-[#333333]">Meu Perfil</h1>
            <div className="w-10" /> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4 bg-gradient-to-br from-[#6C63FF]/20 to-[#FF6F91]/20">
              <AvatarFallback className="bg-transparent">
                <User className="w-12 h-12 text-[#6C63FF]" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-[#333333] mb-2 block">
                📧 Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="h-12 bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-[#333333] mb-2 block">
                👤 Nome
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 border-[#BDC3C7] focus:border-[#6C63FF]"
                placeholder="Seu nome completo"
              />
            </div>

            {/* Member Since */}
            <div>
              <Label className="text-[#333333] mb-2 block">
                📅 Membro desde
              </Label>
              <p className="text-[#717182] py-3">{memberSince}</p>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveChanges}
            className="w-full h-12 bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md"
          >
            SALVAR ALTERAÇÕES
          </Button>

          <Separator className="my-6" />

          {/* Security Section */}
          <div className="space-y-4">
            <h2 className="text-[#333333]">🔐 Segurança</h2>
            <Button
              variant="outline"
              onClick={() => setShowPasswordDialog(true)}
              className="w-full h-12 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white"
            >
              ALTERAR SENHA
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Danger Zone */}
          <div className="space-y-4">
            <h2 className="text-[#333333]">⚠️ Zona de Perigo</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full h-12 bg-[#E74C3C] hover:bg-[#C0392B] text-white"
                >
                  EXCLUIR CONTA
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar exclusão de conta</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir sua conta? Todos os seus dados,
                    incluindo episódios registrados, serão permanentemente
                    removidos.
                    <br />
                    <br />
                    <span className="text-[#E74C3C]">
                      Esta ação não pode ser desfeita.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-[#E74C3C] hover:bg-[#C0392B]"
                  >
                    Excluir Conta
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <p className="text-[#717182] text-center">
              (Esta ação não pode ser desfeita)
            </p>
          </div>
        </div>
      </main>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="current-password" className="mb-2 block">
                Senha atual
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                className="h-12"
              />
            </div>
            <div>
              <Label htmlFor="new-password" className="mb-2 block">
                Nova senha
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                className="h-12"
              />
              <p className="text-[#717182] mt-1">
                Mínimo de 8 caracteres
              </p>
            </div>
            <div>
              <Label htmlFor="confirm-password" className="mb-2 block">
                Confirmar nova senha
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                className="h-12"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[#E74C3C] mt-1">
                  As senhas não coincidem
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowPasswordDialog(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChangePassword}
              disabled={
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                newPassword !== confirmPassword ||
                newPassword.length < 8
              }
              className="bg-[#6C63FF] hover:bg-[#5850E6]"
            >
              Alterar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}