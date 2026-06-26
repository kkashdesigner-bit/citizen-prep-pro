import { Avatar, AvatarFallback } from "gocivique-ui";

export const Initials = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarFallback>MD</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback className="bg-secondary text-secondary-foreground">SK</AvatarFallback>
    </Avatar>
  </div>
);

export const Sizes = () => (
  <div className="flex items-center gap-3">
    <Avatar className="h-8 w-8">
      <AvatarFallback className="text-xs">JD</AvatarFallback>
    </Avatar>
    <Avatar className="h-10 w-10">
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <Avatar className="h-14 w-14">
      <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
    </Avatar>
  </div>
);
