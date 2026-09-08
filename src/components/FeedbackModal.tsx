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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              ¡Aguyjevete!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Tu comentario ha sido enviado y guardado en Firebase para el administrador.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="text-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200 dark:border-blue-800 mb-1.5">
                <MessageSquare className="w-3 h-3" /> Comentarios Post-Partida
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                ¿Qué te pareció la partida?
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tus opiniones ayudan al administrador a mejorar las preguntas y la Fase 2.
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
                      className="p-1 text-amber-400 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          isFilled ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
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
                    className={`text-[10px] font-medium px-2 py-1 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Visible en el panel privado del administrador</span>
                <span>{comment.length}/300</span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-500 font-semibold">{errorMsg}</p>
            )}

            {/* Botón de Enviar */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-blue-700 text-white font-bold text-xs tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Guardando en Firebase...' : 'Enviar al Administrador'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
