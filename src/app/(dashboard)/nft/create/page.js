'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const styles = ['Anime', 'Realistic', 'Abstract', 'Pixel Art', 'Oil Painting'];

export default function CreateNFTPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Anime');
  const [previewUrl, setPreviewUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [minting, setMinting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      toast.success('Image upload ho gayi!');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      toast.success('Image upload ho gayi!');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Prompt daalo pehle');
      return;
    }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    const randomId = Math.floor(Math.random() * 100) + 20;
    setPreviewUrl(`https://picsum.photos/400/400?random=${randomId}`);
    setGenerating(false);
    toast.success('NFT generate ho gayi! 🎨');
  };

  const handleMint = async () => {
    if (!previewUrl) {
      toast.error('Pehle image upload ya generate karo');
      return;
    }
    if (!title.trim()) {
      toast.error('NFT ka title daalo');
      return;
    }
    setMinting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setMinting(false);
    toast.success('NFT mint ho gayi! 10 VERSE deducted. 🎉');
    setPreviewUrl('');
    setTitle('');
    setDescription('');
    setPrompt('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Nayi NFT Banao</h2>
        <p className="text-[#9CA3AF] text-sm mt-1">Image upload karo ya AI se generate karo</p>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#0F0F1A] border border-[#2D2D4E] rounded-xl p-1">
        {[
          { id: 'upload', label: '📁 Image Upload' },
          { id: 'ai', label: '✨ AI Generate' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-[#7C3AED] text-white shadow-lg'
                : 'text-[#9CA3AF] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
            dragOver ? 'border-[#7C3AED] bg-[#7C3AED]/10' : 'border-[#2D2D4E] hover:border-[#7C3AED]/50'
          }`}
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="w-12 h-12 text-[#9CA3AF] mx-auto mb-3" />
          <p className="text-white font-medium">Image yahan drag karo ya click karo</p>
          <p className="text-[#9CA3AF] text-sm mt-1">PNG, JPG, GIF — max 10MB</p>
        </div>
      )}

      {/* AI Tab */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ek majestic dragon jo space mein ud raha hai, purple aur gold colors mein..."
              rows={3}
              className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-3 text-white placeholder-[#4B5563] text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#E5E7EB] mb-2">Style</label>
            <div className="flex flex-wrap gap-2">
              {styles.map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedStyle === style
                      ? 'bg-[#7C3AED] text-white'
                      : 'bg-[#0F0F1A] border border-[#2D2D4E] text-[#9CA3AF] hover:text-white hover:border-[#7C3AED]/50'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3 bg-gradient-to-r from-[#7C3AED] to-[#F59E0B] hover:opacity-90 disabled:opacity-60 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {generating ? <LoadingSpinner size="sm" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generate ho raha hai...' : 'Generate Karo (10 VERSE)'}
          </button>
        </div>
      )}

      {/* Preview */}
      {previewUrl && (
        <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-4">
          <p className="text-[#9CA3AF] text-sm mb-3">Preview</p>
          <div className="relative aspect-square w-full max-w-xs mx-auto rounded-xl overflow-hidden">
            <Image
              src={previewUrl}
              alt="NFT preview"
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Title & Description */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">NFT Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Cosmic Dragon #1"
            className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-2.5 text-white placeholder-[#4B5563] text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Is NFT ke baare mein batao..."
            rows={3}
            className="w-full bg-[#0F0F1A] border border-[#2D2D4E] focus:border-[#7C3AED] focus:outline-none rounded-lg px-4 py-3 text-white placeholder-[#4B5563] text-sm resize-none"
          />
        </div>
      </div>

      {/* Mint Button */}
      <div className="bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-white font-medium">Minting Cost</p>
          <p className="text-[#F59E0B] font-bold">10 VERSE</p>
        </div>
        <button
          onClick={handleMint}
          disabled={minting || !previewUrl || !title}
          className="w-full py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
        >
          {minting ? <LoadingSpinner size="sm" /> : <ImageIcon className="w-5 h-5" />}
          {minting ? 'Mint ho raha hai...' : 'NFT Mint Karo (10 VERSE)'}
        </button>
      </div>
    </div>
  );
}
