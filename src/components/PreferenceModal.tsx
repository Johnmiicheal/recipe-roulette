'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface PreferenceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PreferenceModal({ isOpen, onClose }: PreferenceModalProps) {
  const [dietPreference, setDietPreference] = useState<'vegan' | 'non-vegan'>('non-vegan')
  const [allergies, setAllergies] = useState<string[]>([])
  const [allergyInput, setAllergyInput] = useState('')

  useEffect(() => {
    const savedPreference = localStorage.getItem('tbti_user')
    const savedAllergies = localStorage.getItem('tbti_allergies')

    if (savedPreference) {
      setDietPreference(savedPreference as 'vegan' | 'non-vegan')
    }
    if (savedAllergies) {
      setAllergies(JSON.parse(savedAllergies))
    }
  }, [])

  const handleAllergyInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && allergyInput.trim()) {
      setAllergies([...allergies, allergyInput.trim()])
      setAllergyInput('')
    }
  }

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_, i) => i !== index))
  }

  const savePreferences = () => {
    localStorage.setItem('tbti_user', dietPreference)
    localStorage.setItem('tbti_allergies', JSON.stringify(allergies))
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>🍥 Dietary Preferences</DialogTitle>
          <DialogDescription className='mt-2'>
            Set your dietary preferences and allergies. This information will be saved locally.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={dietPreference}
            onValueChange={(value) => setDietPreference(value as 'vegan' | 'non-vegan')}
            className="grid grid-cols-2 gap-4"
          >
            <div className="cursor-pointer">
              <RadioGroupItem
                value="vegan"
                id="vegan"
                className="peer sr-only cursor-pointer"
              />
              <Label
                htmlFor="vegan"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-green-100 p-4 hover:bg-green-200 peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-300 [&:has([data-state=checked])]:border-green-500`}
              >
                <span className="text-2xl mb-2">🥬</span>
                Vegan
              </Label>
            </div>
            <div className="cursor-pointer">
              <RadioGroupItem
                value="non-vegan"
                id="non-vegan"
                className="peer sr-only cursor-pointer"
              />
              <Label
                htmlFor="non-vegan"
                className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-pink-100 p-4 hover:bg-pink-200 peer-data-[state=checked]:border-pink-500 peer-data-[state=checked]:bg-pink-300 [&:has([data-state=checked])]:border-pink-500`}
              >
                <span className="text-2xl mb-2">🍖</span>
                Non-Vegan
              </Label>
            </div>
          </RadioGroup>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <div className="flex space-x-2">
              <Input
                id="allergies"
                value={allergyInput}
                className="focus-visible:ring-pink-500"
                onChange={(e) => setAllergyInput(e.target.value)}
                onKeyPress={handleAllergyInput}
                placeholder="Type and press Enter"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="bg-pink-100 text-pink-800 text-xs font-medium mr-2 px-2.5 py-1.5 rounded-full flex items-center"
                >
                  {allergy}
                  <button
                    onClick={() => removeAllergy(index)}
                    className="ml-1 text-pink-600 hover:text-pink-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={savePreferences} className="bg-pink-100 text-pink-500 rounded-full hover:bg-pink-200">Save Preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

