'use client';

import React, { useState, useRef } from 'react';

interface ImageUploadProps {
  onUpload?: (url: string) => void;
  onChange?: (url: string) => void;
  type: 'profile' | 'experience';
  currentImage?: string;
  value?: string;
}

export default function ImageUpload({ onUpload, onChange, type, currentImage, value }: ImageUploadProps) {
  const uploadCallback = onUpload || onChange || (() => {});
  const initialImage = currentImage || value || null;
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImage);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (!droppedFile.type.startsWith('image/')) {
        setError('Please drop an image file');
        return;
      }
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      uploadCallback(data.url);
      setFile(null);
    } catch (err) {
      console.error(err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(currentImage || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
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
        
        {preview ? (
          <div className="relative inline-block">
            <img 
              src={preview} 
              alt="Preview" 
              className={`max-w-full mx-auto object-cover ${type === 'profile' ? 'w-32 h-32 rounded-full' : 'max-h-48 rounded-lg'}`}
            />
            {file && (
              <button
                type="button"
                onClick={clearSelection}
                className="absolute -top-2 -right-2 bg-white text-gray-600 rounded-full p-1 shadow-md hover:bg-gray-100 hover:text-gray-900"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
        ) : (
          <div className="py-4">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <p className="text-sm text-gray-600 font-medium">Click to select or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {file && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {uploading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </span>
          ) : (
            'Upload Image'
          )}
        </button>
      )}
    </div>
  );
}
