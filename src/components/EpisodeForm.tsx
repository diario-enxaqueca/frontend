import { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowLeft, X, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

// Schema de validação
const episodeSchema = z.object({
  date: z.date({
    required_error: 'Data é obrigatória',
  }).refine(
    (date) => date <= new Date(),
    { message: 'Data não pode ser futura' } // BR-008
  ),
  intensity: z.number().min(0, 'Intensidade mínima é 0').max(10, 'Intensidade máxima é 10'), // BR-009
  duration: z.number().min(0, 'Duração não pode ser negativa').optional(), // BR-010
  triggers: z.array(z.string()),
  medications: z.array(z.string()),
  notes: z.string().max(500, 'Observações excedem 500 caracteres').optional(), // BR-013
});

type EpisodeFormData = z.infer<typeof episodeSchema>;

interface EpisodeFormProps {
  episodeId?: string | null;
  onBack?: () => void;
}

export function EpisodeForm({ episodeId, onBack }: EpisodeFormProps) {
  const [intensity, setIntensity] = useState(5);
  const [customTriggers, setCustomTriggers] = useState<string[]>([]);
  const [customMedications, setCustomMedications] = useState<string[]>([]);
  const [showTriggerDialog, setShowTriggerDialog] = useState(false);
  const [showMedicationDialog, setShowMedicationDialog] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [newMedication, setNewMedication] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<EpisodeFormData>({
    resolver: zodResolver(episodeSchema),
    defaultValues: {
      date: new Date(),
      intensity: 5,
      triggers: [],
      medications: [],
      notes: '',
    },
    mode: 'onChange',
  });

  const selectedDate = watch('date');
  const selectedTriggers = watch('triggers') || [];
  const selectedMedications = watch('medications') || [];
  const notes = watch('notes') || '';

  const defaultTriggers = [
    'Estresse',
    'Falta de sono',
    'Chocolate',
    'Café',
    'Luz forte',
  ];

  const defaultMedications = ['Paracetamol', 'Ibuprofeno'];

  const allTriggers = [...defaultTriggers, ...customTriggers];
  const allMedications = [...defaultMedications, ...customMedications];

  const getIntensityColor = (value: number) => {
    const percentage = value / 10;
    if (percentage <= 0.3) return '#27AE60';
    if (percentage <= 0.6) return '#F39C12';
    if (percentage <= 0.8) return '#E67E22';
    return '#E74C3C';
  };

  const handleAddTrigger = () => {
    if (newTrigger.trim() && !allTriggers.includes(newTrigger.trim())) {
      setCustomTriggers([...customTriggers, newTrigger.trim()]);
      setNewTrigger('');
      setShowTriggerDialog(false);
    }
  };

  const handleAddMedication = () => {
    if (newMedication.trim() && !allMedications.includes(newMedication.trim())) {
      setCustomMedications([...customMedications, newMedication.trim()]);
      setNewMedication('');
      setShowMedicationDialog(false);
    }
  };

  const toggleTrigger = (trigger: string) => {
    const current = selectedTriggers;
    const updated = current.includes(trigger)
      ? current.filter((t) => t !== trigger)
      : [...current, trigger];
    setValue('triggers', updated, { shouldValidate: true });
  };

  const toggleMedication = (medication: string) => {
    const current = selectedMedications;
    const updated = current.includes(medication)
      ? current.filter((m) => m !== medication)
      : [...current, medication];
    setValue('medications', updated, { shouldValidate: true });
  };

  const onSubmit = (data: EpisodeFormData) => {
    console.log('Episódio salvo:', data);
    // Aqui você implementaria a lógica de salvar
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      console.log('Voltar');
    }
  };

  const handleCancel = () => {
    console.log('Cancelar');
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
            <h1 className="text-[#333333]">Novo Episódio</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              aria-label="Cancelar"
            >
              <X className="w-5 h-5 text-[#717182]" />
            </Button>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Data do Episódio */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Label htmlFor="date" className="text-[#333333] mb-3 block">
              📅 Data do Episódio <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-12 border-[#BDC3C7] hover:border-[#6C63FF]"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-[#717182]" />
                  {selectedDate ? (
                    format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                  ) : (
                    <span className="text-[#717182]">Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setValue('date', date, { shouldValidate: true })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-red-500 mt-2">{errors.date.message}</p>
            )}
          </div>

          {/* Intensidade */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Label className="text-[#333333] mb-3 block">
              📊 Intensidade da Dor <span className="text-red-500">*</span>{' '}
              <span className="text-[#717182]">(0 = leve, 10 = extrema)</span>
            </Label>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#717182]">0</span>
                <span
                  className="px-4 py-2 rounded-lg"
                  style={{
                    backgroundColor: getIntensityColor(intensity),
                    color: 'white',
                  }}
                >
                  {intensity}
                </span>
                <span className="text-[#717182]">10</span>
              </div>
              <Slider
                value={[intensity]}
                onValueChange={(value) => {
                  setIntensity(value[0]);
                  setValue('intensity', value[0], { shouldValidate: true });
                }}
                max={10}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Duração */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Label htmlFor="duration" className="text-[#333333] mb-3 block">
              ⏱️ Duração (em minutos)
            </Label>
            <Input
              id="duration"
              type="number"
              min="0"
              placeholder="Ex: 120"
              {...register('duration', { valueAsNumber: true })}
              className="h-12 border-[#BDC3C7] focus:border-[#6C63FF]"
            />
          </div>

          {/* Gatilhos */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Label className="text-[#333333] mb-3 block">🔥 Gatilhos</Label>
            <div className="space-y-3 mb-4">
              {allTriggers.map((trigger) => (
                <div key={trigger} className="flex items-center space-x-3">
                  <Checkbox
                    id={`trigger-${trigger}`}
                    checked={selectedTriggers.includes(trigger)}
                    onCheckedChange={() => toggleTrigger(trigger)}
                  />
                  <label
                    htmlFor={`trigger-${trigger}`}
                    className="text-[#333333] cursor-pointer flex-1"
                  >
                    {trigger}
                  </label>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTriggerDialog(true)}
              className="w-full border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo gatilho
            </Button>
          </div>

          {/* Medicações */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Label className="text-[#333333] mb-3 block">💊 Medicações</Label>
            <div className="space-y-3 mb-4">
              {allMedications.map((medication) => (
                <div key={medication} className="flex items-center space-x-3">
                  <Checkbox
                    id={`medication-${medication}`}
                    checked={selectedMedications.includes(medication)}
                    onCheckedChange={() => toggleMedication(medication)}
                  />
                  <label
                    htmlFor={`medication-${medication}`}
                    className="text-[#333333] cursor-pointer flex-1"
                  >
                    {medication}
                  </label>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMedicationDialog(true)}
              className="w-full border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova medicação
            </Button>
          </div>

          {/* Observações */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Label htmlFor="notes" className="text-[#333333] mb-3 block">
              📝 Observações
            </Label>
            <Textarea
              id="notes"
              placeholder="Digite aqui observações adicionais sobre o episódio..."
              {...register('notes')}
              className="min-h-32 border-[#BDC3C7] focus:border-[#6C63FF] resize-none"
              maxLength={500}
            />
            <div className="flex justify-end mt-2">
              <span className="text-[#717182]">
                {notes.length}/500 caracteres
              </span>
            </div>
            {errors.notes && (
              <p className="text-red-500 mt-2">{errors.notes.message}</p>
            )}
          </div>

          {/* Botão Submit */}
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full h-14 bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            SALVAR EPISÓDIO
          </Button>
        </form>
      </main>

      {/* Dialog para Novo Gatilho */}
      <Dialog open={showTriggerDialog} onOpenChange={setShowTriggerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Gatilho</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-trigger" className="mb-2 block">
              Nome do gatilho
            </Label>
            <Input
              id="new-trigger"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.target.value)}
              placeholder="Ex: Vinho tinto"
              className="h-12"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTrigger();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTriggerDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddTrigger}
              className="bg-[#6C63FF] hover:bg-[#5850E6]"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para Nova Medicação */}
      <Dialog open={showMedicationDialog} onOpenChange={setShowMedicationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Medicação</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-medication" className="mb-2 block">
              Nome da medicação
            </Label>
            <Input
              id="new-medication"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              placeholder="Ex: Aspirina"
              className="h-12"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddMedication();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMedicationDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddMedication}
              className="bg-[#6C63FF] hover:bg-[#5850E6]"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}