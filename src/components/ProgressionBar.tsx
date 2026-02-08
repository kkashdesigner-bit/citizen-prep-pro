import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';

interface ProgressionBarProps {
  usedCount: number;
  totalCount: number;
}

export default function ProgressionBar({ usedCount, totalCount }: ProgressionBarProps) {
  const percentage = totalCount > 0 ? Math.round((usedCount / totalCount) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif text-lg">
          <BarChart className="h-5 w-5 text-primary" />
          Progression dans la banque de questions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted-foreground">
            {usedCount}/{totalCount} questions complétées
          </span>
          <span className="font-medium text-foreground">{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-4" />
      </CardContent>
    </Card>
  );
}
