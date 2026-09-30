import React, { useState } from 'react';
import { Sparkles, Play, Shield, Award, CheckCircle2, Flame, BookOpen, Shuffle, BarChart3, Trophy } from 'lucide-react';
import { AVATAR_OPTIONS } from '../lib/utils';

interface HomeScreenProps {
  nickname: string;
  avatar: string;
  questionMode: 'test10' | 'all';
  personalRecord?: number;
  onStartGame: (nick: string, avatar: string, mode: 'test10' | 'all') => void;
  onOpenAdmin: () => void;
  onOpenRanking: () => void;
  onOpenStats?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  nickname: initialNick,
  avatar: initialAvatar,
  questionMode: initialMode,
  personalRecord = 0,
  onStartGame,
  onOpenAdmin,
  onOpenRanking,
  onOpenStats,
}) => {
  const [nick, setNick] = useState(initialNick);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar || 'terere');
  const [mode, setMode] = useState<'test10' | 'all'>(initialMode);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNick = nick.trim();
    if (!cleanNick) {
      setErrorMsg('Por favor ingresá un apodo para jugar');
      return;
    }
    if (cleanNick.length < 2) {
      setErrorMsg('El apodo debe tener al menos 2 letras');
      return;
    }
    setErrorMsg('');
    onStartGame(cleanNick, selectedAvatar, mode);
  };

  return (
    <div className="w-full max-w-[540px] mx-auto flex flex-col gap-4 py-2">
      {/* Tarjeta de Bienvenida y Perfil con Borde Superior de 4px Bandera Paraguaya */}
      <div className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm text-center">
        {/* Borde superior de 4px con colores de la bandera de Paraguay: rojo #D52B1E, blanco y azul #0038A8 */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFFBF5] border border-[#FFB347]/40 flex items-center justify-center text-3xl mb-3 shadow-2xs">
            🧉
          </div>
          {/* Título: rojo ladrillo #8B1A1A */}
          <h1 className="text-[25px] font-extrabold text-[#8B1A1A] tracking-tight">
            Un Rincón Py
          </h1>
          <p className="text-[14px] text-[#757575] mt-1 max-w-sm mx-auto">
            Trivia de cultura, mitos guaraníes, gastronomía y tradiciones del Paraguay.
          </p>

          {personalRecord > 0 && (
            <div className="mt-4 pt-3 border-t border-[#EADCCF] flex items-center justify-center gap-2 text-xs text-[#757575]">
              <span>Tu récord actual:</span>
              <strong className="text-[#8B1A1A] font-bold">{personalRecord} pts</strong>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Inicio con Borde Superior de 4px Bandera Paraguaya */}
      <form onSubmit={handleStart} className="bg-white border border-[#EADCCF] rounded-[16px] overflow-hidden shadow-sm flex flex-col">
        {/* Borde superior de 4px Bandera de Paraguay */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/2 bg-[#D52B1E]" />
          <div className="w-1/2 bg-[#0038A8]" />
        </div>

        <div className="p-6 flex flex-col gap-5">
          {/* Entrada de Apodo */}
          <div>
            <label htmlFor="nickname" className="block text-xs font-semibold uppercase tracking-wider text-[#757575] mb-2">
              Tu Apodo o Nombre
            </label>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                value={nick}
                onChange={(e) => {
                  setNick(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ej: Katu, Dani, Sol..."
                maxLength={25}
                className="w-full h-12 px-4 rounded-[12px] border border-[#EADCCF] bg-[#FFFBF5] text-[#1A1A1A] text-[16px] placeholder-[#9E9E9E] focus:outline-none focus:border-[#1A3A5F] focus:bg-white transition-colors"
              />
              {nick && (
                <span className="absolute right-3 top-3.5 text-xs text-[#9E9E9E]">
                  {nick.length}/25
                </span>
              )}
            </div>
            {errorMsg && (
              <p className="text-rose-600 text-xs font-medium mt-1.5">
                {errorMsg}
              </p>
            )}
          </div>

          {/* Selector de Avatar / Emblema */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#757575] mb-2">
              Elegí tu Emblema
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVATAR_OPTIONS.map((item) => {
                const isSelected = selectedAvatar === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedAvatar(item.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-[12px] border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFF0DB] border-[#FFB347] font-semibold text-[#8B1A1A] shadow-xs'
                        : 'bg-[#FFFBF5] border-[#EADCCF] text-[#424242] hover:bg-[#FFF0DB]/40'
                    }`}
                  >
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <span className="text-[11px] truncate w-full text-center">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modalidad de Juego */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#757575] mb-2">
              Modalidad
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('test10')}
                className={`p-3 rounded-[12px] border text-left transition-colors cursor-pointer ${
                  mode === 'test10'
                    ? 'border-[#1A3A5F] bg-[#FFF0DB]/60 text-[#1A3A5F]'
                    : 'border-[#EADCCF] bg-[#FFFBF5] hover:bg-[#FFF0DB]/40'
                }`}
              >
                <div className="font-semibold text-xs text-[#1A1A1A]">10 Preguntas</div>
                <div className="text-[11px] text-[#757575] mt-0.5">Partida rápida aleatoria</div>
              </button>

              <button
                type="button"
                onClick={() => setMode('all')}
                className={`p-3 rounded-[12px] border text-left transition-colors cursor-pointer ${
                  mode === 'all'
                    ? 'border-[#1A3A5F] bg-[#FFF0DB]/60 text-[#1A3A5F]'
                    : 'border-[#EADCCF] bg-[#FFFBF5] hover:bg-[#FFF0DB]/40'
                }`}
              >
                <div className="font-semibold text-xs text-[#1A1A1A]">Banco Completo</div>
                <div className="text-[11px] text-[#757575] mt-0.5">60+ Desafíos seguidos</div>
              </button>
            </div>
          </div>

          {/* Botón Principal de Inicio: #1A3A5F con hover #122A45 */}
          <button
            type="submit"
            className="w-full h-[56px] rounded-[16px] bg-[#1A3A5F] hover:bg-[#122A45] text-white text-[18px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <Play className="w-5 h-5 fill-white" />
            Comenzar
          </button>
        </div>
      </form>

      {/* Accesos rápidos secundarios */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onOpenRanking}
          className="h-11 rounded-[12px] border border-[#EADCCF] bg-white hover:bg-[#FFFBF5] text-[#1A1A1A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-[#8B1A1A]" /> Ranking Global
        </button>

        <button
          type="button"
          onClick={onOpenStats || onOpenRanking}
          className="h-11 rounded-[12px] border border-[#EADCCF] bg-white hover:bg-[#FFFBF5] text-[#1A1A1A] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-[#1A3A5F]" /> Mis Estadísticas
        </button>
      </div>
    </div>
  );
};
