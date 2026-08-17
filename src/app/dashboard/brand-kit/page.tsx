"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function BrandKitPage() {
  const [formData, setFormData] = useState({
    logoUrl: "",
    colors: "",
    tone: "",
    cta: "",
    restrictions: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadBrandKit() {
      try {
        const res = await fetch("/api/workspaces/brand");
        if (res.ok) {
          const data = await res.json();
          if (data.brandKit) {
            setFormData({
              logoUrl: data.brandKit.logoUrl || "",
              colors: data.brandKit.colors || "",
              tone: data.brandKit.tone || "",
              cta: data.brandKit.cta || "",
              restrictions: data.brandKit.restrictions || ""
            });
          }
        }
      } catch (e) {
        console.error("Failed to load brand kit", e);
      } finally {
        setLoading(false);
      }
    }
    loadBrandKit();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/workspaces/brand", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save brand kit");
      
      setMessage("Brand kit updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Brand Kit</CardTitle>
          <CardDescription>
            Configure your brand identity. Our AI uses these rules when generating content for you.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSave}>
          <CardContent className="space-y-6">
            {message && (
              <div className={`p-3 text-sm rounded-md ${message.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                {message}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="logoUrl">
                Logo URL (Optional)
              </label>
              <Input
                id="logoUrl"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="colors">
                Brand Colors (Hex codes)
              </label>
              <Input
                id="colors"
                placeholder="#FF0000, #00FF00"
                value={formData.colors}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="tone">
                Brand Tone of Voice
              </label>
              <Input
                id="tone"
                placeholder="e.g. Professional but approachable, slightly humorous"
                required
                value={formData.tone}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="cta">
                Default Call-to-Action (Optional)
              </label>
              <Input
                id="cta"
                placeholder="e.g. Visit the link in our bio to learn more!"
                value={formData.cta}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="restrictions">
                Brand Restrictions / Prohibited phrases
              </label>
              <Input
                id="restrictions"
                placeholder="e.g. Do not use slang, do not mention competitors"
                value={formData.restrictions}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Brand Kit"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
