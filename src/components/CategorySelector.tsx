import { Category, DB_CATEGORIES, CATEGORY_LABELS } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, Landmark, Scale, GraduationCap, Home, Vote, Users } from 'lucide-react';

interface CategorySelectorProps {
  onSelect: (category: Category) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Principles: BookOpen,
  Institutions: Landmark,
  Rights: Scale,
  History: GraduationCap,
  Living: Home,
  Politics: Vote,
  Society: Users,
};

export default function CategorySelector({ onSelect }: CategorySelectorProps) {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {DB_CATEGORIES.map((category) => {
        const Icon = CATEGORY_ICONS[category] || BookOpen;
        const label = CATEGORY_LABELS[language]?.[category as Category] || category;

        return (
          <Card
            key={category}
            className="cursor-pointer border-2 border-border transition-all hover:border-primary/50 hover:bg-primary/5"
            onClick={() => onSelect(category as Category)}
          >
            <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
