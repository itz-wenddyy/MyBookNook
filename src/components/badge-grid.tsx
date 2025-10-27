import { Badge } from "../types/book";
import { Card } from "./ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Lock } from "lucide-react";

interface BadgeGridProps {
  badges: Badge[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  const earnedBadges = badges.filter((b) => b.earned);
  const lockedBadges = badges.filter((b) => !b.earned);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="mb-4 text-muted-foreground">
            Earned Badges ({earnedBadges.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {earnedBadges.map((badge) => (
              <TooltipProvider key={badge.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Card className="p-4 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30">
                        <div className="text-center space-y-2">
                          <div className="text-4xl">{badge.icon}</div>
                          <h4 className="text-sm">{badge.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {badge.description}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Earned {formatDate(badge.earnedDate)} – {badge.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <div>
          <h3 className="mb-4 text-muted-foreground">
            Locked Badges ({lockedBadges.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {lockedBadges.map((badge) => (
              <TooltipProvider key={badge.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Card className="p-4 hover:shadow-md transition-all cursor-pointer bg-muted/30 border-muted opacity-60">
                        <div className="text-center space-y-2">
                          <div className="relative">
                            <div className="text-4xl filter grayscale opacity-40">
                              {badge.icon}
                            </div>
                            <Lock className="w-4 h-4 absolute top-0 right-0 text-muted-foreground" />
                          </div>
                          <h4 className="text-sm text-muted-foreground">
                            {badge.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {badge.description}
                          </p>
                        </div>
                      </Card>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{badge.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No badges available yet. Start reading to earn badges!</p>
        </div>
      )}
    </div>
  );
}