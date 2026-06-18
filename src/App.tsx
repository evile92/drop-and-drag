import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  useDraggable,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Shuffle, 
  Sparkles
} from 'lucide-react';

interface CardPair {
  id: string;
  question: string;
  answer: string;
  svg: React.ReactNode;
}

const CLASSROOM_PAIRS: CardPair[] = [
  {
    id: 'marrakech',
    question: 'Dans quelle ville se trouve la place Jemaa el-Fna ?',
    answer: 'Marrakech',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#fef2e8" />
        <circle cx="50" cy="50" r="28" fill="#fdba74" opacity="0.4" />
        <path d="M 40 80 L 40 32 L 60 32 L 60 80 Z" fill="#ea580c" />
        <path d="M 45 32 L 50 18 L 55 32 Z" fill="#c2410c" />
        <rect x="47" y="42" width="6" height="12" rx="2" fill="#ffedd5" />
        <circle cx="50" cy="18" r="2.5" fill="#fbbf24" />
        <text x="50" y="92" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#7c2d12" textAnchor="middle">Marrakech</text>
      </svg>
    )
  },
  {
    id: 'hassan2',
    question: 'Dans quel pays se trouve la mosquée Hassan II ?',
    answer: 'Maroc',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#f0fdf4" />
        <path d="M 10 90 Q 50 82 90 90 L 90 95 L 10 95 Z" fill="#3b82f6" />
        <rect x="36" y="42" width="28" height="43" fill="#15803d" />
        <rect x="45" y="18" width="10" height="24" fill="#16a34a" />
        <polygon points="40,18 50,5 60,18" fill="#14532d" />
        <circle cx="50" cy="52" r="7" fill="#fef08a" />
        <text x="50" y="93" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#14532d" textAnchor="middle">Maroc</text>
      </svg>
    )
  },
  {
    id: 'rabat',
    question: 'Quelle ville est la capitale du Maroc ?',
    answer: 'Rabat',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#fff7ed" />
        <rect x="41" y="25" width="18" height="60" fill="#b45309" />
        <path d="M 36 25 L 64 25 L 59 16 L 41 16 Z" fill="#78350f" />
        <rect x="46" y="34" width="8" height="14" fill="#fef3c7" />
        <rect x="46" y="54" width="8" height="14" fill="#fef3c7" />
        <text x="50" y="94" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#78350f" textAnchor="middle">Rabat</text>
      </svg>
    )
  },
  {
    id: 'chefchaouen',
    question: 'Dans quelle ville peut-on visiter la médina bleue du Maroc ?',
    answer: 'Chefchaouen',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#eff6ff" />
        <path d="M 20 85 L 20 42 Q 50 18 80 42 L 80 85 Z" fill="#3b82f6" />
        <path d="M 30 85 L 30 52 Q 50 32 70 52 L 70 85 Z" fill="#1d4ed8" />
        <rect x="46" y="66" width="8" height="19" fill="#60a5fa" rx="1" />
        <text x="50" y="95" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#1e3a8a" textAnchor="middle">Chefchaouen</text>
      </svg>
    )
  },
  {
    id: 'tajine',
    question: 'Dans quel pays est originaire le tajine ?',
    answer: 'Maroc',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#fffbeb" />
        <ellipse cx="50" cy="74" rx="34" ry="11" fill="#b45309" />
        <path d="M 26 69 Q 50 22 50 17 Q 50 22 74 69 Z" fill="#d97706" />
        <circle cx="50" cy="17" r="4.5" fill="#78350f" />
        <text x="50" y="95" fontFamily="sans-serif" fontSize="10" fontWeight="bold" fill="#78350f" textAnchor="middle">Tajine</text>
      </svg>
    )
  },
  {
    id: 'nouakchott_mosque',
    question: 'Dans quelle ville se trouve la grande mosquée de Nouakchott ?',
    answer: 'Nouakchott',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#f0fdf4" />
        <rect x="26" y="48" width="48" height="36" fill="#16a34a" />
        <path d="M 36 48 Q 50 26 64 48 Z" fill="#15803d" />
        <circle cx="50" cy="30" r="3.5" fill="#fbbf24" />
        <text x="50" y="94" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#14532d" textAnchor="middle">Nouk. Mosque</text>
      </svg>
    )
  },
  {
    id: 'banc_arguin',
    question: "Dans quel pays se trouve le parc national du Banc d'Arguin ?",
    answer: 'Mauritanie',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#ecfdf5" />
        <path d="M 10 90 Q 50 68 90 90 Z" fill="#fef08a" />
        <path d="M 10 90 Q 50 82 90 90 L 90 98 L 10 98 Z" fill="#06b6d4" />
        <text x="50" y="94" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#065f46" textAnchor="middle">Banc d'Arguin</text>
      </svg>
    )
  },
  {
    id: 'capitale_mauritanie',
    question: 'Quelle ville est la capitale de la Mauritanie ?',
    answer: 'Nouakchott',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#f0fdfa" />
        <rect x="22" y="44" width="24" height="40" fill="#0d9488" />
        <rect x="54" y="32" width="24" height="52" fill="#115e59" />
        <circle cx="68" cy="19" r="4" fill="#fde047" />
        <text x="50" y="94" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#115e59" textAnchor="middle">Nouakchott</text>
      </svg>
    )
  },
  {
    id: 'chinguetti',
    question: "Dans quelle ville peut-on visiter l'ancienne cité de Chinguetti ?",
    answer: 'Chinguetti',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#fffbeb" />
        <path d="M 12 85 L 88 85 L 78 46 L 22 46 Z" fill="#d97706" />
        <rect x="43" y="16" width="14" height="30" fill="#b45309" />
        <path d="M 40 16 L 50 3 L 60 16 Z" fill="#78350f" />
        <text x="50" y="94" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#78350f" textAnchor="middle">Chinguetti</text>
      </svg>
    )
  },
  {
    id: 'mechoui',
    question: 'Dans quel pays est originaire le méchoui mauritanien ?',
    answer: 'Mauritanie',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full select-none pointer-events-none">
        <rect x="0" y="0" width="100" height="100" fill="#fafaf9" />
        <ellipse cx="50" cy="74" rx="36" ry="14" fill="#e7e5e4" stroke="#a8a29e" strokeWidth="1.5" />
        <path d="M 26 69 Q 50 46 74 69" fill="#d97706" stroke="#78350f" strokeWidth="2.5" />
        <text x="50" y="95" fontFamily="sans-serif" fontSize="9" fontWeight="bold" fill="#44403c" textAnchor="middle">Méchoui</text>
      </svg>
    )
  }
];

interface CardPosition {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

const generatePositions = (isMobile: boolean): { images: CardPosition[]; questions: CardPosition[] } => {
  const count = CLASSROOM_PAIRS.length;
  const images: CardPosition[] = [];
  const questions: CardPosition[] = [];
  const rowCount = Math.ceil(count / 2);
  const rowHeight = 88 / rowCount;

  for (let i = 0; i < count; i++) {
    const rowIndex = Math.floor(i / 2);
    
    const imgMinX = 5;
    const imgMaxX = isMobile ? 18 : 30;
    const imgX = imgMinX + Math.random() * (imgMaxX - imgMinX);
    const imgY = 4 + rowIndex * rowHeight + (Math.random() * 4);
    const imgRotation = Math.random() * 16 - 8;

    const qMinX = isMobile ? 44 : 52;
    const qMaxX = isMobile ? 55 : 68;
    const qX = qMinX + Math.random() * (qMaxX - qMinX);
    const qY = 4 + rowIndex * rowHeight + (Math.random() * 4);
    const qRotation = Math.random() * 10 - 5;

    images.push({ id: `img-${CLASSROOM_PAIRS[i].id}`, x: imgX, y: imgY, rotation: imgRotation });
    questions.push({ id: `q-${CLASSROOM_PAIRS[i].id}`, x: qX, y: qY, rotation: qRotation });
  }

  const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);
  return { images: shuffle(images), questions: shuffle(questions) };
};

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playTape() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.linearRampToValueAtTime(350, now + 0.14);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playBuzz() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.18);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }
}

const sounds = new SoundManager();

function NotebookPaperScrap({ question, isMatched = false }: { question: string; isMatched?: boolean }) {
  return (
    <div className="relative w-36 h-20 md:w-48 md:h-24 p-2 md:p-3 filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.15)] select-none transition-transform duration-300">
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
        <path d="M 5,6 L 194,3 Q 197,35 195,94 L 6,97 Q 2,45 5,6 Z" fill="#fafaf3" stroke="#e3e1d5" strokeWidth="1.5" />
        <line x1="8" y1="28" x2="192" y2="28" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="8" y1="50" x2="192" y2="50" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="8" y1="72" x2="192" y2="72" stroke="#cbd5e1" strokeWidth="1" />
        <line x1="28" y1="5" x2="28" y2="95" stroke="#fca5a5" strokeWidth="1.2" />
      </svg>
      <div className="absolute inset-0 top-1.5 bottom-1.5 left-8 right-3 flex items-center justify-center">
        <p className="font-serif italic font-bold text-[9px] md:text-[11.5px] leading-tight text-neutral-800 text-center select-none pointer-events-none">
          {question}
        </p>
      </div>
      {!isMatched && (
        <div className="absolute -top-1.5 left-[15%] -translate-x-1/2 z-20 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="drop-shadow-sm">
            <path d="M12 2C10.5 2 9 3.5 9 5c0 1.2.6 2.2 1.5 2.8V12c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5h3c1.5 0 2.5-1 2.5-2.5S14.5 12 13 12V7.8c.9-.6 1.5-1.6 1.5-2.8 0-1.5-1.5-3-3-3z" fill="#d97706" />
          </svg>
        </div>
      )}
    </div>
  );
}

function TransparentTape() {
  return (
    <div className="absolute top-[41%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 md:w-32 h-6 md:h-8 z-30 pointer-events-none select-none opacity-80 rotate-[-5deg] overflow-hidden">
      <svg viewBox="0 0 100 30" className="w-full h-full drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.14)]">
        <path d="M 0 4 L 3 1 L 6 4 L 9 1 L 12 4 L 15 1 L 18 4 L 21 1 L 24 4 L 27 1 L 30 4 L 33 1 L 36 4 L 39 1 L 42 4 L 45 1 L 48 4 L 51 1 L 54 4 L 57 1 L 60 4 L 63 1 L 66 4 L 69 1 L 72 4 L 75 1 L 78 4 L 81 1 L 84 4 L 87 1 L 90 4 L 93 1 L 96 4 L 100 1 L 100 26 L 96 29 L 93 26 L 90 29 L 87 26 L 84 29 L 81 26 L 78 29 L 75 26 L 72 29 L 69 26 L 66 29 L 63 26 L 60 29 L 57 26 L 54 29 L 51 26 L 48 29 L 45 26 L 42 29 L 39 26 L 36 29 L 33 26 L 30 29 L 27 26 L 24 29 L 21 26 L 18 29 L 15 26 L 12 29 L 9 26 L 6 29 L 3 26 L 0 29 Z" fill="rgba(255, 255, 255, 0.35)" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

function DraggableCard({ id, x, y, rotation, isMatched, children }: { id: string; x: number; y: number; rotation: number; isMatched: boolean; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id, disabled: isMatched });
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.06) rotate(${rotation + 4}deg)` : `rotate(${rotation}deg)`,
    touchAction: 'none',
    zIndex: isDragging ? 50 : 10,
    transition: transform ? 'transform 0.02s ease-out' : 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
    visibility: isMatched ? 'hidden' : 'visible',
    opacity: isMatched ? 0 : 1,
  };
  return <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="select-none cursor-grab active:cursor-grabbing">{children}</div>;
}

export default function App() {
  const [images, setImages] = useState<CardPosition[]>([]);
  const [questions, setQuestions] = useState<CardPosition[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongMatches, setWrongMatches] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const { images: imgPos, questions: qPos } = generatePositions(isMobile);
    setImages(imgPos);
    setQuestions(qPos);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  useEffect(() => { sounds.enabled = !isMuted; }, [isMuted]);
  const handleDragStart = (event: DragStartEvent) => { setActiveId(event.active.id.toString()); sounds.playPop(); };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const id = active.id.toString();
    setActiveId(null);
    if (!boardRef.current) return;
    const rect = boardRef.current.getBoundingClientRect();
    const deltaXPercent = (delta.x / rect.width) * 100;
    const deltaYPercent = (delta.y / rect.height) * 100;
    let updatedX = 0, updatedY = 0;

    if (id.startsWith('img-')) {
      setImages(prev => prev.map(img => {
        if (img.id === id) {
          updatedX = Math.max(0, Math.min(88, img.x + deltaXPercent));
          updatedY = Math.max(0, Math.min(88, img.y + deltaYPercent));
          return { ...img, x: updatedX, y: updatedY };
        }
        return img;
      }));
      const pairId = id.replace('img-', '');
      const matchingQ = questions.find(q => q.id === `q-${pairId}`);
      if (matchingQ && !matchedIds.includes(pairId)) evaluateMatch(pairId, updatedX, updatedY, matchingQ.x, matchingQ.y);
    } else if (id.startsWith('q-')) {
      setQuestions(prev => prev.map(q => {
        if (q.id === id) {
          updatedX = Math.max(0, Math.min(88, q.x + deltaXPercent));
          updatedY = Math.max(0, Math.min(88, q.y + deltaYPercent));
          return { ...q, x: updatedX, y: updatedY };
        }
        return q;
      }));
      const pairId = id.replace('q-', '');
      const matchingImg = images.find(img => img.id === `img-${pairId}`);
      if (matchingImg && !matchedIds.includes(pairId)) evaluateMatch(pairId, matchingImg.x, matchingImg.y, updatedX, updatedY);
    }
  };

  const evaluateMatch = (pairId: string, imgX: number, imgY: number, qX: number, qY: number) => {
    const dx = (imgX + 6) - (qX + 8);
    const dy = (imgY + 6) - (qY + 5);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 18) {
      sounds.playTape();
      setMatchedIds(prev => [...prev, pairId]);
    } else {
      const otherImages = CLASSROOM_PAIRS.filter(p => p.id !== pairId);
      let isNearWrong = false;
      for (const other of otherImages) {
        const otherImg = images.find(img => img.id === `img-${other.id}`);
        if (otherImg) {
          const wdx = (otherImg.x + 6) - (qX + 8);
          const wdy = (otherImg.y + 6) - (qY + 5);
          if (Math.sqrt(wdx * wdx + wdy * wdy) < 15) {
            isNearWrong = true;
            setWrongMatches(prev => [...prev, `q-${pairId}`, `img-${other.id}`]);
            setTimeout(() => { setWrongMatches(prev => prev.filter(id => id !== `q-${pairId}` && id !== `img-${other.id}`)); }, 500);
            break;
          }
        }
      }
      if (isNearWrong) sounds.playBuzz(); else sounds.playPop();
    }
  };

  const handleShuffle = () => {
    sounds.playPop();
    const isMobile = window.innerWidth < 768;
    const { images: imgPos, questions: qPos } = generatePositions(isMobile);
    setImages(prev => prev.map(img => matchedIds.includes(img.id.replace('img-', '')) ? img : imgPos.find(i => i.id === img.id) || img));
    setQuestions(prev => prev.map(q => matchedIds.includes(q.id.replace('q-', '')) ? q : qPos.find(i => i.id === q.id) || q));
  };

  const handleReset = () => {
    sounds.playPop(); setMatchedIds([]); setWrongMatches([]);
    const isMobile = window.innerWidth < 768;
    const { images: imgPos, questions: qPos } = generatePositions(isMobile);
    setImages(imgPos); setQuestions(qPos);
  };

  return (
    <div className="w-full min-h-screen bg-neutral-900/10 p-2 md:p-6 flex flex-col justify-between items-center font-sans">
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        @keyframes scaleIn { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .cork-texture { background-color: #dfbda0; background-image: radial-gradient(#8c5e3c 1.2px, transparent 1.2px), radial-gradient(#aa7d58 1.2px, transparent 1.2px); background-size: 16px 16px; background-position: 0 0, 8px 8px; }
      `}</style>

      <header className="w-full max-w-6xl bg-white/95 rounded-2xl p-4 mb-4 shadow-lg border border-amber-950/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-amber-800 text-white p-2 rounded-xl"><Sparkles className="w-5 h-5" /></div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-amber-950">Activité de Correspondance • لغز المطابقة</h1>
            <p className="text-xs text-amber-900/70 font-semibold">طابق كل سؤال وقصاصة بالصورة والرمز الصحيح</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-black text-amber-950">COMPLÉTÉ: {matchedIds.length} / {CLASSROOM_PAIRS.length}</div>
          <button onClick={() => setIsMuted(!isMuted)} className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl transition border border-amber-200">{isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}</button>
          <button onClick={handleShuffle} className="p-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl transition flex items-center gap-1 font-bold text-xs"><Shuffle className="w-3.5 h-3.5" /><span className="hidden md:inline">Mélanger</span></button>
          <button onClick={handleReset} className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition flex items-center gap-1 font-bold text-xs"><RotateCcw className="w-3.5 h-3.5" /><span className="hidden sm:inline">Réinitialiser</span></button>
        </div>
      </header>

      <main className="w-full max-w-6xl flex-grow relative">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div ref={boardRef} className="w-full h-[680px] md:h-[780px] rounded-3xl relative overflow-hidden shadow-2xl border-[12px] md:border-[16px] border-amber-950 bg-amber-900 cork-texture select-none">
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_10px_35px_rgba(0,0,0,0.4)] z-40"></div>

            {CLASSROOM_PAIRS.map((pair) => {
              if (!matchedIds.includes(pair.id)) return null;
              const imgPos = images.find(img => img.id === `img-${pair.id}`)!;
              return (
                <div key={`matched-group-${pair.id}`} className="absolute z-20 animate-[scaleIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]" style={{ left: `${imgPos.x}%`, top: `${imgPos.y - 12}%` }}>
                  <div className="relative flex flex-col items-center">
                    <div className="relative z-10 scale-95 md:scale-100"><NotebookPaperScrap question={pair.question} isMatched={true} /></div>
                    <div className="relative z-0 -mt-[14px] md:-mt-[22px] w-18 h-18 md:w-26 md:h-26 bg-white p-1.5 rounded-lg shadow-md border border-neutral-200">
                      <div className="w-full h-full bg-neutral-100 rounded border border-neutral-200 flex items-center justify-center">{pair.svg}</div>
                    </div>
                    <TransparentTape />
                  </div>
                </div>
              );
            })}

            {questions.map((q) => {
              const pair = CLASSROOM_PAIRS.find((p) => p.id === q.id.replace('q-', ''))!;
              if (matchedIds.includes(pair.id)) return null;
              return (
                <DraggableCard key={q.id} id={q.id} x={q.x} y={q.y} rotation={q.rotation} isMatched={false}>
                  <div className={wrongMatches.includes(q.id) ? 'animate-[shake_0.4s_ease-in-out]' : ''}><NotebookPaperScrap question={pair.question} /></div>
                </DraggableCard>
              );
            })}

            {images.map((img) => {
              const pair = CLASSROOM_PAIRS.find((p) => p.id === img.id.replace('img-', ''))!;
              if (matchedIds.includes(pair.id)) return null;
              return (
                <DraggableCard key={img.id} id={img.id} x={img.x} y={img.y} rotation={img.rotation} isMatched={false}>
                  <div className={`relative w-18 h-18 md:w-26 md:h-26 bg-white p-1.5 rounded-lg shadow-[1.5px_3px_8px_rgba(0,0,0,0.2)] border border-neutral-200/90 hover:shadow-[3px_6px_14px_rgba(0,0,0,0.25)] hover:-translate-y-0.5 transition-all duration-200 ${wrongMatches.includes(img.id) ? 'animate-[shake_0.4s_ease-in-out] border-rose-500' : ''}`}>
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none"><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C10.3 2 9 3.3 9 5c0 1.5.8 2.8 2 3.5V13c-2.2 0-4 1.8-4 4s1.8 4 4 4h2c2.2 0 4-1.8 4-4s-1.8-4-4-4V8.5c1.2-.7 2-2 2-3.5 0-1.7-1.3-3-3-3z" fill="#ef4444" /></svg></div>
                    <div className="w-full h-full bg-neutral-100 rounded border border-neutral-200 overflow-hidden flex items-center justify-center">{pair.svg}</div>
                  </div>
                </DraggableCard>
              );
            })}
          </div>
        </DndContext>
      </main>
    </div>
  );
}
