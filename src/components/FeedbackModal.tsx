import React, { useState } from 'react';
import { Star, X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { submitFeedback } from '../lib/firebase';
import { PlayerFeedback } from '../types/trivia';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  nickname: string;
  score: number;
  gameSessionId?: string | null;
  onFeedbackSaved: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  nickname,
  score,
  gameSessionId,
  onFeedbackSaved,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const quickTags = [
    '¡Iporãiterei! (Excelente)',
    'Mitos fascinantes',
    'Preguntas desafiantes',
    'Aprendí mucho',
    'Agregar más comida típica',
    '¡Listo para la APK!',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const fullComment = selectedTag
      ? `${selectedTag}${comment.trim() ? ` — ${comment.trim()}` : ''}`
      : comment.trim() || 'Partida calificada con éxito.';

    const payload: Omit<PlayerFeedback, 'id'> = {
      nickname: nickname || 'Jugador Guaraní',
      score,
      rating,
      comment: fullComment,
      createdAt: new Date().toISOString(),
      gameSessionId: gameSessionId || undefined,
    };

    try {
      await submitFeedback(payload);
      setIsSuccess(true);
      onFeedbackSaved();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error enviando feedback:', err);
      setErrorMsg('No se pudo guardar el comentario. Intentá de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-[16px] border border-[#EADCCF] shadow-lg overflow-hidden text-[#1A1A1A]">
        {/* Borde superior de 4px con colores de la bandera de Paraguay */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-6">
          {/* Botón cerrar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-[#757575] hover:text-[#1A1A1A] rounded-xl hover:bg-[#FFFBF5] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#8B1A1A]">
                ¡Aguyjevete!
              </h3>
              <p className="text-xs text-[#757575] mt-1">
                Tu comentario ha sido enviado y guardado en Firebase para el administrador.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="text-center">
                <h2 className="text-lg font-bold text-[#8B1A1A]">
                  ¿Qué te pareció la partida?
                </h2>
                <p className="text-xs text-[#757575] mt-0.5">
                  Tus opiniones ayudan al administrador a mejorar las preguntas de la trivia.
                </p>
              </div>

              {/* Estrellas de puntuación */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = (hoverRating || rating) >= starVal;
                    return (
                      <button
                        type="button"
                        key={starVal}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(starVal)}
                        className="p-1 text-[#1A1A1A] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            isFilled ? 'fill-amber-400 text-amber-400' : 'text-[#E0E0E0]'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-semibold text-[#8B1A1A]">
                  {rating === 5 && '¡Iporãiterei! (Excelente)'}
                  {rating === 4 && '¡Iporã! (Muy buena)'}
                  {rating === 3 && 'Buena / Aceptable'}
                  {rating === 2 && 'Regular / A mejorar'}
                  {rating === 1 && 'Necesita ajustes'}
                </span>
              </div>

              {/* Etiquetas rápidas sugeridas */}
              <div className="flex flex-wrap gap-1.5">
                {quickTags.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => setSelectedTag(isSelected ? '' : tag)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-[10px] border transition-colors cursor-pointer ${
                        isSelected
                          ? 'border-[#FFB347] bg-[#FFF0DB] text-[#8B1A1A] font-semibold'
                          : 'border-[#EADCCF] bg-[#FFFBF5] text-[#757575] hover:bg-[#FFF0DB]/40 hover:text-[#1A1A1A]'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {/* Campo de texto para sugerencia */}
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Escribí una sugerencia de mito, pregunta o mejora para el administrador..."
                  rows={3}
                  maxLength={300}
                  className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#EADCCF] bg-[#FFFBF5] text-[#1A1A1A] text-xs placeholder-[#9E9E9E] focus:outline-none focus:border-[#1A3A5F] focus:bg-white transition-colors resize-none"
                />
                <div className="flex justify-between text-[10px] text-[#9E9E9E] mt-1">
                  <span>Visible en el panel privado de administración</span>
                  <span>{comment.length}/300</span>
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-600 font-semibold">{errorMsg}</p>
              )}

              {/* Botón de Enviar: #1A3A5F */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-[52px] rounded-[16px] bg-[#1A3A5F] hover:bg-[#122A45] text-white font-semibold text-[15px] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Guardando en Firebase...' : 'Enviar al Administrador'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
