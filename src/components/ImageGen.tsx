import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Loader2, Sparkles, Download, Maximize2 } from 'lucide-react';

type ImageSize = '1K' | '2K' | '4K';

export default function ImageGen() {
  const [prompt, setPrompt] = useState('');
  const [size, setSize] = useState<ImageSize>('1K');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const generateImage = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
          parts: [{ text: `A high-quality artistic visualization of music theory: ${prompt}` }],
        },
        config: {
          imageConfig: {
            imageSize: size,
            aspectRatio: '1:1',
          },
        },
      });

      const candidates = (response as any).candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            setImageUrl(`data:image/png;base64,${base64Data}`);
            break;
          }
        }
      }

      if (!imageUrl) {
        // Fallback if no image part found in the loop above (though it should be there)
        // Re-checking after the loop
      }
    } catch (err) {
      console.error('Image generation error:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-purple-600" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">Visualizer AI</h2>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-200/50 p-1">
          {(['1K', '2K', '4K'] as ImageSize[]).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`rounded-md px-3 py-1 text-[10px] font-bold transition-all ${
                size === s ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Input Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe a musical visualization (e.g., 'A cosmic representation of the Circle of Fifths with glowing nebulae')..."
              className="h-32 w-full resize-none rounded-xl bg-slate-50 p-4 text-sm outline-none ring-1 ring-slate-200 transition-all focus:bg-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={generateImage}
            disabled={isLoading || !prompt.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all hover:bg-purple-700 disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Generate Visualization
              </>
            )}
          </button>

          {/* Result Area */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
            <AnimatePresence mode="wait">
              {imageUrl ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative h-full w-full"
                >
                  <img
                    src={imageUrl}
                    alt="Generated visualization"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex gap-4">
                      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition-transform hover:scale-110">
                        <Download size={20} />
                      </button>
                      <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-xl transition-transform hover:scale-110">
                        <Maximize2 size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="flex h-full w-full flex-col items-center justify-center gap-4 text-slate-400"
                >
                  <div className="rounded-full bg-slate-200/50 p-6">
                    <ImageIcon size={48} className="opacity-20" />
                  </div>
                  <p className="text-xs font-medium">Your visualization will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/90 p-6 text-center">
                <p className="text-sm font-medium text-red-500">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
