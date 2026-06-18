import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  useDraggable,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import confetti from 'canvas-confetti';
import { CLASSROOM_PAIRS } from './data';

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
    <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 md:w-20 h-5 md:h-6 z-30 pointer-events-none select-none opacity-90 rotate-[-4deg] overflow-hidden">
      <svg viewBox="0 0 100 30" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
        <path d="M 0 4 L 3 1 L 6 4 L 9 1 L 12 4 L 15 1 L 18 4 L 21 1 L 24 4 L 27 1 L 30 4 L 33 1 L 36 4 L 39 1 L 42 4 L 45 1 L 48 4 L 51 1 L 54 4 L 57 1 L 60 4 L 63 1 L 66 4 L 69 1 L 72 4 L 75 1 L 78 4 L 81 1 L 84 4 L 87 1 L 90 4 L 93 1 L 96 4 L 100 1 L 100 26 L 96 29 L 93 26 L 90 29 L 87 26 L 84 29 L 81 26 L 78 29 L 75 26 L 72 29 L 69 26 L 66 29 L 63 26 L 60 29 L 57 26 L 54 29 L 51 26 L 48 29 L 45 26 L 42 29 L 39 26 L 36 29 L 33 26 L 30 29 L 27 26 L 24 29 L 21 26 L 18 29 L 15 26 L 12 29 L 9 26 L 6 29 L 3 26 L 0 29 Z" fill="rgba(255, 255, 255, 0.65)" stroke="rgba(255, 255, 255, 0.9)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function ZoomableImageWrapper({ children, isMatched }: { children: React.ReactNode, isMatched: boolean }) {
  const [scale, setScale] = useState(1);

  const handleWheel = (e: React.WheelEvent) => {
    if (isMatched) return;
    e.stopPropagation();
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + 0.1, 1.8)); 
    } else {
      setScale(prev => Math.max(prev - 0.1, 0.6)); 
    }
  };

  return (
    <div 
      onWheel={handleWheel}
      style={{ transform: `scale(${scale})`, transition: 'transform 0.1s ease-out' }}
      className={`relative w-24 h-24 md:w-32 md:h-32 bg-white p-1.5 rounded-lg shadow-[1.5px_3px_8px_rgba(0,0,0,0.2)] border border-neutral-200/90 hover:shadow-[3px_6px_14px_rgba(0,0,0,0.25)] ${isMatched ? '' : 'hover:-translate-y-0.5'} transition-all duration-200`}
    >
      {!isMatched && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C10.3 2 9 3.3 9 5c0 1.5.8 2.8 2 3.5V13c-2.2 0-4 1.8-4 4s1.8 4 4 4h2c2.2 0 4-1.8 4-4s-1.8-4-4-4V8.5c1.2-.7 2-2 2-3.5 0-1.7-1.3-3-3-3z" fill="#ef4444" />
          </svg>
        </div>
      )}
      <div className="w-full h-full bg-neutral-100 rounded border border-neutral-200 overflow-hidden flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function DraggableCard({ id, x, y, rotation, children }: { id: string; x: number; y: number; rotation: number; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(1.06) rotate(${rotation + 4}deg)` : `rotate(${rotation}deg)`,
    touchAction: 'none',
    zIndex: isDragging ? 50 : 10,
    transition: transform ? 'transform 0.02s ease-out' : 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
  };
  return <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="select-none cursor-grab active:cursor-grabbing">{children}</div>;
}

export default function App() {
  const [images, setImages] = useState<CardPosition[]>([]);
  const [questions, setQuestions] = useState<CardPosition[]>([]);
  const [matchedGroups, setMatchedGroups] = useState<CardPosition[]>([]);
  const [wrongMatches, setWrongMatches] = useState<string[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  const isGameComplete = matchedGroups.length === CLASSROOM_PAIRS.length && CLASSROOM_PAIRS.length > 0;

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const { images: imgPos, questions: qPos } = generatePositions(isMobile);
    setImages(imgPos);
    setQuestions(qPos);
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const handleDragStart = () => { sounds.playPop(); };

  const handleDragEnd = (event: DragEndEvent) => {
    if (isGameComplete) return; // منع التحريك بعد انتهاء اللعبة

    const { active, delta } = event;
    const id = active.id.toString();
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
      if (matchingQ && !matchedGroups.some(g => g.id === `matched-${pairId}`)) {
        evaluateMatch(pairId, updatedX, updatedY, matchingQ.x, matchingQ.y);
      }
    } 
    else if (id.startsWith('q-')) {
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
      if (matchingImg && !matchedGroups.some(g => g.id === `matched-${pairId}`)) {
        evaluateMatch(pairId, matchingImg.x, matchingImg.y, updatedX, updatedY);
      }
    }
    else if (id.startsWith('matched-')) {
      setMatchedGroups(prev => prev.map(group => {
        if (group.id === id) {
          return { 
            ...group, 
            x: Math.max(0, Math.min(88, group.x + deltaXPercent)), 
            y: Math.max(0, Math.min(88, group.y + deltaYPercent)) 
          };
        }
        return group;
      }));
    }
  };

  const evaluateMatch = (pairId: string, imgX: number, imgY: number, qX: number, qY: number) => {
    const dx = (imgX + 6) - (qX + 8);
    const dy = (imgY + 6) - (qY + 5);
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 18) {
      sounds.playTape();
      
      setMatchedGroups(prev => [...prev, {
        id: `matched-${pairId}`,
        x: imgX,
        y: imgY,
        rotation: (Math.random() * 10) - 5
      }]);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#fbbf24', '#3b82f6', '#f43f5e'],
        zIndex: 9999
      });

    } else {
      const otherImages = CLASSROOM_PAIRS.filter(p => p.id !== pairId && !matchedGroups.some(g => g.id === `matched-${p.id}`));
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

  return (
    <div className="w-full min-h-screen bg-gray-50 p-2 md:p-6 flex flex-col justify-center items-center font-sans">
      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-6px); } 40%, 80% { transform: translateX(6px); } }
        @keyframes scaleIn { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}</style>

      <main className="w-full max-w-6xl flex-grow relative flex items-center justify-center">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div ref={boardRef} className="w-full h-[680px] md:h-[780px] rounded-3xl relative overflow-hidden shadow-2xl border-[10px] md:border-[14px] border-neutral-900 bg-gradient-to-br from-white to-pink-50 select-none">
            
            {/* رسالة النجاح */}
            {isGameComplete && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-sm animate-[fadeIn_0.5s_ease-out]">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-2 border-pink-200 text-center max-w-lg mx-4 animate-[scaleIn_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
                  <h2 className="text-3xl md:text-4xl font-bold text-pink-600 mb-4 tracking-wide">Félicitations ! 🎉</h2>
                  <p className="text-lg md:text-xl text-neutral-700 font-medium leading-relaxed">
                    Vous connaissez bien la culture marocaine et mauritanienne !
                  </p>
                </div>
              </div>
            )}

            {matchedGroups.map((group) => {
              const pairId = group.id.replace('matched-', '');
              const pair = CLASSROOM_PAIRS.find(p => p.id === pairId)!;
              
              return (
                <DraggableCard key={group.id} id={group.id} x={group.x} y={group.y} rotation={group.rotation}>
                  <div className="relative flex flex-col items-center animate-[scaleIn_0.35s_cubic-bezier(0.34,1.56,0.64,1)]">
                    <div className="relative z-10 scale-95 md:scale-100"><NotebookPaperScrap question={pair.question} isMatched={true} /></div>
                    <div className="relative z-0 -mt-[12px] md:-mt-[18px]">
                      <ZoomableImageWrapper isMatched={true}>{pair.svg}</ZoomableImageWrapper>
                    </div>
                    <TransparentTape />
                  </div>
                </DraggableCard>
              );
            })}

            {questions.map((q) => {
              const pairId = q.id.replace('q-', '');
              if (matchedGroups.some(g => g.id === `matched-${pairId}`)) return null;
              const pair = CLASSROOM_PAIRS.find((p) => p.id === pairId)!;
              
              return (
                <DraggableCard key={q.id} id={q.id} x={q.x} y={q.y} rotation={q.rotation}>
                  <div className={wrongMatches.includes(q.id) ? 'animate-[shake_0.4s_ease-in-out]' : ''}>
                    <NotebookPaperScrap question={pair.question} />
                  </div>
                </DraggableCard>
              );
            })}

            {images.map((img) => {
              const pairId = img.id.replace('img-', '');
              if (matchedGroups.some(g => g.id === `matched-${pairId}`)) return null;
              const pair = CLASSROOM_PAIRS.find((p) => p.id === pairId)!;
              
              return (
                <DraggableCard key={img.id} id={img.id} x={img.x} y={img.y} rotation={img.rotation}>
                  <div className={wrongMatches.includes(img.id) ? 'animate-[shake_0.4s_ease-in-out] border-rose-500 rounded-lg' : ''}>
                    <ZoomableImageWrapper isMatched={false}>{pair.svg}</ZoomableImageWrapper>
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
