'use client';

import React, { useState } from 'react';

interface ImageGalleryProps {
  images: { url: string; caption?: string }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div 
            key={index}
            className="cursor-pointer group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            onClick={() => setSelectedIndex(index)}
          >
            <img 
              src={image.url} 
              alt={image.caption || `Gallery image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-12 right-0 text-white hover:text-gray-300 focus:outline-none p-2"
              onClick={() => setSelectedIndex(null)}
              aria-label="Close lightbox"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            
            <img 
              src={images[selectedIndex].url} 
              alt={images[selectedIndex].caption || `Gallery image ${selectedIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
            
            {images[selectedIndex].caption && (
              <div className="mt-4 text-white text-center text-lg max-w-3xl">
                {images[selectedIndex].caption}
              </div>
            )}
            
            {/* Optional: Add prev/next buttons here if desired in the future */}
          </div>
        </div>
      )}
    </>
  );
}
