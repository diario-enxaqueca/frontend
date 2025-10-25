import { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { NavigationBreadcrumb } from './NavigationBreadcrumb';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface Trigger {
  id: string;
  name: string;
  usageCount: number;
}

interface TriggersManagementProps {
  onBack?: () => void;
}

export function TriggersManagement({ onBack }: TriggersManagementProps) {
  const [triggers, setTriggers] = useState<Trigger[]>([
    { id: '1', name: 'Estresse', usageCount: 12 },
    { id: '2', name: 'Falta de sono', usageCount: 8 },
    { id: '3', name: 'Chocolate', usageCount: 5 },
    { id: '4', name: 'Café', usageCount: 4 },
    { id: '5', name: 'Luz forte', usageCount: 3 },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null);
  const [triggerToDelete, setTriggerToDelete] = useState<Trigger | null>(null);
  const [triggerName, setTriggerName] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAddNew = () => {
    setEditingTrigger(null);
    setTriggerName('');
    setShowDialog(true);
  };

  const handleEdit = (trigger: Trigger) => {
    setEditingTrigger(trigger);
    setTriggerName(trigger.name);
    setShowDialog(true);
  };

  const handleDelete = (trigger: Trigger) => {
    setTriggerToDelete(trigger);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (triggerToDelete) {
      setTriggers(triggers.filter((t) => t.id !== triggerToDelete.id));
      setTriggerToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleSave = () => {
    if (triggerName.trim()) {
      // BR-018: Verificar se o nome já existe (único por usuário)
      const duplicateTrigger = triggers.find(
        (t) =>
          t.name.toLowerCase() === triggerName.trim().toLowerCase() &&
          t.id !== editingTrigger?.id
      );

      if (duplicateTrigger) {
        // Aqui você pode adicionar um toast de erro
        console.error('Gatilho já cadastrado');
        return;
      }

      if (editingTrigger) {
        // Editar gatilho existente
        setTriggers(
          triggers.map((t) =>
            t.id === editingTrigger.id ? { ...t, name: triggerName.trim() } : t
          )
        );
      } else {
        // Adicionar novo gatilho
        const newTrigger: Trigger = {
          id: Date.now().toString(),
          name: triggerName.trim(),
          usageCount: 0,
        };
        setTriggers([...triggers, newTrigger]);
      }
      setShowDialog(false);
      setTriggerName('');
      setEditingTrigger(null);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setTriggerName('');
    setEditingTrigger(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:pb-6">
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
            <h1 className="text-[#333333]">Meus Gatilhos</h1>
            <Button
              onClick={handleAddNew}
              className="bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <div className="space-y-4">
          {triggers.map((trigger) => (
            <Card
              key={trigger.id}
              className="shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-[#333333] mb-1">{trigger.name}</p>
                    <p className="text-[#7F8C8D]">
                      Usado em {trigger.usageCount}{' '}
                      {trigger.usageCount === 1 ? 'episódio' : 'episódios'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(trigger)}
                      className="text-[#7F8C8D] hover:text-[#6C63FF] hover:bg-[#F5F5F5]"
                      aria-label={`Editar ${trigger.name}`}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(trigger)}
                      className="text-[#7F8C8D] hover:text-[#E74C3C] hover:bg-[#FEE]"
                      aria-label={`Deletar ${trigger.name}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {triggers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#717182] mb-4">
                Nenhum gatilho personalizado cadastrado
              </p>
              <Button
                onClick={handleAddNew}
                className="bg-[#6C63FF] hover:bg-[#5850E6] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Primeiro Gatilho
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTrigger ? 'Editar Gatilho' : 'Novo Gatilho'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="trigger-name" className="mb-2 block">
              Nome do gatilho
            </Label>
            <Input
              id="trigger-name"
              value={triggerName}
              onChange={(e) => setTriggerName(e.target.value)}
              placeholder="Ex: Vinho tinto"
              className="h-12"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSave();
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!triggerName.trim()}
              className="bg-[#6C63FF] hover:bg-[#5850E6]"
            >
              {editingTrigger ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o gatilho "{triggerToDelete?.name}"?
              {triggerToDelete && triggerToDelete.usageCount > 0 && (
                <span className="block mt-2 text-[#E67E22]">
                  Este gatilho está sendo usado em {triggerToDelete.usageCount}{' '}
                  {triggerToDelete.usageCount === 1 ? 'episódio' : 'episódios'}.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#E74C3C] hover:bg-[#C0392B]"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}