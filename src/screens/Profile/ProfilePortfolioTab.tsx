import React, { useState, useRef, useEffect } from "react";
import { Badge } from "../../components/ui/badge";
import { supabase } from "../../lib/supabase";
import Masonry from "react-masonry-css";
import { Button } from "../../components/ui/button";
import { Upload } from "lucide-react";

export type GalleryImage = {
  id: string;
  image_url: string;
  title: string;
  photographer: string;
  profile_pic: string | null;
  user_id: string | null;
  created_at?: string;
};

interface ProfilePortfolioTabProps {
  userId: string;
}

export const ProfilePortfolioTab: React.FC<ProfilePortfolioTabProps> = ({ userId }) => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<{ open: boolean; image: GalleryImage } | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadForm, setUploadForm] = useState({ title: "", file: null as File | null });
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  // Fetch only this user's images
  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching images:', error);
        return;
      }
      setGalleryImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  useEffect(() => {
    if (userId) fetchImages();
  }, [userId]);

  // Handle upload form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "file" && files) setUploadForm((f) => ({ ...f, file: files[0] }));
    else setUploadForm((f) => ({ ...f, [name]: value }));
  };

  // Handle upload submit
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setUploadError(null);
    if (!uploadForm.file || !uploadForm.title) {
      setUploadError("Please provide an image and a title.");
      setUploading(false);
      return;
    }
    try {
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('gallery')
        .upload(fileName, uploadForm.file, { upsert: false });
      if (storageError) {
        throw storageError;
      }
      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(fileName);
      const imageUrl = publicUrlData.publicUrl;
      const insertData = {
        image_url: imageUrl,
        title: uploadForm.title,
        photographer: "Me",
        profile_pic: null,
        user_id: userId,
      };
      const { error: insertError } = await supabase.from('gallery_images').insert([insertData]);
      if (insertError) {
        throw insertError;
      }
      setShowUpload(false);
      setUploadForm({ title: "", file: null });
      fetchImages();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (imageId: string, fileName: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);
      if (storageError) throw storageError;
      const { error: deleteError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);
      if (deleteError) throw deleteError;
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1200: 3,
    900: 2,
    600: 1
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">My Portfolio</h2>
        <Button onClick={() => setShowUpload(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <Upload className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
      </div>
      <section className="w-full bg-neutral-900">
        <div className="w-full mx-auto px-2 sm:px-4 md:px-8">
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="gallery-masonry"
            columnClassName="gallery-masonry-column"
          >
            {galleryImages.map((image) => (
              <div key={image.id} className="mb-4 break-inside-avoid relative group">
                <div className="relative">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full max-w-full rounded-lg shadow-sm cursor-pointer"
                    style={{ display: 'block', width: '100%', borderRadius: '0.5rem' }}
                    loading="lazy"
                    draggable={false}
                    onClick={() => setLightbox({ open: true, image })}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this image?')) {
                        handleDeleteImage(image.id, image.image_url.split('/').pop() || "");
                      }
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </Masonry>
        </div>
      </section>
      {/* Lightbox Modal */}
      {lightbox?.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setLightbox(null)}>
          <div className="relative max-w-3xl w-full mx-4" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 z-10"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <img
              src={lightbox.image.image_url}
              alt={lightbox.image.title}
              className="w-full max-h-[70vh] object-contain rounded-lg bg-neutral-900"
              draggable={false}
            />
            <div className="mt-4 text-white text-lg font-semibold">{lightbox.image.title}</div>
          </div>
        </div>
      )}
      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowUpload(false)}>
          <form
            className="bg-neutral-900 rounded-xl p-8 max-w-md w-full mx-4 relative"
            onClick={e => e.stopPropagation()}
            onSubmit={handleUpload}
          >
            <button
              className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/80 z-10"
              type="button"
              onClick={() => setShowUpload(false)}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Upload a Photo</h2>
            <label className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={uploadForm.title}
              onChange={handleFormChange}
              className="w-full mb-4 px-3 py-2 rounded bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <label className="block text-gray-300 mb-2">Image</label>
            <input
              type="file"
              name="file"
              accept="image/*"
              onChange={handleFormChange}
              className="w-full mb-4 text-white"
              required
            />
            {uploadError && <div className="text-red-500 mb-2">{uploadError}</div>}
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition-colors disabled:opacity-60"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Photo"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}; 