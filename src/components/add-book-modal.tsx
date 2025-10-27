import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Book } from "../types/book";
import { useState } from "react";
import { fetchBookCover } from "../services/book-cover-service";
import { Loader2, Search } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (book: Omit<Book, "id" | "dateAdded">) => void;
}

const GENRES = [
  "Fiction",
  "Fantasy",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Thriller",
  "Non-Fiction",
  "Biography",
  "History",
  "Self-Help",
];

const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1661936901394-a993c79303c7?w=400",
  "https://images.unsplash.com/photo-1755541608494-5c02cf56e1f4?w=400",
  "https://images.unsplash.com/photo-1604435062356-a880b007922c?w=400",
  "https://images.unsplash.com/photo-1486821416551-68a65ef4d618?w=400",
  "https://images.unsplash.com/photo-1629237213606-4d894c8af292?w=400",
  "https://images.unsplash.com/photo-1760120482171-d9d5468f75fd?w=400",
];

export function AddBookModal({ isOpen, onClose, onAdd }: AddBookModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState<"owned" | "reading" | "finished">("owned");
  const [totalPages, setTotalPages] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [previewCover, setPreviewCover] = useState("");

  const handleSearchCover = async () => {
    if (!title) {
      toast.error("Please enter a book title first");
      return;
    }

    setIsSearching(true);
    try {
      const result = await fetchBookCover(title, author);
      if (result && result.cover) {
        setCoverUrl(result.cover);
        setPreviewCover(result.cover);
        if (result.pageCount && !totalPages) {
          setTotalPages(result.pageCount.toString());
        }
        toast.success("Book cover found!");
      } else {
        toast.error("No cover found. You can enter a custom URL or leave blank.");
      }
    } catch (error) {
      toast.error("Failed to fetch book cover");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !genre) return;

    const pages = totalPages ? parseInt(totalPages) : undefined;
    const current = currentPage ? parseInt(currentPage) : undefined;

    onAdd({
      title,
      author,
      genre,
      cover: coverUrl || DEFAULT_COVERS[Math.floor(Math.random() * DEFAULT_COVERS.length)],
      rating: 0,
      notes: "",
      loaned: false,
      status,
      totalPages: pages,
      currentPage: current,
      isCurrentRead: status === "reading",
    });

    // Reset form
    setTitle("");
    setAuthor("");
    setGenre("");
    setCoverUrl("");
    setPreviewCover("");
    setStatus("owned");
    setTotalPages("");
    setCurrentPage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Add a book to your personal library by filling out the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
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
            <Select value={genre} onValueChange={setGenre} required>
              <SelectTrigger id="genre">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {GENRES.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="cover">Book Cover</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSearchCover}
                disabled={isSearching || !title}
                className="gap-1"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-3 h-3" />
                    Find Cover
                  </>
                )}
              </Button>
            </div>
            
            {previewCover && (
              <div className="flex justify-center py-2">
                <div className="w-32 h-48 rounded-lg overflow-hidden bg-muted shadow-md">
                  <ImageWithFallback
                    src={previewCover}
                    alt="Book cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            <Input
              id="cover"
              value={coverUrl}
              onChange={(e) => {
                setCoverUrl(e.target.value);
                setPreviewCover(e.target.value);
              }}
              placeholder="Or enter custom URL..."
            />
            <p className="text-sm text-muted-foreground">
              Click "Find Cover" to auto-fetch from Google Books
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus} required>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owned">Owned</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalPages">Total Pages (optional)</Label>
            <Input
              id="totalPages"
              value={totalPages}
              onChange={(e) => setTotalPages(e.target.value)}
              placeholder="Enter total pages"
              type="number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPage">Current Page (optional)</Label>
            <Input
              id="currentPage"
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value)}
              placeholder="Enter current page"
              type="number"
            />
          </div>

          <div className="flex gap-2 pt-4">
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