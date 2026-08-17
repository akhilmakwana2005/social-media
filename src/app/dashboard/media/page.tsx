'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  UploadCloud, 
  Image as ImageIcon, 
  Video, 
  File, 
  Loader2, 
  Search, 
  SlidersHorizontal, 
  Copy, 
  Check, 
  Trash2, 
  X, 
  Eye, 
  FolderPlus, 
  HardDrive, 
  Maximize2,
  Calendar,
  Grid
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface MediaAsset {
  id: string;
  storageKey: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'SIZE_LARGE' | 'SIZE_SMALL'>('NEWEST');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample mock assets to populate if user has no uploads yet
  const mockAssets: MediaAsset[] = [
    {
      id: 'mock-1',
      storageKey: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop',
      mimeType: 'image/jpeg',
      size: 1420500, // ~1.35 MB
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
    },
    {
      id: 'mock-2',
      storageKey: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop',
      mimeType: 'image/jpeg',
      size: 890400, // ~0.85 MB
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString() // 2 days ago
    },
    {
      id: 'mock-3',
      storageKey: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=600&auto=format&fit=crop',
      mimeType: 'image/jpeg',
      size: 1980300, // ~1.89 MB
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString() // 3 days ago
    }
  ];

  const fetchMedia = () => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.media && data.media.length > 0) {
          setMedia(data.media);
        } else {
          // If database is empty, pre-populate with mock samples for rich demonstration
          setMedia(mockAssets);
        }
      })
      .catch((err) => {
        console.error(err);
        setMedia(mockAssets);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        fetchMedia();
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        handleUpload(file);
      } else {
        alert('Only images and videos are supported!');
      }
    }
  };

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    // Check if it is a mock asset
    if (id.startsWith('mock-')) {
      setMedia((prev) => prev.filter((item) => item.id !== id));
      setSelectedAsset(null);
      return;
    }

    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        fetchMedia();
        setSelectedAsset(null);
      } else {
        alert('Delete failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting asset');
    }
  };

  // Clipboard copy handler
  const copyLink = (id: string, url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  // Calculate storage metrics
  const totalSize = media.reduce((acc, curr) => acc + curr.size, 0);
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
  const storageLimitMB = 100;
  const storagePercentage = Math.min((totalSize / (storageLimitMB * 1024 * 1024)) * 100, 100);

  // Filter and sort computation
  const filteredAndSortedMedia = media
    .filter((asset) => {
      // Search query filter
      const matchesSearch = asset.storageKey.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Type filter
      if (mediaTypeFilter === 'IMAGE') return matchesSearch && asset.mimeType.startsWith('image/');
      if (mediaTypeFilter === 'VIDEO') return matchesSearch && asset.mimeType.startsWith('video/');
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'NEWEST') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'OLDEST') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'SIZE_LARGE') return b.size - a.size;
      if (sortBy === 'SIZE_SMALL') return a.size - b.size;
      return 0;
    });

  return (
    <DashboardShell title="Media Library">
      <div className="space-y-8 max-w-[1400px] mx-auto">
        
        {/* Storage Health & Action Bar */}
        <div className="grid md:grid-cols-12 gap-6 items-center">
          
          {/* Storage Meter */}
          <Card hoverEffect={false} className="md:col-span-8 p-5 flex items-center gap-4 bg-white/40 border-slate-200/50 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center flex-shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Storage Used</span>
                <span className="text-slate-900 font-extrabold">{totalSizeMB} MB of {storageLimitMB} MB (Free Tier)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200/50 overflow-hidden">
                <div 
                  className="h-full gradient-bg rounded-full transition-all duration-500" 
                  style={{ width: `${storagePercentage}%` }}
                ></div>
              </div>
            </div>
          </Card>

          {/* Action button */}
          <div className="md:col-span-4 flex justify-end">
            <Button 
              variant="primary" 
              className="w-full md:w-auto px-6 py-2.5 gap-2"
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              <span>Upload Media</span>
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileInputChange}
            />
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/40 p-4 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search assets by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/80 border border-slate-200 focus:border-brand-indigo/60 focus:bg-white rounded-xl text-xs text-slate-800 transition-all focus:outline-none focus:ring-4 focus:ring-brand-indigo/5 placeholder:text-slate-400 shadow-sm"
            />
          </div>

          {/* Filter tabs & Sort */}
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
            
            {/* Type Filter Tab selector */}
            <div className="inline-flex rounded-xl bg-slate-100/80 p-0.5 border border-slate-200/40 text-2xs font-bold text-slate-500 shadow-sm">
              <button 
                onClick={() => setMediaTypeFilter('ALL')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mediaTypeFilter === 'ALL' ? 'bg-white text-slate-800 shadow-xs' : 'hover:text-slate-800'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setMediaTypeFilter('IMAGE')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mediaTypeFilter === 'IMAGE' ? 'bg-white text-slate-800 shadow-xs' : 'hover:text-slate-800'
                }`}
              >
                Images
              </button>
              <button 
                onClick={() => setMediaTypeFilter('VIDEO')}
                className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  mediaTypeFilter === 'VIDEO' ? 'bg-white text-slate-800 shadow-xs' : 'hover:text-slate-800'
                }`}
              >
                Videos
              </button>
            </div>

            {/* Sort selectors */}
            <div className="flex items-center gap-1.5 bg-white/85 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-2xs text-slate-500 font-bold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-800 font-extrabold focus:outline-none cursor-pointer"
              >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="SIZE_LARGE">Size (Largest)</option>
                <option value="SIZE_SMALL">Size (Smallest)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all duration-300 ${
            isDragActive 
              ? 'border-brand-indigo bg-brand-indigo/[0.03] scale-[0.99] shadow-inner' 
              : 'border-slate-300 bg-slate-55/30 hover:border-brand-indigo/40 hover:bg-slate-50/40'
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="w-10 h-10 text-brand-indigo animate-spin" />
              <p className="text-sm font-semibold text-slate-500">Retrieving media storage assets...</p>
            </div>
          ) : filteredAndSortedMedia.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
              <UploadCloud className="w-16 h-16 mb-4 text-slate-400 animate-float" />
              <p className="text-base font-extrabold text-slate-800 mb-2">No matching media files</p>
              <p className="text-xs text-slate-400">Drag and drop images or videos here, or search another term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredAndSortedMedia.map((asset) => {
                const isImage = asset.mimeType.startsWith('image/');
                const isSample = asset.id.startsWith('mock-');
                const fileFormat = asset.mimeType.split('/')[1]?.toUpperCase() || 'FILE';

                return (
                  <div 
                    key={asset.id} 
                    className="group border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 relative"
                  >
                    
                    {/* Media container */}
                    <div 
                      className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden cursor-pointer"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      {isImage ? (
                        <img 
                          src={asset.storageKey} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                            <Video className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fileFormat} Video</span>
                        </div>
                      )}
                      
                      {/* Format Badge Overlay */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[9px] font-extrabold shadow-sm">
                        {fileFormat}
                      </span>

                      {/* Sample badge indicator */}
                      {isSample && (
                        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-[9px] font-extrabold shadow-sm">
                          Sample
                        </span>
                      )}

                      {/* Hover controls overlay */}
                      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2.5">
                        <button 
                          className="w-8 h-8 rounded-full bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAsset(asset);
                          }}
                          title="Preview details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="w-8 h-8 rounded-full bg-white text-slate-700 hover:text-slate-900 flex items-center justify-center shadow-md active:scale-90 transition-transform cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyLink(asset.id, asset.storageKey);
                          }}
                          title="Copy file URL"
                        >
                          {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>

                    </div>

                    {/* Metadata Footer panel */}
                    <div className="p-3.5 border-t border-slate-50 flex items-center justify-between text-2xs font-semibold text-slate-400">
                      <span className="text-slate-800 font-bold">
                        {(asset.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        {new Date(asset.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Dotted drop area prompt */}
          {!loading && (
            <div className="mt-8 flex flex-col items-center justify-center text-slate-400 gap-1.5">
              <Grid className="w-5 h-5 text-slate-300" />
              <span className="text-2xs font-bold text-slate-400 uppercase tracking-widest">
                Drag & Drop files to upload instantly
              </span>
            </div>
          )}

        </div>

      </div>

      {/* Media Details Sidebar/Dialog Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <Card hoverEffect={false} className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left Column: Media Preview */}
            <div className="flex-1 bg-slate-50 flex items-center justify-center min-h-[300px] md:min-h-0 relative p-4 border-b md:border-b-0 md:border-r border-slate-150">
              {selectedAsset.mimeType.startsWith('image/') ? (
                <img 
                  src={selectedAsset.storageKey} 
                  alt="Asset Preview" 
                  className="max-w-full max-h-[60vh] md:max-h-[80vh] object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center shadow-sm">
                    <Video className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-bold text-slate-500">Video Player Mockup</span>
                </div>
              )}
              <button 
                onClick={() => window.open(selectedAsset.storageKey, '_blank')}
                className="absolute bottom-4 right-4 p-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 shadow-md active:scale-95 transition-transform flex items-center gap-1.5 text-2xs font-bold cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Open in tab</span>
              </button>
            </div>

            {/* Right Column: Metadata details & actions */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Asset Details</h3>
                    <span className="text-[10px] font-extrabold text-brand-indigo bg-brand-indigo/10 border border-brand-indigo/15 px-2 py-0.5 rounded mt-1.5 inline-block uppercase">
                      {selectedAsset.mimeType.split('/')[1]?.toUpperCase() || 'FILE'}
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedAsset(null)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <hr className="border-slate-100" />

                {/* Details list */}
                <div className="space-y-4 text-xs font-semibold text-slate-500">
                  <div className="space-y-1">
                    <span className="text-2xs text-slate-400 uppercase tracking-wider block">File Path</span>
                    <span className="text-slate-800 break-all select-all block bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[10px] leading-relaxed">
                      {selectedAsset.storageKey}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size</span>
                    <span className="text-slate-800 font-bold">{(selectedAsset.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created Date</span>
                    <span className="text-slate-800 font-bold">
                      {new Date(selectedAsset.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions</span>
                    <span className="text-slate-800 font-bold">Auto-detected (Original)</span>
                  </div>
                </div>
              </div>

              {/* Actions panel */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100">
                <Button 
                  variant="outline" 
                  className="w-full text-xs gap-1.5 bg-white border-slate-200"
                  onClick={() => copyLink(selectedAsset.id, selectedAsset.storageKey)}
                >
                  {copiedId === selectedAsset.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                  <span>{copiedId === selectedAsset.id ? 'URL Copied!' : 'Copy Resource URL'}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-xs gap-1.5 text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 shadow-sm"
                  onClick={() => handleDelete(selectedAsset.id)}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Asset</span>
                </Button>
              </div>

            </div>

          </Card>
        </div>
      )}

    </DashboardShell>
  );
}
