import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

interface PlaceCardProps {
  initials: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function PlaceCard({
  initials,
  title,
  description,
  onClick,
}: PlaceCardProps) {
  return (
    <Card
      className="w-full cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 rounded bg-[#BDBDBD]">
              <AvatarFallback className="bg-[#BDBDBD] text-white font-normal text-xl leading-5 tracking-[0.14px]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h3 className="flex-1 text-xl font-medium leading-[32px] tracking-[0.15px] text-[rgba(0,0,0,0.87)]">
              {title}
            </h3>
          </div>
          <p className="text-base font-normal leading-6 tracking-[0.15px] text-[rgba(0,0,0,0.60)]">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
