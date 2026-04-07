import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Piano as PianoIcon, 
  Guitar, 
  CircleDot, 
  MessageSquare, 
  Image as ImageIcon,
  ChevronRight,
  Settings2,
  Info,
  LayoutDashboard
} from 'lucide-react';

import Piano from './components/Piano';
import Fretboard from './components/Fretboard';
import CircleOfFifths from './components/CircleOfFifths';
import Chat from './components/Chat';
import ImageGen from './components/ImageGen';
import { NOTES, SCALES, CHORDS, getScaleNotes, getChordNotes } from './lib/music';

type ViewMode = 'piano' | 'guitar' | 'circle';
type ToolMode = 'chat' | 'image';

export default function App() {
  const [rootNote, setRootNote] = useState('C');
  const [selectionType, setSelectionType] = useState<'scale' | 'chord'>('scale');
  const [selectionValue, setSelectionValue] = useState('major');
  const [viewMode, setViewMode] = useState<ViewMode>('piano');
  const [toolMode, setToolMode] = useState<ToolMode>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const activeNotes = useMemo(() => {
    if (selectionType === 'scale') {
      return getScaleNotes(rootNote, selectionValue);
    } else {
      return getChordNotes(rootNote, selectionValue);
    }
  }, [rootNote, selectionType, selectionValue]);

  const handleNoteClick = (note: string) => {
    setRootNote(note);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <aside className="z-20 flex w-20 flex-col items-center border-r border-slate-200 bg-white py-8 shadow-sm">
        <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
          <Music size={24} />
        </div>
        
        <nav className="flex flex-1 flex-col gap-6">
          <button 
            onClick={() => setViewMode('piano')}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              viewMode === 'piano' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <PianoIcon size={22} />
            <span className="absolute left-16 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white transition-transform group-hover:scale-100">Piano</span>
          </button>
          
          <button 
            onClick={() => setViewMode('guitar')}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              viewMode === 'guitar' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <Guitar size={22} />
            <span className="absolute left-16 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white transition-transform group-hover:scale-100">Guitar</span>
          </button>
          
          <button 
            onClick={() => setViewMode('circle')}
            className={`group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              viewMode === 'circle' ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <CircleDot size={22} />
            <span className="absolute left-16 scale-0 rounded bg-slate-800 px-2 py-1 text-[10px] font-bold text-white transition-transform group-hover:scale-100">Circle</span>
          </button>
        </nav>

        <div className="flex flex-col gap-6">
          <button className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <Settings2 size={22} />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600">
            <Info size={22} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1">
              <button 
                onClick={() => setSelectionType('scale')}
                className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                  selectionType === 'scale' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Scales
              </button>
              <button 
                onClick={() => setSelectionType('chord')}
                className={`rounded-md px-4 py-1.5 text-xs font-bold transition-all ${
                  selectionType === 'chord' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Chords
              </button>
            </div>

            <div className="h-6 w-[1px] bg-slate-200" />

            <div className="flex items-center gap-2">
              <select 
                value={rootNote}
                onChange={(e) => setRootNote(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {NOTES.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              
              <select 
                value={selectionValue}
                onChange={(e) => setSelectionValue(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              >
                {selectionType === 'scale' 
                  ? Object.entries(SCALES).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)
                  : Object.entries(CHORDS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)
                }
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-600">
              <LayoutDashboard size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
            >
              <ChevronRight className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </header>

        {/* Visualization Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {/* Active Visualization */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                  {rootNote} {selectionType === 'scale' ? SCALES[selectionValue].name : CHORDS[selectionValue].name}
                </h2>
                <div className="flex gap-2">
                  {activeNotes.map((note, i) => (
                    <span key={i} className="rounded-md bg-white px-3 py-1 text-sm font-bold text-blue-600 shadow-sm ring-1 ring-slate-200">
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200">
                <AnimatePresence mode="wait">
                  {viewMode === 'piano' && (
                    <motion.div
                      key="piano"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Piano activeNotes={activeNotes} onNoteClick={handleNoteClick} />
                    </motion.div>
                  )}
                  {viewMode === 'guitar' && (
                    <motion.div
                      key="guitar"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Fretboard activeNotes={activeNotes} onNoteClick={handleNoteClick} />
                    </motion.div>
                  )}
                  {viewMode === 'circle' && (
                    <motion.div
                      key="circle"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex justify-center"
                    >
                      <CircleOfFifths activeNotes={activeNotes} onNoteClick={handleNoteClick} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Info Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Structure</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  {selectionType === 'scale' 
                    ? `The ${SCALES[selectionValue].name} scale is built using the interval pattern: ${SCALES[selectionValue].intervals.join(', ')}.`
                    : `The ${CHORDS[selectionValue].name} chord consists of the intervals: ${CHORDS[selectionValue].intervals.join(', ')}.`
                  }
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Usage</h3>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  Commonly used in {selectionType === 'scale' ? 'melodic composition and improvisation' : 'harmonic progression and accompaniment'}.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Related</h3>
                <div className="flex flex-wrap gap-2">
                  {['Relative Minor', 'Parallel Major', 'Dominant'].map(tag => (
                    <span key={tag} className="rounded-full bg-slate-50 px-3 py-1 text-[10px] font-bold text-slate-500 ring-1 ring-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Side Panel (AI Tools) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 400, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="z-10 flex flex-col border-l border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex h-20 items-center gap-1 border-b border-slate-100 bg-slate-50/50 px-4">
              <button 
                onClick={() => setToolMode('chat')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
                  toolMode === 'chat' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <MessageSquare size={16} />
                Chat
              </button>
              <button 
                onClick={() => setToolMode('image')}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-xs font-bold transition-all ${
                  toolMode === 'image' ? 'bg-white text-purple-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <ImageIcon size={16} />
                Image Gen
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {toolMode === 'chat' ? <Chat /> : <ImageGen />}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
