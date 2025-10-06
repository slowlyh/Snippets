import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, Eye } from "lucide-react";
import { toast } from "sonner";

interface Author {
  name: string;
  url?: string;
}

interface SnippetCardProps {
  title: string;
  description: string;
  language: string;
  code: string;
  author: Author;
  date: string;
  onClick: () => void;
}

export const SnippetCard = ({
  title,
  description,
  language,
  code,
  author,
  date,
  onClick,
}: SnippetCardProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Snippet downloaded!");
  };

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-1 truncate group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
          <Badge variant="secondary" className="language-badge shrink-0">
            {language.toUpperCase()}
          </Badge>
        </div>

        <div className="code-block mb-4">
          <pre className="text-sm">
            <code className="line-clamp-3">{code}</code>
          </pre>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>
              by{" "}
              {author.url ? (
                <a
                  href={author.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {author.name}
                </a>
              ) : (
                author.name
              )}
            </span>
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8 w-8 p-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-3">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
