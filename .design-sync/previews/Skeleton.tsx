import { Skeleton } from "gocivique-ui";

export const ProfileLoading = () => (
  <div className="flex max-w-sm items-center gap-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[160px]" />
    </div>
  </div>
);

export const TextLines = () => (
  <div className="max-w-sm space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);
