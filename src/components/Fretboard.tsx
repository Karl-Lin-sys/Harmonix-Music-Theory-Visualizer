import { motion } from 'motion/react';
import { NOTES, getNoteAtFret } from '../lib/music';

interface FretboardProps {
  activeNotes: string[];
  onNoteClick?: (note: string) => void;
}

export default function Fretboard({ activeNotes, onNoteClick }: FretboardProps) {
  const strings = ['E', 'A', 'D', 'G', 'B', 'E']; // Standard tuning
  const frets = 15; // Number of frets to show

  const isActive = (note: string) => {
    return activeNotes.includes(note);
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
      <div className="relative min-w-[800px]">
        {/* Fret markers */}
        <div className="flex pl-12">
          {Array.from({ length: frets + 1 }).map((_, i) => (
            <div key={i} className="w-16 text-center text-xs font-bold text-slate-400">
              {i === 0 ? 'Nut' : i}
            </div>
          ))}
        </div>

        {/* Strings */}
        <div className="mt-2 space-y-4">
          {strings.slice().reverse().map((root, sIdx) => (
            <div key={sIdx} className="relative flex items-center">
              {/* String label */}
              <div className="w-12 text-sm font-bold text-slate-600">{root}</div>
              
              {/* Frets */}
              <div className="flex flex-1">
                {Array.from({ length: frets + 1 }).map((_, fIdx) => {
                  const note = getNoteAtFret(root, fIdx);
                  const active = isActive(note);
                  
                  return (
                    <div
                      key={fIdx}
                      className={`relative flex h-10 w-16 items-center justify-center border-r border-slate-300 ${
                        fIdx === 0 ? 'border-l-4 border-l-slate-800' : ''
                      }`}
                    >
                      {/* String line */}
                      <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-slate-400 opacity-50" />
                      
                      {/* Note marker */}
                      {active && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg ring-2 ring-white"
                        >
                          {note}
                        </motion.div>
                      )}
                      
                      {/* Inlay markers */}
                      {sIdx === 2 && [3, 5, 7, 9, 12, 15].includes(fIdx) && (
                        <div className="absolute -bottom-6 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
