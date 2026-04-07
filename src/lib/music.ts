/**
 * Music Theory Engine
 */

export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

export type Note = string;

export interface Scale {
  name: string;
  intervals: number[];
}

export const SCALES: Record<string, Scale> = {
  major: { name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { name: 'Natural Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  harmonicMinor: { name: 'Harmonic Minor', intervals: [0, 2, 3, 5, 7, 8, 11] },
  melodicMinor: { name: 'Melodic Minor', intervals: [0, 2, 3, 5, 7, 9, 11] },
  majorPentatonic: { name: 'Major Pentatonic', intervals: [0, 2, 4, 7, 9] },
  minorPentatonic: { name: 'Minor Pentatonic', intervals: [0, 3, 5, 7, 10] },
  blues: { name: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
  dorian: { name: 'Dorian', intervals: [0, 2, 3, 5, 7, 9, 10] },
  phrygian: { name: 'Phrygian', intervals: [0, 1, 3, 5, 7, 8, 10] },
  lydian: { name: 'Lydian', intervals: [0, 2, 4, 6, 7, 9, 11] },
  mixolydian: { name: 'Mixolydian', intervals: [0, 2, 4, 5, 7, 9, 10] },
  locrian: { name: 'Locrian', intervals: [0, 1, 3, 5, 6, 8, 10] },
};

export interface Chord {
  name: string;
  intervals: number[];
}

export const CHORDS: Record<string, Chord> = {
  major: { name: 'Major', intervals: [0, 4, 7] },
  minor: { name: 'Minor', intervals: [0, 3, 7] },
  diminished: { name: 'Diminished', intervals: [0, 3, 6] },
  augmented: { name: 'Augmented', intervals: [0, 4, 8] },
  major7: { name: 'Major 7th', intervals: [0, 4, 7, 11] },
  minor7: { name: 'Minor 7th', intervals: [0, 3, 7, 10] },
  dominant7: { name: 'Dominant 7th', intervals: [0, 4, 7, 10] },
  m7b5: { name: 'Minor 7th b5', intervals: [0, 3, 6, 10] },
  dim7: { name: 'Diminished 7th', intervals: [0, 3, 6, 9] },
  sus2: { name: 'Suspended 2nd', intervals: [0, 2, 7] },
  sus4: { name: 'Suspended 4th', intervals: [0, 5, 7] },
};

export function getNoteIndex(note: string): number {
  const normalized = note.charAt(0).toUpperCase() + note.slice(1);
  let idx = NOTES.indexOf(normalized);
  if (idx === -1) {
    idx = NOTES_FLAT.indexOf(normalized);
  }
  return idx;
}

export function getScaleNotes(root: string, scaleType: string): Note[] {
  const rootIdx = getNoteIndex(root);
  if (rootIdx === -1) return [];
  
  const scale = SCALES[scaleType];
  if (!scale) return [];

  return scale.intervals.map(interval => NOTES[(rootIdx + interval) % 12]);
}

export function getChordNotes(root: string, chordType: string): Note[] {
  const rootIdx = getNoteIndex(root);
  if (rootIdx === -1) return [];
  
  const chord = CHORDS[chordType];
  if (!chord) return [];

  return chord.intervals.map(interval => NOTES[(rootIdx + interval) % 12]);
}

export function isBlackKey(note: string): boolean {
  return note.includes('#') || note.includes('b');
}

export function getNoteAtFret(stringRoot: string, fret: number): string {
  const rootIdx = getNoteIndex(stringRoot);
  return NOTES[(rootIdx + fret) % 12];
}
