"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Upload, Check, ImageIcon, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCurrentLogo();
  }, []);

  const fetchCurrentLogo = async () => {
    try {
      const response = await fetch("/api/settings/logo");
      const data = await response.json();
      if (data.logoUrl) {
        setLogoUrl(data.logoUrl);
      }
    } catch (err) {
      console.error("Error fetching logo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, SVG)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const supabase = createClient();
      if (!supabase) {
        setError("Storage service is not configured");
        return;
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `logo.${fileExt}`;

      const { error: deleteError } = await supabase.storage
        .from("site-assets")
        .remove(["logo.png", "logo.jpg", "logo.jpeg", "logo.svg", "logo.webp"]);

      if (deleteError) {
        console.log("No existing logo to delete or error:", deleteError);
      }

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          setError("Storage bucket not configured. Please create a 'site-assets' bucket in Supabase.");
        } else {
          setError(uploadError.message);
        }
        return;
      }

      const { data: urlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(fileName);

      setLogoUrl(urlData.publicUrl);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload logo. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveLogo = async () => {
    setUploading(true);
    setError("");

    try {
      const supabase = createClient();
      if (!supabase) {
        setError("Storage service is not configured");
        return;
      }

      const { error: deleteError } = await supabase.storage
        .from("site-assets")
        .remove(["logo.png", "logo.jpg", "logo.jpeg", "logo.svg", "logo.webp"]);

      if (deleteError) {
        setError(deleteError.message);
        return;
      }

      setLogoUrl(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to remove logo. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-gray-600">Customize your website appearance</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 lg:px-8 py-8">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Website Logo</CardTitle>
            <CardDescription>
              Upload a logo to display in the header. Recommended size: 200x50 pixels. Max file size: 2MB.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <Check className="h-4 w-4" />
                Changes saved successfully!
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="w-48 h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
                {loading ? (
                  <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                ) : logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt="Website Logo"
                    width={180}
                    height={80}
                    className="object-contain max-h-20"
                    unoptimized
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-xs text-gray-400 mt-1">No logo</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label htmlFor="logo-upload">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploading}
                    className="cursor-pointer"
                    asChild
                  >
                    <span>
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </>
                      )}
                    </span>
                  </Button>
                </label>

                {logoUrl && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={handleRemoveLogo}
                    disabled={uploading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Logo
                  </Button>
                )}
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
              <div className="bg-white border rounded-lg p-4">
                <div className="flex items-center gap-2">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt="Logo Preview"
                      width={120}
                      height={40}
                      className="object-contain max-h-10"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg" />
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Online School
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
