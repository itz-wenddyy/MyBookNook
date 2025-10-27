import { Star } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Book } from "../types/book";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
  showLoanedBadge?: boolean;
}

const statusColors = {
  owned: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  reading: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  finished: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
};

const statusLabels = {
  owned: "Owned",
  reading: "Reading",
  finished: "Finished",
};

export function BookCard({ book, onClick, showLoanedBadge }: BookCardProps) {
  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border bg-card"
      onClick={onClick}
    >
      <div className="aspect-[2/3] overflow-hidden bg-muted relative">
        <ImageWithFallback
          src={book.cover}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {book.status && (
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className={statusColors[book.status]}
            >
              {statusLabels[book.status]}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="line-clamp-1">{book.title}</h3>
        <p className="text-muted-foreground line-clamp-1">{book.author}</p>
        {book.rating !== undefined && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < book.rating!
                    ? "fill-accent text-accent"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        )}
        {showLoanedBadge && book.loaned && (
          <span className="inline-block px-2 py-1 rounded-md bg-accent/30 text-accent-foreground">
            Loaned
          </span>
        )}
      </div>
    </Card>
  );
}