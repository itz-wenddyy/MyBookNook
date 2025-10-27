/**
 * Service for fetching real book covers from Google Books API
 */

export interface BookCoverResult {
  cover: string;
  thumbnail: string;
  description?: string;
  isbn?: string;
  pageCount?: number;
}

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

/**
 * Fetch book cover and metadata from Google Books API
 * @param title - Book title
 * @param author - Book author (optional, improves accuracy)
 */
export async function fetchBookCover(
  title: string,
  author?: string
): Promise<BookCoverResult | null> {
  try {
    const query = author ? `${title} ${author}` : title;
    const response = await fetch(
      `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=1`
    );
    
    if (!response.ok) {
      console.warn("Google Books API request failed");
      return null;
    }

    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.warn(`No results found for: ${title}`);
      return null;
    }

    const book = data.items[0].volumeInfo;
    const imageLinks = book.imageLinks;
    
    if (!imageLinks) {
      return null;
    }

    // Get the highest quality image available
    const cover = imageLinks.large || imageLinks.medium || imageLinks.small || imageLinks.thumbnail;
    const thumbnail = imageLinks.thumbnail || imageLinks.smallThumbnail;
    
    // Convert http to https for security
    const secureCover = cover?.replace("http://", "https://");
    const secureThumbnail = thumbnail?.replace("http://", "https://");

    return {
      cover: secureCover || "",
      thumbnail: secureThumbnail || "",
      description: book.description,
      isbn: book.industryIdentifiers?.[0]?.identifier,
      pageCount: book.pageCount,
    };
  } catch (error) {
    console.error("Error fetching book cover:", error);
    return null;
  }
}

/**
 * Get a fallback cover color based on book title
 */
export function getFallbackCover(title: string): string {
  const colors = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  ];
  
  // Use title to consistently pick the same color
  const hash = title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}
