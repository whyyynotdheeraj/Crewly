'use client';

import React, { useState, useEffect, useCallback } from 'react';

interface ImageGalleryProps {
  images: { url: string; caption?: string }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  const validImages = (images || []).filter((img) => img && typeof img.url === 'string' && img.url.trim() !== '');

  const handlePrev = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev > 0 ? prev - 1 : validImages.length - 1;
    });
  }, [validImages.length]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return prev < validImages.length - 1 ? prev + 1 : 0;
    });
  }, [validImages.length]);

  const handleClose = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  // Keyboard navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, handlePrev, handleNext, handleClose]);

  if (!validImages || validImages.length === 0) {
    return null;
  }

  return (
    <>
      {/* Grid of Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5 sm:gap-4">
        {validImages.map((image, index) => (
          <div
            key={index}
            className="cursor-pointer group relative aspect-4/3 sm:aspect-square overflow-hidden rounded-2xl bg-slate-100 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            onClick={() => setSelectedIndex(index)}
          >
            {failedImages[index] ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400 p-4 text-center">
                <svg className="w-8 h-8 mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[11px] font-medium">Photo Preview</span>
              </div>
            ) : (
              <img
                src={image.url}
                alt={image.caption || `Event photo ${index + 1}`}
                onError={() => setFailedImages((prev) => ({ ...prev, [index]: true }))}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}

            {/* Hover overlay with zoom icon */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
              <div className="self-end bg-black/50 backdrop-blur-md text-white p-1.5 rounded-full shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
              </div>

              {image.caption && (
                <p className="text-white text-xs font-semibold line-clamp-1 drop-shadow-sm">
                  {image.caption}
                </p>
              )}
            </div>

            {/* Photo number badge */}
            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
              {index + 1}
            </span>
          </div>
        ))}
      </div>

      {/* Full-Screen Interactive Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-slate-950/95 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in select-none"
          onClick={handleClose}
        >
          {/* Top Control Bar */}
          <div
            className="w-full max-w-6xl flex items-center justify-between z-20 pt-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back Button */}
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl font-bold text-xs sm:text-sm backdrop-blur-md border border-white/15 transition-all shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </button>

            {/* Counter Badge */}
            <div className="px-3.5 py-1.5 bg-white/10 backdrop-blur-md border border-white/15 rounded-full text-white text-xs sm:text-sm font-semibold tracking-wide">
              Photo {selectedIndex + 1} of {validImages.length}
            </div>

            {/* Close (X) Button */}
            <button
              type="button"
              onClick={handleClose}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl flex items-center justify-center backdrop-blur-md border border-white/15 transition-all shadow-md cursor-pointer"
              title="Close (Esc)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Photo Area with Navigation Arrows */}
          <div
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-3 sm:my-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Photo Button */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-20 w-11 h-11 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/90 active:scale-95 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer"
                title="Previous Photo (Left Arrow)"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Active Image Container */}
            <div className="relative max-w-full max-h-[72vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
              <img
                key={selectedIndex}
                src={validImages[selectedIndex].url}
                alt={validImages[selectedIndex].caption || `Photo ${selectedIndex + 1}`}
                className="max-w-full max-h-[72vh] object-contain rounded-2xl"
              />
            </div>

            {/* Next Photo Button */}
            {validImages.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-20 w-11 h-11 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/90 active:scale-95 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer"
                title="Next Photo (Right Arrow)"
              >
                <svg className="w-6 h-6 sm:w-7 sm:h-7 -mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Bottom Caption & Thumbnail Strip */}
          <div
            className="w-full max-w-4xl flex flex-col items-center gap-3 z-20 pb-1"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Caption */}
            {validImages[selectedIndex].caption && (
              <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs sm:text-sm font-medium text-center max-w-2xl">
                {validImages[selectedIndex].caption}
              </div>
            )}

            {/* Thumbnail Navigation Strip */}
            {validImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full py-1.5 px-3 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 scrollbar-none">
                {validImages.map((img, tIdx) => (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => setSelectedIndex(tIdx)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden flex-shrink-0 transition-all cursor-pointer ${
                      tIdx === selectedIndex
                        ? 'ring-2 ring-blue-500 scale-105 opacity-100'
                        : 'opacity-50 hover:opacity-80 border border-white/20'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
