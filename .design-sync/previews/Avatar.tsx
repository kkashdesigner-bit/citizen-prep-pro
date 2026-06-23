import { Avatar, AvatarImage, AvatarFallback } from "gocivique-ui";

export const Initials = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarFallback>MD</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>JL</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>SK</AvatarFallback>
    </Avatar>
  </div>
);

export const WithImage = () => (
  <div className="flex items-center gap-3">
    <Avatar>
      <AvatarImage src="https://i.pravatar.cc/96?img=12" alt="Candidate" />
      <AvatarFallback>MD</AvatarFallback>
    </Avatar>
    <div className="text-sm">
      <div className="font-medium">Marianne Dupont</div>
      <div className="text-muted-foreground">Parcours Naturalisation</div>
    </div>
  </div>
);
