"use client"

import React, { useState } from 'react'
import Select, { components, StylesConfig } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { schools, searchSchools, getSchoolLogo, School } from '@/lib/schools'
import { GraduationCap } from 'lucide-react'

interface SchoolOption {
  value: string
  label: string
  school: School | null
}

interface SchoolSelectProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function SchoolSelect({ 
  value, 
  onChange, 
  placeholder = "Search school...",
  className 
}: SchoolSelectProps) {
  const [logoErrors, setLogoErrors] = useState<Set<string>>(new Set())

  // Convert schools array to options format
  const schoolOptions: SchoolOption[] = schools.map(school => ({
    value: school.name,
    label: school.name,
    school: school
  }))

  // Find the selected option (could be from database or custom)
  const selectedOption = schoolOptions.find(option => option.value === value) || 
    (value ? { value, label: value, school: null } : null)

  // Handle logo loading errors
  const handleLogoError = (domain: string) => {
    setLogoErrors(prev => new Set(prev).add(domain))
  }

  // Custom Option component with logo
  const Option = (props: any) => {
    const { data } = props
    const school: School | null = data.school
    
    // Handle custom entries (user-typed schools not in database)
    if (!school) {
      return (
        <components.Option {...props}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">{data.label}</div>
              <div className="text-sm text-gray-500 truncate">Custom School</div>
            </div>
          </div>
        </components.Option>
      )
    }

    const logoUrl = getSchoolLogo(school.domain)
    const hasLogoError = logoErrors.has(school.domain)

    return (
      <components.Option {...props}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
            {!hasLogoError ? (
              <img
                src={logoUrl}
                alt={`${school.name} logo`}
                className="w-8 h-8 rounded object-contain"
                onError={() => handleLogoError(school.domain)}
              />
            ) : (
              <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">{school.name}</div>
            <div className="text-sm text-gray-500 truncate">
              {school.city && school.state ? `${school.city}, ${school.state}` : 
               school.city ? school.city : 
               school.country}
            </div>
          </div>
        </div>
      </components.Option>
    )
  }

  // Custom SingleValue component with logo for selected value
  const SingleValue = (props: any) => {
    const { data } = props
    if (!data) return <components.SingleValue {...props} />
    
    // Handle custom entries (user-typed schools not in database)
    if (!data.school) {
      return (
        <components.SingleValue {...props}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-blue-600" />
            </div>
            <span className="truncate">{data.value || data.label}</span>
          </div>
        </components.SingleValue>
      )
    }
    
    const school: School = data.school
    const logoUrl = getSchoolLogo(school.domain)
    const hasLogoError = logoErrors.has(school.domain)

    return (
      <components.SingleValue {...props}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            {!hasLogoError ? (
              <img
                src={logoUrl}
                alt={`${school.name} logo`}
                className="w-6 h-6 rounded object-contain"
                onError={() => handleLogoError(school.domain)}
              />
            ) : (
              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
            )}
          </div>
          <span className="truncate">{school.name}</span>
        </div>
      </components.SingleValue>
    )
  }

  // Custom styles to match your design system
  const customStyles: StylesConfig<SchoolOption> = {
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

  // Custom dropdown indicator
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
      <CreatableSelect
        options={schoolOptions}
        value={selectedOption || null}
        onChange={(selectedOption) => {
          const option = selectedOption as SchoolOption | null
          onChange?.(option?.value || '')
        }}
        onCreateOption={(inputValue) => {
          // Allow user to create custom school entry
          onChange?.(inputValue)
        }}
        placeholder={placeholder}
        isSearchable={true}
        isClearable={true}
        closeMenuOnSelect={true}
        openMenuOnFocus={true}
        openMenuOnClick={true}
        styles={customStyles}
        components={{
          Option,
          SingleValue,
          DropdownIndicator
        }}
        filterOption={(option, searchText) => {
          // Show first 20 options if no search text
          if (!searchText || searchText.trim() === '') {
            const index = schoolOptions.indexOf(option.data)
            return index < 20
          }
          
          const search = searchText.toLowerCase().trim()
          const school = option.data.school
          
          // Handle custom entries (they don't have school data)
          if (!school) {
            return true
          }
          
          // Match school name, city, or state
          return Boolean(
            school.name.toLowerCase().includes(search) ||
            school.city?.toLowerCase().includes(search) ||
            school.state?.toLowerCase().includes(search)
          )
        }}
        noOptionsMessage={({ inputValue }) => 
          inputValue ? `No schools found matching "${inputValue}". Press Enter to add "${inputValue}"` : 'Type to search schools...'
        }
        formatCreateLabel={(inputValue) => `Add "${inputValue}"`}
        maxMenuHeight={300}
        menuPlacement="auto"
      />
    </div>
  )
} 