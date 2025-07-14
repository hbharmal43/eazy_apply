"use client"

import React from 'react'
import Select, { components, StylesConfig } from 'react-select'
import { cities } from '@/lib/cities'

interface CityOption {
  value: string
  label: string
}

interface CitySelectProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function CitySelect({ 
  value, 
  onChange, 
  placeholder = "Search city...",
  className 
}: CitySelectProps) {
  // Convert cities array to options format
  const cityOptions: CityOption[] = cities.map(city => ({
    value: city,
    label: city
  }))

  // Debug: Log the number of options
  console.log('City options count:', cityOptions.length)

  // Find the selected option
  const selectedOption = cityOptions.find(option => option.value === value)

  // Custom styles to match your design system
  const customStyles: StylesConfig<CityOption> = {
    control: (provided, state) => ({
      ...provided,
      height: '40px',
      minHeight: '40px',
      border: state.isFocused ? '2px solid hsl(217 91% 60%)' : '1px solid hsl(214.3 31.8% 91.4%)',
      borderRadius: '6px',
      boxShadow: state.isFocused ? '0 0 0 2px hsl(217 91% 60% / 0.2)' : 'none',
      backgroundColor: 'hsl(0 0% 100%)',
      fontSize: '14px',
      cursor: 'pointer',
      '&:hover': {
        borderColor: state.isFocused ? 'hsl(217 91% 60%)' : 'hsl(214.3 31.8% 91.4%)'
      }
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 12px',
      height: '38px'
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: 'hsl(222.2 84% 4.9%)'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'hsl(215.4 16.3% 46.9%)',
      fontSize: '14px'
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'hsl(222.2 84% 4.9%)',
      fontSize: '14px'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'hsl(0 0% 100%)',
      border: '1px solid hsl(214.3 31.8% 91.4%)',
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
             zIndex: 9999
    }),
         menuList: (provided) => ({
       ...provided,
       padding: '4px',
       maxHeight: '300px'
     }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? 'hsl(217 91% 60%)' 
        : state.isSelected 
          ? 'hsl(217 91% 60%)' 
          : 'transparent',
      color: state.isFocused || state.isSelected ? 'white' : 'hsl(222.2 84% 4.9%)',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '14px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'hsl(217 91% 60%)',
        color: 'white'
      }
    }),
    indicatorSeparator: () => ({
      display: 'none'
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'hsl(215.4 16.3% 46.9%)',
      padding: '0 8px',
      '&:hover': {
        color: 'hsl(215.4 16.3% 46.9%)'
      }
    })
  }

  // Custom components
  const DropdownIndicator = (props: any) => {
    return (
      <components.DropdownIndicator {...props}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </components.DropdownIndicator>
    )
  }

  return (
    <div className={className}>
      <Select
        options={cityOptions}
        value={selectedOption || null}
        onChange={(selectedOption) => {
          const option = selectedOption as CityOption | null
          onChange?.(option?.value || '')
        }}
        placeholder={placeholder}
        isSearchable={true}
        isClearable={true}
        closeMenuOnSelect={true}
        styles={customStyles}
        components={{
          DropdownIndicator
        }}
        filterOption={(option, searchText) => {
          // Show all options if no search text
          if (!searchText || searchText.trim() === '') return true
          
          const search = searchText.toLowerCase().trim()
          const city = option.label.toLowerCase()
          
          // Match from beginning of city name (higher priority)
          if (city.startsWith(search)) return true
          
          // Match from beginning of any word in the city name
          const words = city.split(/[\s,]+/)
          if (words.some(word => word.startsWith(search))) return true
          
          // Match anywhere in the city name (lower priority)
          return city.includes(search)
        }}
        loadingMessage={() => 'Loading cities...'}
        openMenuOnFocus={true}
        openMenuOnClick={true}
        defaultMenuIsOpen={false}
        noOptionsMessage={({ inputValue }) => 
          inputValue ? `No cities found matching "${inputValue}"` : 'Type to search cities...'
        }
        maxMenuHeight={300}
        menuShouldScrollIntoView={true}
        menuIsOpen={undefined}
        menuPlacement="auto"
      />
    </div>
  )
} 