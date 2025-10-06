import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, Download, Code, X, Share2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface Author {
  name: string;
  url?: string;
}

interface SnippetDetailProps {
  title: string;
  description: string;
  language: string;
  code: string;
  author: Author;
  date: string;
  onClose: () => void;
}

export const SnippetDetail = ({
  title,
  description,
  language,
  code,
  author,
  date,
  onClose,
}: SnippetDetailProps) => {
  const [wrap, setWrap] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const handleDownload = () => {
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

  const handleEmbed = () => {
    const embedCode = `<iframe src="${window.location.href}" width="100%" height="400"></iframe>`;
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied!");
  };

  const handleRaw = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="snippet-title"
    >
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Card
            className="w-full max-w-4xl relative animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute right-4 top-4 h-9 w-9"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 id="snippet-title" className="text-2xl sm:text-3xl font-bold mb-2">
                    {title}
                  </h1>
                  <p className="text-muted-foreground">{description}</p>
                </div>
                <Badge className="language-badge shrink-0">{language.toUpperCase()}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6 text-sm text-muted-foreground">
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
                <span>•</span>
                <span>{date}</span>
              </div>

              <Accordion
                type="multiple"
                defaultValue={["code", "description"]}
                className="mb-6"
              >
                <AccordionItem value="description">
                  <AccordionTrigger className="text-base sm:text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Description
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{description}</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="code">
                  <AccordionTrigger className="text-base sm:text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Code
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="mb-3 flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setWrap(!wrap)}
                        className="text-xs"
                      >
                        {wrap ? "Scroll" : "Wrap"}
                      </Button>
                    </div>
                    <div className="code-block">
                      <pre className={`text-sm ${wrap ? "whitespace-pre-wrap" : ""}`}>
                        <code>{code}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button onClick={handleCopy} className="gap-2 flex-1 sm:flex-none min-w-[120px]">
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="secondary"
                  className="gap-2 flex-1 sm:flex-none"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button onClick={handleRaw} variant="outline" className="gap-2">
                  Raw
                </Button>
                <Button onClick={handleEmbed} variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Embed
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
