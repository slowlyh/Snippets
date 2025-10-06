import { Search, Code2, Github, Plus, Menu, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/theme";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Header = ({ searchQuery, onSearchChange }: HeaderProps) => {
  const { theme, setTheme } = useTheme(); // ✅ pakai ThemeProvider
  const [open, setOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="search"]')?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold hidden sm:inline">
              CodeSnippets
            </span>
          </Link>

          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search snippets... (⌘K)"
                className="pl-10 pr-16"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Link to="/add" className="hidden md:inline-flex">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Snippet
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:inline-flex"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <a
                href="https://github.com/slowlyh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View on GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <nav className="flex flex-col gap-4 mt-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search snippets..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                    />
                  </div>

                  <Link to="/add" onClick={() => setOpen(false)}>
                    <Button className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Add Snippet
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={toggleTheme}
                  >
                    {theme === "light" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    Toggle Theme
                  </Button>

                  <Button variant="outline" className="w-full gap-2" asChild>
                    <a
                      href="https://github.com/slowlyh"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-5 w-5" />
                      View on GitHub
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
