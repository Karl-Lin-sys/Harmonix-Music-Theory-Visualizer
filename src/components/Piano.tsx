import { motion } from 'motion/react';
import { NOTES, isBlackKey } from '../lib/music';

interface PianoProps {
  activeNotes: string[];
  onNoteClick?: (note: string) => void;
}

export default function Piano({ activeNotes, onNoteClick }: PianoProps) {
  // 2 octaves
  const octaves = [0, 1];
  const allNotes = octaves.flatMap(oct => NOTES.map(n => `${n}${oct}`));

  const isActive = (note: string) => {
    const noteName = note.replace(/\d+/, '');
    return activeNotes.includes(noteName);
  };

  return (
    <div className="relative flex h-48 w-full select-none overflow-x-auto pb-4 pt-2">
      <div className="flex min-w-max">
        {allNotes.map((note, i) => {
          const noteName = note.replace(/\d+/, '');
          const black = isBlackKey(noteName);
          
          if (black) return null;

          return (
            <div key={note} className="relative">
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => onNoteClick?.(noteName)}
                className={`h-40 w-12 border border-slate-300 bg-white transition-colors duration-200 ${
                  isActive(note) ? 'bg-blue-100 ring-2 ring-blue-500 ring-inset' : 'hover:bg-slate-50'
                } flex items-end justify-center pb-2 text-xs font-medium text-slate-400`}
              >
                {noteName}
              </motion.div>
              
              {/* Black keys */}
              {i + 1 < allNotes.length && isBlackKey(allNotes[i + 1].replace(/\d+/, '')) && (
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNoteClick?.(allNotes[i + 1].replace(/\d+/, ''));
                  }}
                  className={`absolute left-8 top-0 z-10 h-24 w-8 bg-slate-900 transition-colors duration-200 ${
                    isActive(allNotes[i + 1]) ? 'bg-blue-600 ring-2 ring-blue-400 ring-inset' : 'hover:bg-slate-800'
                  } flex items-end justify-center pb-2 text-[10px] font-medium text-slate-300`}
                >
                  {allNotes[i + 1].replace(/\d+/, '')}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
