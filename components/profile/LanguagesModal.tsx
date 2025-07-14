"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactSelect from 'react-select/creatable'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { Languages, Info, Globe } from "lucide-react"

interface LanguagesModalProps {
  languages: any[]
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  profileId: string
}

interface LanguageOption {
  value: string
  label: string
}

interface SelectedLanguage {
  language_name: string
  id?: string
}

const COMMON_LANGUAGES = [
  "English", "Spanish", "French", "German", "Italian", "Portuguese", "Dutch", "Russian",
  "Mandarin Chinese", "Cantonese", "Japanese", "Korean", "Arabic", "Hebrew", "Hindi",
  "Bengali", "Tamil", "Telugu", "Urdu", "Thai", "Vietnamese", "Indonesian", "Malay",
  "Tagalog", "Turkish", "Persian", "Swahili", "Polish", "Czech", "Hungarian", "Romanian",
  "Bulgarian", "Croatian", "Serbian", "Slovak", "Slovenian", "Lithuanian", "Latvian",
  "Estonian", "Finnish", "Swedish", "Norwegian", "Danish", "Icelandic", "Greek",
  "Ukrainian", "Belarusian", "Georgian", "Armenian", "Azerbaijani", "Kazakh", "Uzbek"
]

export function LanguagesModal({ languages, isOpen, onClose, onSave, profileId }: LanguagesModalProps) {
  const [selectedLanguages, setSelectedLanguages] = useState<SelectedLanguage[]>([])
  const [newLanguage, setNewLanguage] = useState<LanguageOption | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isOpen && languages) {
      setSelectedLanguages(languages.map(lang => ({
        language_name: lang.language_name,
        id: lang.id
      })))
    } else if (isOpen) {
      setSelectedLanguages([])
    }
    setNewLanguage(null)
  }, [isOpen, languages])

  const languageOptions: LanguageOption[] = COMMON_LANGUAGES.map(lang => ({
    value: lang,
    label: lang
  }))

  const handleAddLanguage = () => {
    if (newLanguage) {
      if (!selectedLanguages.find(lang => lang.language_name.toLowerCase() === newLanguage.value.toLowerCase())) {
        setSelectedLanguages(prev => [...prev, {
          language_name: newLanguage.value
        }])
        setNewLanguage(null)
      } else {
        toast.error("This language is already added")
      }
    }
  }

  const removeLanguage = (languageToRemove: string) => {
    setSelectedLanguages(prev => prev.filter(lang => lang.language_name !== languageToRemove))
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const deleteResult = await supabase
        .from('profile_languages')
        .delete()
        .eq('profile_id', profileId)
      if (deleteResult.error) throw deleteResult.error
      if (selectedLanguages.length > 0) {
        const languagesWithProfile = selectedLanguages.map(lang => ({
          profile_id: profileId,
          language_name: lang.language_name
        }))
        const insertResult = await supabase
          .from('profile_languages')
          .insert(languagesWithProfile)
        if (insertResult.error) throw insertResult.error
      }
      toast.success('Languages updated successfully')
      onSave()
      onClose()
    } catch (error: any) {
      console.error('Error saving languages:', error)
      toast.error(error.message || 'Failed to save languages')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSave()
  }

  const handleLanguageSelect = (selectedOption: LanguageOption | null) => {
    setNewLanguage(selectedOption)
  }

  const customStyles = {
    control: (provided: any, state: any) => ({
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
    valueContainer: (provided: any) => ({
      ...provided,
      padding: '0 12px',
      height: '38px'
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: 'hsl(222.2 84% 4.9%)'
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: 'hsl(215.4 16.3% 46.9%)',
      fontSize: '14px'
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'hsl(0 0% 100%)',
      border: '1px solid hsl(214.3 31.8% 91.4%)',
      borderRadius: '6px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999,
      pointerEvents: 'auto',
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: '4px',
      maxHeight: '300px',
      overflowY: 'auto',
      pointerEvents: 'auto',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'hsl(217 91% 60%)' : 'transparent',
      color: state.isFocused ? 'white' : 'hsl(222.2 84% 4.9%)',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'hsl(217 91% 60%)',
        color: 'white'
      }
    }),
    menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Languages className="w-5 h-5 text-teal-600" />
            Edit Languages
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Info Banner */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-teal-900">Add languages you speak</p>
                <p className="text-sm text-teal-700 mt-1">
                  Add all the languages you are comfortable communicating in.
                </p>
              </div>
            </div>
          </div>

          {/* Add New Language */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">
              Add Language
            </Label>
            <ReactSelect
              options={languageOptions}
              onChange={handleLanguageSelect}
              placeholder="Select or type a language..."
              isClearable
              isSearchable
              value={newLanguage}
              styles={customStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
            />
            <Button
              type="button"
              onClick={handleAddLanguage}
              disabled={!newLanguage}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Language
            </Button>
          </div>

          {/* Selected Languages */}
          {selectedLanguages.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Your Languages ({selectedLanguages.length})
              </Label>
              <div className="space-y-3">
                {selectedLanguages.map((language) => (
                  <div
                    key={language.language_name}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">{language.language_name}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLanguage(language.language_name)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {selectedLanguages.length === 0 && (
            <div className="text-center py-8">
              <Languages className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No languages added yet</p>
              <p className="text-sm text-gray-500">Add languages you speak above</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-teal-600 text-white hover:bg-teal-700"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 