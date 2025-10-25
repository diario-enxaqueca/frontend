import { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
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

interface Medication {
  id: string;
  name: string;
  dosage?: string;
  usageCount: number;
}

interface MedicationsManagementProps {
  onBack?: () => void;
}

export function MedicationsManagement({ onBack }: MedicationsManagementProps) {
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: 'Paracetamol', dosage: '500mg', usageCount: 15 },
    { id: '2', name: 'Ibuprofeno', dosage: '400mg', usageCount: 10 },
    { id: '3', name: 'Dipirona', dosage: '1g', usageCount: 8 },
    { id: '4', name: 'Sumatriptano', dosage: '50mg', usageCount: 6 },
    { id: '5', name: 'Naproxeno', dosage: '500mg', usageCount: 4 },
  ]);

  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [medicationToDelete, setMedicationToDelete] = useState<Medication | null>(null);
  const [medicationName, setMedicationName] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');

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

  const handleEdit = (medication: Medication) => {
    setEditingMedication(medication);
    setMedicationName(medication.name);
    setMedicationDosage(medication.dosage || '');
    setShowDialog(true);
  };

  const handleDelete = (medication: Medication) => {
    setMedicationToDelete(medication);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (medicationToDelete) {
      setMedications(medications.filter((m) => m.id !== medicationToDelete.id));
      setMedicationToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const handleSave = () => {
    if (medicationName.trim()) {
      // BR-021: Verificar se o nome já existe (único por usuário)
      const duplicateMedication = medications.find(
        (m) => 
          m.name.toLowerCase() === medicationName.trim().toLowerCase() &&
          m.id !== editingMedication?.id
      );
      
      if (duplicateMedication) {
        console.error('Medicação já cadastrada');
        return;
      }

      // BR-022: Dosagem é opcional, máximo 100 caracteres
      if (medicationDosage.length > 100) {
        console.error('Dosagem excede 100 caracteres');
        return;
      }

      if (editingMedication) {
        // Editar medicação existente
        setMedications(
          medications.map((m) =>
            m.id === editingMedication.id 
              ? { ...m, name: medicationName.trim(), dosage: medicationDosage.trim() || undefined } 
              : m
          )
        );
      } else {
        // Adicionar nova medicação
        const newMedication: Medication = {
          id: Date.now().toString(),
          name: medicationName.trim(),
          dosage: medicationDosage.trim() || undefined,
          usageCount: 0,
        };
        setMedications([...medications, newMedication]);
      }
      setShowDialog(false);
      setMedicationName('');
      setMedicationDosage('');
      setEditingMedication(null);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setMedicationName('');
    setMedicationDosage('');
    setEditingMedication(null);
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
                      <p className="text-[#333333]">{medication.name}</p>
                      {medication.dosage && (
                        <span className="text-[#7F8C8D]">({medication.dosage})</span>
                      )}
                    </div>
                    <p className="text-[#7F8C8D]">
                      Usada em {medication.usageCount}{' '}
                      {medication.usageCount === 1 ? 'episódio' : 'episódios'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(medication)}
                      className="text-[#7F8C8D] hover:text-[#6C63FF] hover:bg-[#F5F5F5]"
                      aria-label={`Editar ${medication.name}`}
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(medication)}
                      className="text-[#7F8C8D] hover:text-[#E74C3C] hover:bg-[#FEE]"
                      aria-label={`Deletar ${medication.name}`}
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
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingMedication ? 'Editar Medicação' : 'Nova Medicação'}
            </DialogTitle>
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
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!medicationName.trim()}
              className="bg-[#6C63FF] hover:bg-[#5850E6]"
            >
              {editingMedication ? 'Salvar' : 'Adicionar'}
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
              Tem certeza que deseja excluir a medicação "{medicationToDelete?.name}"?
              {medicationToDelete && medicationToDelete.usageCount > 0 && (
                <span className="block mt-2 text-[#E67E22]">
                  Esta medicação está sendo usada em {medicationToDelete.usageCount}{' '}
                  {medicationToDelete.usageCount === 1 ? 'episódio' : 'episódios'}.
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