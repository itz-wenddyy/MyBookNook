import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { BookOpen } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface QuickReadingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPages: (pages: number, notes?: string) => void;
  currentBookTitle?: string;
  currentPage?: number;
}

export function QuickReadingDialog({
  isOpen,
  onClose,
  onAddPages,
  currentBookTitle,
  currentPage = 0,
}: QuickReadingDialogProps) {
  const [startPage, setStartPage] = useState(currentPage);
  const [endPage, setEndPage] = useState(currentPage);
  const [notes, setNotes] = useState("");

  // Update start and end pages when dialog opens or current page changes
  useEffect(() => {
    if (isOpen) {
      setStartPage(currentPage);
      setEndPage(currentPage);
    }
  }, [isOpen, currentPage]);

  const pagesRead = Math.max(0, endPage - startPage);

  const handleSaveReading = () => {
    if (pagesRead > 0) {
      onAddPages(pagesRead, notes);
      toast.success(`Added ${pagesRead} pages to today's reading!`);
      onClose();
      // Reset form
      setStartPage(currentPage);
      setEndPage(currentPage);
      setNotes("");
    } else {
      toast.error("End page must be greater than start page");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Today's Reading
          </DialogTitle>
          <DialogDescription>
            {currentBookTitle ? `Reading: ${currentBookTitle}` : "Log your reading progress"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Start Page */}
          <div className="space-y-2">
            <Label htmlFor="startPage">Start Page</Label>
            <Input
              id="startPage"
              type="number"
              min="0"
              value={startPage}
              onChange={(e) => setStartPage(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="Enter start page"
            />
          </div>

          {/* End Page */}
          <div className="space-y-2">
            <Label htmlFor="endPage">End Page</Label>
            <Input
              id="endPage"
              type="number"
              min="0"
              value={endPage}
              onChange={(e) => setEndPage(Math.max(0, parseInt(e.target.value) || 0))}
              placeholder="Enter end page"
            />
          </div>

          {/* Auto-calculated Pages Read */}
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pages Read Today:</span>
              <span className="text-lg text-primary">{pagesRead}</span>
            </div>
          </div>

          {/* Optional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Favorite line from today's reading..."
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Save Button */}
          <Button 
            onClick={handleSaveReading} 
            className="w-full"
            disabled={pagesRead <= 0}
          >
            Save Reading
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}