'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-[#1A1A2E] border border-[#2D2D4E] rounded-xl shadow-2xl shadow-purple-900/20">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2D2D4E]">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#9CA3AF] hover:text-white hover:bg-[#2D2D4E] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
