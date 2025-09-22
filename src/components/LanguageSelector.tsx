import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe } from 'lucide-react';

export type Language = 'en' | 'yo' | 'ha' | 'ig';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  className?: string;
}

const languages = [
  { code: 'en' as Language, name: 'English', native: 'English' },
  { code: 'yo' as Language, name: 'Yoruba', native: 'Yorùbá' },
  { code: 'ha' as Language, name: 'Hausa', native: 'Hausa' },
  { code: 'ig' as Language, name: 'Igbo', native: 'Igbo' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  const currentLanguage = languages.find(lang => lang.code === value);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={className}>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <SelectValue>
            {currentLanguage ? `${currentLanguage.name} (${currentLanguage.native})` : 'Select Language'}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex flex-col">
              <span className="font-medium">{language.name}</span>
              <span className="text-sm text-muted-foreground">{language.native}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};