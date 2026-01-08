'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import './SearchableDropdown.css';

type Option = {
  value: string;
  label: string;
};

type SearchableDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (search: string) => void; // Callback for remote search
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  name?: string;
  required?: boolean;
  isLoading?: boolean;
  debounceMs?: number; // Debounce delay for onSearch (default 300ms)
};

export function SearchableDropdown({
  options,
  value,
  onChange,
  onSearch,
  placeholder = 'Select an option',
  disabled = false,
  id,
  name,
  required,
  isLoading = false,
  debounceMs = 300,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const selectedOption = options.find(opt => opt.value === value);
  
  // If onSearch is provided, don't filter locally (let parent handle it)
  // Otherwise, filter locally
  const filteredOptions = onSearch 
    ? options 
    : options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));

  // Debounced search handler
  const debouncedSearch = useCallback((searchValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (onSearch) {
      debounceRef.current = setTimeout(() => {
        onSearch(searchValue);
      }, debounceMs);
    }
  }, [onSearch, debounceMs]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function handleToggle() {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearch('');
      }
    }
  }

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setIsOpen(false);
    setSearch('');
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
    } else if (e.key === 'Enter' && filteredOptions.length === 1) {
      handleSelect(filteredOptions[0].value);
    }
  }

  return (
    <div 
      ref={containerRef} 
      className={`searchable-dropdown ${isOpen ? 'searchable-dropdown--open' : ''} ${disabled ? 'searchable-dropdown--disabled' : ''}`}
    >
      {/* Hidden input for form validation */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value}
        required={required}
      />
      
      <button
        type="button"
        className="searchable-dropdown__trigger"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`searchable-dropdown__value ${!selectedOption ? 'searchable-dropdown__value--placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg 
          className="searchable-dropdown__arrow" 
          width="12" 
          height="12" 
          viewBox="0 0 16 16" 
          fill="currentColor"
        >
          <path d="M8 11L3 6h10l-5 5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="searchable-dropdown__menu">
          <div className="searchable-dropdown__search-wrapper">
            {isLoading ? (
              <span className="searchable-dropdown__search-spinner" />
            ) : (
              <svg 
                className="searchable-dropdown__search-icon" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            )}
            <input
              ref={inputRef}
              type="text"
              className="searchable-dropdown__search"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          
          <ul className="searchable-dropdown__options" role="listbox">
            {isLoading ? (
              <li className="searchable-dropdown__loading">Searching...</li>
            ) : filteredOptions.length === 0 ? (
              <li className="searchable-dropdown__no-results">
                {search ? 'No results found' : 'Type to search...'}
              </li>
            ) : (
              filteredOptions.map(option => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  className={`searchable-dropdown__option ${option.value === value ? 'searchable-dropdown__option--selected' : ''}`}
                  onClick={() => handleSelect(option.value)}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
