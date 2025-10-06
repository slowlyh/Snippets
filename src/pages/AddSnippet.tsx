import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { createSnippet } from "@/lib/gist";

const AddSnippet = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorUrl, setAuthorUrl] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!language.trim()) newErrors.language = "Language is required";
    if (!code.trim()) newErrors.code = "Code is required";
    if (!authorName.trim()) newErrors.authorName = "Author name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    try {
      await createSnippet({
        title: title.trim(),
        description: description.trim(),
        language: language.trim(),
        code,
        tags: tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        author: {
          name: authorName.trim(),
          url: authorUrl.trim() || undefined
        }
      });
      toast.success("Snippet created on Gist!");
      navigate("/");
    } catch (e: any) {
      toast.error(e.message || "Failed to create snippet");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header searchQuery={""} onSearchChange={() => {}} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to snippets
          </Link>
          <h1 className="text-4xl font-bold mb-2">Add New Snippet</h1>
          <p className="text-muted-foreground">
            Share your code with the community (stored on GitHub Gist)
          </p>
        </div>

        <Tabs defaultValue="edit" className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview" disabled={!code}>
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="space-y-6">
            <Card className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Debounce in JS"
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language *</Label>
                  <Input
                    id="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    placeholder="TypeScript"
                  />
                  {errors.language && (
                    <p className="text-sm text-destructive">
                      {errors.language}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short explanation of what this snippet does"
                  rows={3}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="utility, hooks, array"
                />
              </div>

              {/* 🔥 New author fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name *</Label>
                  <Input
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Hyuu"
                  />
                  {errors.authorName && (
                    <p className="text-sm text-destructive">
                      {errors.authorName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="authorUrl">Author URL (optional)</Label>
                  <Input
                    id="authorUrl"
                    value={authorUrl}
                    onChange={(e) => setAuthorUrl(e.target.value)}
                    placeholder="https://github.com/slowlyh"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Your code here..."
                rows={16}
                className="font-mono"
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code}</p>
              )}
            </Card>

            <div className="flex gap-3">
              <Button onClick={handleSubmit} className="gap-2">
                <Save className="h-4 w-4" />
                Save to Gist
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <Card className="p-6">
              <pre className="overflow-auto text-sm">
                <code>{code}</code>
              </pre>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-sm text-muted-foreground text-center mt-4">
          * Required fields
        </p>
      </main>
    </div>
  );
};

export default AddSnippet;
