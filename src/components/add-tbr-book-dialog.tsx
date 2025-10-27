import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { WishlistBook } from "../types/book";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { BookPlus } from "lucide-react";

interface AddTBRBookDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: Omit<WishlistBook, "id">, type: "owned" | "wishlisted") => void;
}

export function AddTBRBookDialog({ isOpen, onClose, onAdd }: AddTBRBookDialogProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("Fiction");
  const [cover, setCover] = useState("");
  const [type, setType] = useState<"owned" | "wishlisted">("wishlisted");
  const [buyLink, setBuyLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !author) return;

    const newBook: Omit<WishlistBook, "id"> = {
      title,
      author,
      genre,
      cover: cover || `https://source.unsplash.com/400x600/?book,${genre.toLowerCase()}`,
      buyLink: buyLink || undefined,
    };

    onAdd(newBook, type);
    
    // Reset form
    setTitle("");
    setAuthor("");
    setGenre("Fiction");
    setCover("");
    setType("wishlisted");
    setBuyLink("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-primary" />
            Add Book to TBR
          </DialogTitle>
          <DialogDescription>
            Add a new book to your To Be Read list
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger id="genre">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fiction">Fiction</SelectItem>
                <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                <SelectItem value="Mystery">Mystery</SelectItem>
                <SelectItem value="Fantasy">Fantasy</SelectItem>
                <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                <SelectItem value="Romance">Romance</SelectItem>
                <SelectItem value="Biography">Biography</SelectItem>
                <SelectItem value="History">History</SelectItem>
                <SelectItem value="Self-Help">Self-Help</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownership">Ownership Status</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger id="ownership">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wishlisted">🎁 Wishlisted (want to buy)</SelectItem>
                <SelectItem value="owned">📚 Owned (already have)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover">Cover Image URL (optional)</Label>
            <Input
              id="cover"
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              type="url"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use a default cover
            </p>
          </div>

          {type === "wishlisted" && (
            <div className="space-y-2">
              <Label htmlFor="buyLink">Purchase Link (optional)</Label>
              <Input
                id="buyLink"
                value={buyLink}
                onChange={(e) => setBuyLink(e.target.value)}
                placeholder="https://amazon.com/..."
                type="url"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Book
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
