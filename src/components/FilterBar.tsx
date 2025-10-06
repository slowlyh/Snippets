import { Button } from "@/components/ui/button";

interface FilterBarProps {
  languages: string[];
  selectedLanguage: string | null;
  onLanguageSelect: (language: string | null) => void;
}


export const FilterBar = ({ languages, selectedLanguage, onLanguageSelect }: FilterBarProps) => {
  return (
    <div className="border-b bg-muted/30">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
          <span className="text-sm font-medium text-muted-foreground mr-2 shrink-0">
            Filter:
          </span>
          <Button
            variant={selectedLanguage === null ? "default" : "outline"}
            size="sm"
            onClick={() => onLanguageSelect(null)}
            className="h-9 shrink-0 snap-start min-w-[60px]"
          >
            All
          </Button>
          {languages.map((lang) => (
            <Button
              key={lang}
              variant={selectedLanguage === lang ? "default" : "outline"}
              size="sm"
              onClick={() => onLanguageSelect(lang)}
              className="h-9 shrink-0 snap-start"
            >
              {lang}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
