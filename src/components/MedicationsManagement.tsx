import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { getMedicacoes, createMedicacao, updateMedicacao, deleteMedicacao } from '../services/apiClient';
import type { MedicacaoOut } from '../lib/types';
import { useToast, ToastContainer } from './ui/toast';

interface MedicationsManagementProps {
  onBack?: () => void;
}

export function MedicationsManagement({ onBack }: MedicationsManagementProps) {
  const [medications, setMedications] = useState<MedicacaoOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingMedication, setEditingMedication] = useState<MedicacaoOut | null>(null);
  const [medicationToDelete, setMedicationToDelete] = useState<MedicacaoOut | null>(null);
  const [medicationName, setMedicationName] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { toasts, removeToast, success, error: showError } = useToast();

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      const data = await getMedicacoes();
      setMedications(data);
    } catch (err: any) {
      console.error('Erro ao buscar medicações:', err);
      setError('Erro ao carregar medicações');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleAddNew = () => {
    setEditingMedication(null);
    setMedicationName('');
    setMedicationDosage('');
    setShowDialog(true);
  };

  const handleEdit = (medication: MedicacaoOut) => {
    setEditingMedication(medication);
    setMedicationName(medication.nome);
    setMedicationDosage(medication.dosagem || '');
    setShowDialog(true);
  };

  const handleDelete = (medication: MedicacaoOut) => {
    setMedicationToDelete(medication);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (medicationToDelete) {
      try {
        setDeleting(true);
        await deleteMedicacao(medicationToDelete.id);
        setMedications(medications.filter((m) => m.id !== medicationToDelete.id));
        success(`Medicação "${medicationToDelete.nome}" excluída com sucesso`);
        setMedicationToDelete(null);
        setShowDeleteDialog(false);
      } catch (err: any) {
        console.error('Erro ao deletar medicação:', err);
        const errorMessage = err.response?.data?.detail || 'Erro ao deletar medicação';
        showError(errorMessage);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleSave = async () => {
    if (!medicationName.trim()) return;

    // Verificar duplicata no frontend (validação rápida de UX)
    const duplicateMedication = medications.find(
      (m) => 
        m.nome.toLowerCase() === medicationName.trim().toLowerCase() &&
        m.id !== editingMedication?.id
    );

    if (duplicateMedication) {
      showError('Já existe uma medicação com este nome');
      return;
    }

    // Validar dosagem
    if (medicationDosage.length > 100) {
      showError('Dosagem excede 100 caracteres');
      return;
    }

    try {
      setSaving(true);
      if (editingMedication) {
        // Atualizar
        const updatedMedication = await updateMedicacao(editingMedication.id, { 
          nome: medicationName.trim(), 
          dosagem: medicationDosage.trim() || null
        });
        setMedications(medications.map(m => 
          m.id === editingMedication.id ? updatedMedication : m
        ).sort((a, b) => a.nome.localeCompare(b.nome)));
        success(`Medicação "${medicationName.trim()}" atualizada com sucesso`);
      } else {
        // Criar novo
        const newMedication = await createMedicacao({ 
          nome: medicationName.trim(), 
          dosagem: medicationDosage.trim() || null
        });
        setMedications([...medications, newMedication].sort((a, b) => a.nome.localeCompare(b.nome)));
        success(`Medicação "${medicationName.trim()}" cadastrada com sucesso`);
      }
      setShowDialog(false);
      setMedicationName('');
      setMedicationDosage('');
      setEditingMedication(null);
    } catch (err: any) {
      console.error('Erro ao salvar medicação:', err);
      const errorMessage = err.response?.data?.detail || 'Erro ao salvar medicação';
      showError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setMedicationName('');
    setMedicationDosage('');
    setEditingMedication(null);
  };

  return (
    <div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
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
            <h1 className="text-[#333333]">Minhas Medicações</h1>
            <Button
              onClick={handleAddNew}
              className="bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C63FF]"></div>
            <span className="ml-3 text-[#717182]">Carregando medicações...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <Card
                key={medication.id}
                className="shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="text-[#333333]">{medication.nome}</p>
                        {medication.dosagem && (
                          <span className="text-[#7F8C8D]">({medication.dosagem})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(medication)}
                        className="text-[#7F8C8D] hover:text-[#6C63FF] hover:bg-[#F5F5F5]"
                        aria-label={`Editar ${medication.nome}`}
                      >
                        <Edit className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(medication)}
                        className="text-[#7F8C8D] hover:text-[#E74C3C] hover:bg-[#FEE]"
                        aria-label={`Deletar ${medication.nome}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {medications.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[#717182] mb-4">
                  Nenhuma medicação cadastrada
                </p>
                <Button
                  onClick={handleAddNew}
                  className="bg-[#6C63FF] hover:bg-[#5850E6] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Primeira Medicação
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMedication ? 'Editar Medicação' : 'Nova Medicação'}
            </DialogTitle>
            <DialogDescription>
              {editingMedication
                ? 'Altere as informações da medicação abaixo.'
                : 'Adicione uma nova medicação usada para tratar suas enxaquecas.'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="medication-name" className="mb-2 block">
                Nome da medicação
              </Label>
              <Input
                id="medication-name"
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="Ex: Paracetamol"
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
            <div>
              <Label htmlFor="medication-dosage" className="mb-2 block">
                Dosagem (opcional)
              </Label>
              <Input
                id="medication-dosage"
                value={medicationDosage}
                onChange={(e) => setMedicationDosage(e.target.value)}
                placeholder="Ex: 500mg, 1 comprimido"
                className="h-12"
                maxLength={100}
              />
              <p className="text-[#717182] mt-1">
                Máximo 100 caracteres
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDialog} disabled={saving} className="border border-gray-300">
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!medicationName.trim() || saving}
              className="bg-[#6C63FF] hover:bg-[#5850E6]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                editingMedication ? 'Salvar' : 'Adicionar'
              )}
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
              Tem certeza que deseja excluir a medicação "{medicationToDelete?.nome}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-[#E74C3C] hover:bg-[#C0392B]"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}