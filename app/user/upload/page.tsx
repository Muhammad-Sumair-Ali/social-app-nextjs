"use client";

import type React from "react";
import { useState, useRef } from "react";
import {
  Camera,
  X,
  Upload,
  FileImage,
  ImageIcon,
  VideoIcon,
  AlertCircle,
  ArrowRight,
  Clock,
  Maximize2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import axios from "axios";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<"upload" | "preview">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size - limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);

    reader.onload = () => {
      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(100);
        setMediaPreview(reader.result as string);
        setMediaType(file.type.startsWith("video/") ? "video" : "image");
        setError("");
        setIsUploading(false);
        setActiveTab("preview");
      }, 1000);
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Check file size - limit to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum size is 10MB.");
      return;
    }

    simulateUpload(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim() || !mediaPreview) {
      setError("Please add both caption and media");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/posts/create", {
        caption,
        mediaBase64: mediaPreview,
        mediaType,
      });
      console.log("Post created", response.data);
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Error creating post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto ">
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="sr-only bg-gradient-to-r from-primary/10 to-primary/5 border-b"></CardHeader>

        <CardContent className="p-4">
          {error && (
            <Alert
              variant="destructive"
              className="mb-6 animate-in fade-in-50 slide-in-from-top-5 duration-300"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 px-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium" htmlFor="caption">
                  Caption
                </label>
                <Badge variant="outline" className="text-xs font-normal">
                  Required
                </Badge>
              </div>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="What's on your mind? Share your story..."
                className="resize-none transition-all focus-visible:ring-primary"
                rows={3}
              />
            </div>

            <div>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              <Tabs
                defaultValue="upload"
                value={activeTab}
                onValueChange={(value: any) =>
                  setActiveTab(value as "upload" | "preview")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger
                    value="upload"
                    disabled={isUploading}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    disabled={!mediaPreview}
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-0">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg transition-all duration-200",
                      isDragging
                        ? "border-primary bg-primary/5 scale-[0.99]"
                        : "border-muted-foreground/20 hover:border-primary/50 hover:bg-slate-50/50"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center py-12 px-6 bg-slate-50 rounded-lg">
                      {isUploading ? (
                        <div className="w-full max-w-xs flex flex-col items-center">
                          <div className="mb-4 p-6 rounded-full bg-primary/10 animate-pulse">
                            <Loader2 className="w-12 h-12 text-primary animate-spin" />
                          </div>
                          <h3 className="text-xl font-semibold mb-4">
                            Uploading media...
                          </h3>
                          <Progress
                            value={uploadProgress}
                            className="w-full h-2 mb-2"
                          />
                          <p className="text-sm text-muted-foreground">
                            {Math.round(uploadProgress)}% complete
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="mb-4 p-6 rounded-full bg-slate-100 group-hover:bg-primary/10 transition-colors">
                            <FileImage className="w-12 h-12 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            Select media to upload
                          </h3>
                          <p className="text-muted-foreground text-center mb-6 max-w-md">
                            Or drag and drop files here. You can upload images
                            or videos up to 10MB.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-primary hover:bg-primary/90 gap-2"
                            >
                              <Upload className="h-4 w-4" />
                              Select files
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="gap-2"
                            >
                              <Camera className="h-4 w-4" />
                              Use camera
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-0">
                  {mediaPreview && (
                    <div className="relative rounded-lg overflow-hidden border border-muted group">
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("upload")}
                          className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Change media
                        </Button>
                      </div>

                      <div className="absolute top-2 right-2 z-20">
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setMediaPreview(null);
                            setMediaType(null);
                            setActiveTab("upload");
                          }}
                          className="rounded-full h-8 w-8 opacity-80 hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="absolute top-2 left-2 z-20">
                        <Badge
                          variant="secondary"
                          className="bg-black/50 text-white border-none"
                        >
                          {mediaType === "image" ? (
                            <div className="flex items-center gap-1">
                              <ImageIcon className="h-3 w-3" />
                              <span>Image</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <VideoIcon className="h-3 w-3" />
                              <span>Video</span>
                            </div>
                          )}
                        </Badge>
                      </div>

                      {mediaType === "image" ? (
                        <img
                          src={mediaPreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-64 object-cover"
                        />
                      ) : (
                        <video
                          src={mediaPreview}
                          className="w-full h-64 object-cover"
                          controls
                        />
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !mediaPreview}
              className="w-full gap-2 bg-primary hover:bg-primary/90 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <span>Create Post</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-4 justify-between border-t p-6 bg-slate-50/50">
          <MediaInfoItem
            icon={<FileImage className="w-4 h-4" />}
            title="File formats"
            description="Recommended: JPG, PNG, MP4. Other major formats are supported."
          />
          <MediaInfoItem
            icon={<Maximize2 className="w-4 h-4" />}
            title="Resolution"
            description="High-resolution recommended: 1080p, 1440p, 4K."
          />
          <MediaInfoItem
            icon={<Clock className="w-4 h-4" />}
            title="Size limit"
            description="Maximum size: 10MB per file."
          />
        </CardFooter>
      </Card>
    </div>
  );
}

function MediaInfoItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-help">
            {icon}
            <span>{title}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-slate-900 text-white border-slate-800"
        >
          <p className="max-w-xs">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
