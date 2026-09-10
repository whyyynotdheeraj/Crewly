'use client';

import React, { useState, KeyboardEvent } from 'react';

interface SkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillInput({ skills, onChange }: SkillInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !skills.includes(trimmedValue)) {
      onChange([...skills, trimmedValue]);
      setInputValue('');
    } else if (skills.includes(trimmedValue)) {
      setInputValue(''); // Clear if duplicate
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange(skills.filter(skill => skill !== skillToRemove));
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-2">
        {skills.map((skill, index) => (
          <span 
            key={index} 
            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100"
          >
            {skill}
            <button
              type="button"
              onClick={() => removeSkill(skill)}
              className="ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-900 focus:bg-blue-500 focus:text-white focus:outline-none transition-colors"
              aria-label={`Remove ${skill}`}
            >
              <svg className="h-2.5 w-2.5" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
              </svg>
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addSkill}
        placeholder="Type a skill and press Enter"
        className="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 shadow-sm"
      />
    </div>
  );
}
