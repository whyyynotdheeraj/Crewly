'use client';

import React, { useState, useRef, useEffect } from 'react';

interface ImageUploadProps {
  onUpload?: (url: string) => void;
  onChange?: (url: string) => void;
  type: 'profile' | 'experience';
  currentImage?: string;
  value?: string;
}

function compressImageFile(file: File, maxWidth: number, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Image decode failed'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });
}

export default function ImageUpload({ onUpload, onChange, type, currentImage, value }: ImageUploadProps) {
  const uploadCallback = onUpload || onChange || (() => {});
  const initialImage = value || currentImage || null;
  const [preview, setPreview] = useState<string | null>(initialImage);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value !== undefined) {
      setPreview(value || null);
    } else if (currentImage !== undefined) {
      setPreview(currentImage || null);
    }
  }, [value, currentImage]);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP)');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const maxWidth = type === 'profile' ? 600 : 1000;
      const base64Data = await compressImageFile(selectedFile, maxWidth, 0.82);
      setPreview(base64Data);
      uploadCallback(base64Data);
    } catch (err) {
      console.error('Image compression error:', err);
      // Fallback to raw FileReader
      const reader = new FileReader();
      reader.onload = (ev) => {
        const res = ev.target?.result as string;
        setPreview(res);
        uploadCallback(res);
      };
      reader.readAsDataURL(selectedFile);
    } finally {
      setProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    uploadCallback('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-200 ${
          preview 
            ? 'border-emerald-300 bg-emerald-50/20 hover:border-emerald-400' 
            : 'border-gray-300 hover:bg-gray-50 hover:border-blue-400'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
        />
        
        {processing ? (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
            <p className="text-xs font-semibold text-blue-600">Compressing & optimizing photo...</p>
          </div>
        ) : preview ? (
          <div className="relative inline-block py-1">
            <img 
              src={preview} 
              alt="Preview" 
              className={`max-w-full mx-auto object-cover shadow-md ${
                type === 'profile' ? 'w-28 h-28 rounded-full border-2 border-emerald-500' : 'max-h-44 rounded-lg border border-emerald-300'
              }`}
            />
            <button
              type="button"
              onClick={clearSelection}
              className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-transform hover:scale-110"
              title="Remove photo"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
              <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Photo Attached (Saved to Database)</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Click to change photo</p>
          </div>
        ) : (
          <div className="py-4">
            <svg className="mx-auto h-10 w-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-700 font-semibold">Click to select photo from device</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 5MB (auto-compressed & stored permanently)</p>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  );
}
