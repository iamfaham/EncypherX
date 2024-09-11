'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Copy, RefreshCw } from 'lucide-react'
import PasswordStrengthMeter from './PasswordStrengthMeter'

interface PasswordGeneratorProps {
    onGenerate: (password: string) => void;
  }

export default function PasswordGenerator({ onGenerate }: PasswordGeneratorProps) {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(12)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)

  const generatePassword = useCallback(() => {
    let charset = ''
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+{}[]|:;<>,.?/~'

    let newPassword = ''
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(newPassword)
    onGenerate(newPassword)
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password)
      .then(() => {
        // You could set a state here to show a "Copied!" message
      })
      .catch((err) => {
        console.error('Failed to copy: ', err)
      })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input value={password} readOnly className="flex-grow" />
        <Button onClick={copyToClipboard} size="icon" variant="outline">
          <Copy className="h-4 w-4" />
        </Button>
        <Button onClick={generatePassword} size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <PasswordStrengthMeter password={password} />
      <div className="space-y-2">
        <Label>Password Length: {length}</Label>
        <Slider
          value={[length]}
          onValueChange={(value) => setLength(value[0])}
          min={8}
          max={32}
          step={1}
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="uppercase"
            checked={includeUppercase}
            onCheckedChange={setIncludeUppercase}
          />
          <Label htmlFor="uppercase">Include Uppercase</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="lowercase"
            checked={includeLowercase}
            onCheckedChange={setIncludeLowercase}
          />
          <Label htmlFor="lowercase">Include Lowercase</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="numbers"
            checked={includeNumbers}
            onCheckedChange={setIncludeNumbers}
          />
          <Label htmlFor="numbers">Include Numbers</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="symbols"
            checked={includeSymbols}
            onCheckedChange={setIncludeSymbols}
          />
          <Label htmlFor="symbols">Include Symbols</Label>
        </div>
      </div>
      <Button onClick={generatePassword} className="w-full">
        Generate Password
      </Button>
    </div>
  )
}