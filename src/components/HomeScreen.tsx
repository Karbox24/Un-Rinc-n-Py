import React, { useState } from 'react';
import { Sparkles, Play, Shield, Award, CheckCircle2, Flame, BookOpen, Shuffle } from 'lucide-react';
import { AVATAR_OPTIONS } from '../lib/utils';

interface HomeScreenProps {
  nickname: string;
  avatar: string;
  questionMode: 'test10' | 'all';
  onStartGame: (nick: string, avatar: string, mode: 'test10' | 'all') => void;
  onOpenAdmin: () => void;
  onOpenRanking: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  nickname: initialNick,
  avatar: initialAvatar,
  questionMode: initialMode,
  onStartGame,
  onOpenAdmin,
  onOpenRanking,
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Columna Izquierda: Información Cultural y Presentación (Visible en Móvil y Desktop) */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Banner de Bienvenida Cultural */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/60 p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-36 h-36 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-6 -mb-6 w-36 h-36 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> ¡Mba'éichapa!
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Un Rincón Py
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Desafiá tus conocimientos sobre los 7 mitos guaraníes, comidas típicas, tradiciones patrias, geografía e historia de nuestra tierra.
              </p>
            </div>
            <div className="text-5xl filter drop-shadow-md animate-bounce hidden sm:block">
              🧉
            </div>
          </div>

          {/* Indicador de Aleatoriedad y Persistencia */}
          <div className="mt-5 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Firebase Firestore Conectado
            </span>
            <span className="flex items-center gap-1 text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 text-[11px]">
              <Shuffle className="w-3 h-3" /> Preguntas 100% Aleatorias
            </span>
          </div>
        </div>

        {/* Ejes Temáticos Destacados */}
        <div className="bg-slate-900/70 backdrop-blur-sm rounded-3xl p-5 border border-slate-800 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Ejes Temáticos de la Trivia
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-200 flex items-center gap-2">
              <span>👹</span> <span className="font-semibold truncate">7 Mitos Guaraníes</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-200 flex items-center gap-2">
              <span>🍲</span> <span className="font-semibold truncate">Comidas Típicas</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 flex items-center gap-2">
              <span>🧉</span> <span className="font-semibold truncate">Tereré & Pohã Ñana</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200 flex items-center gap-2">
              <span>📜</span> <span className="font-semibold truncate">Idioma Guaraní</span>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-200 flex items-center gap-2">
              <span>🏛️</span> <span className="font-semibold truncate">Historia & Héroes</span>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/40 text-teal-200 flex items-center gap-2">
              <span>🗺️</span> <span className="font-semibold truncate">Geografía & Cerros</span>
            </div>
          </div>
        </div>

        {/* Acceso Rápido a Ranking y Admin en la columna lateral */}
        <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
          <button
            type="button"
            onClick={onOpenRanking}
            className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Award className="w-4 h-4 text-amber-500" />
            Ranking Global
          </button>
          <button
            type="button"
            onClick={onOpenAdmin}
            className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Shield className="w-4 h-4 text-red-400" />
            Panel Admin
          </button>
        </div>
      </div>

      {/* Columna Derecha: Formulario de Inicio y Configuración de Partida */}
      <div className="lg:col-span-7">
        <form onSubmit={handleStart} className="flex flex-col gap-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="nickname" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Tu Apodo o Nombre de Jugador
              </label>
              <span className="text-[11px] text-slate-500">Obligatorio</span>
            </div>
            <div className="relative">
              <input
                id="nickname"
                type="text"
                value={nick}
                onChange={(e) => {
                  setNick(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Ej: Katu, Mburuvicha, Dani, Sol..."
                maxLength={25}
                className="w-full px-4 py-3.5 rounded-2xl border border-slate-700 bg-slate-800/70 text-white font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all text-sm sm:text-base"
              />
              {nick && (
                <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-mono">
                  {nick.length}/25
                </span>
              )}
            </div>
            {errorMsg && (
              <p className="text-red-400 text-xs font-semibold mt-2 flex items-center gap-1">
                ⚠️ {errorMsg}
              </p>
            )}
          </div>

          {/* Selector de Avatar Típico */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Elegí tu Emblema Cultural
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {AVATAR_OPTIONS.find((a) => a.id === selectedAvatar)?.label}
              </span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-2.5">
              {AVATAR_OPTIONS.map((item) => {
                const isSelected = selectedAvatar === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setSelectedAvatar(item.id)}
                    className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border transition-all text-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-950/60 shadow-md scale-105 ring-2 ring-blue-500'
                        : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{item.icon}</span>
                    <span className="text-[10px] font-semibold text-slate-300 truncate w-full">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selección de Modo de Preguntas */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Modalidad de la Partida
              </label>
              <span className="text-xs text-blue-400 font-semibold flex items-center gap-1">
                <Shuffle className="w-3 h-3" /> Orden y opciones 100% aleatorias
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('test10')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'test10'
                    ? 'border-red-500 bg-red-950/40 text-white ring-2 ring-red-500'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">10 Preguntas</span>
                  <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full">Recomendado</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  10 preguntas tomadas al azar del banco completo de 60+ preguntas. Nunca se repite la misma partida.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode('all')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  mode === 'all'
                    ? 'border-blue-500 bg-blue-950/40 text-white ring-2 ring-blue-500'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">Banco Completo</span>
                  <span className="text-[10px] bg-blue-600/60 text-blue-200 font-bold px-2 py-0.5 rounded-full">60+ Desafíos</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Ronda extensa con todas las preguntas barajadas una tras otra.
                </p>
              </button>
            </div>
          </div>

          {/* Botón Principal de Inicio */}
          <button
            type="submit"
            className="mt-2 w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-red-600 via-red-700 to-blue-700 text-white font-extrabold text-base tracking-wide shadow-xl shadow-red-600/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            Comenzar Trivia Guaraní
          </button>
        </form>
      </div>
    </div>
  );
};
