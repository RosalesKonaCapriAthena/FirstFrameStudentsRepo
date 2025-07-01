import React, { useState, useRef, useEffect } from "react";
import { NavigationSection } from "../ElementLight/sections/NavigationSection/NavigationSection";
import { Badge } from "../../components/ui/badge";
import { supabase } from "../../lib/supabase";
import { useUser } from "../../lib/hooks/useUser";
import { useAuth } from "@clerk/clerk-react";
import Masonry from "react-masonry-css";

// Type for gallery images from the existing table
export type GalleryImage = {
  id: string;
  image_url: string;
  title: string;
  photographer: string;
  profile_pic: string | null;
  user_id: string | null;
  created_at?: string;
  user?: {
    id: string;
    full_name: string;
    badges: string[] | null;
    profile_picture_url: string | null;
  } | null;
};

// Sample images with photographer profile pictures
const allGalleryImages = [
  {
    id: 1,
    title: "Basketball Championship Moment",
    photographer: "Sarah Chen",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 2,
    title: "Soccer Goal Celebration",
    photographer: "Marcus Rodriguez",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 3,
    title: "Track Sprint Finish",
    photographer: "Emily Watson",
    profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
    image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 4,
    title: "Swimming Butterfly Stroke",
    photographer: "David Kim",
    profilePic: "https://randomuser.me/api/portraits/men/41.jpg",
    image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 5,
    title: "Tennis Serve Action",
    photographer: "Alex Johnson",
    profilePic: "https://randomuser.me/api/portraits/men/22.jpg",
    image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 6,
    title: "Football Quarterback Pass",
    photographer: "Mike Thompson",
    profilePic: "https://randomuser.me/api/portraits/men/55.jpg",
    image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 7,
    title: "Baseball Home Run",
    photographer: "Jessica Lee",
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 8,
    title: "Basketball Dunk",
    photographer: "Sarah Chen",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 9,
    title: "Soccer Free Kick",
    photographer: "Carlos Mendez",
    profilePic: "https://randomuser.me/api/portraits/men/77.jpg",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 10,
    title: "Swimming Relay",
    photographer: "Lisa Park",
    profilePic: "https://randomuser.me/api/portraits/women/23.jpg",
    image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 11,
    title: "Tennis Match Point",
    photographer: "Ryan Wilson",
    profilePic: "https://randomuser.me/api/portraits/men/88.jpg",
    image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 12,
    title: "Track Hurdles",
    photographer: "Maria Garcia",
    profilePic: "https://randomuser.me/api/portraits/women/34.jpg",
    image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  // Duplicate images for infinite scroll demo
  {
    id: 13,
    title: "Basketball Championship Moment 2",
    photographer: "Sarah Chen",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 14,
    title: "Soccer Goal Celebration 2",
    photographer: "Marcus Rodriguez",
    profilePic: "https://randomuser.me/api/portraits/men/32.jpg",
    image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 15,
    title: "Track Sprint Finish 2",
    photographer: "Emily Watson",
    profilePic: "https://randomuser.me/api/portraits/women/65.jpg",
    image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 16,
    title: "Swimming Butterfly Stroke 2",
    photographer: "David Kim",
    profilePic: "https://randomuser.me/api/portraits/men/41.jpg",
    image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 17,
    title: "Tennis Serve Action 2",
    photographer: "Alex Johnson",
    profilePic: "https://randomuser.me/api/portraits/men/22.jpg",
    image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 18,
    title: "Football Quarterback Pass 2",
    photographer: "Mike Thompson",
    profilePic: "https://randomuser.me/api/portraits/men/55.jpg",
    image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 19,
    title: "Baseball Home Run 2",
    photographer: "Jessica Lee",
    profilePic: "https://randomuser.me/api/portraits/women/12.jpg",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 20,
    title: "Basketball Dunk 2",
    photographer: "Sarah Chen",
    profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
    image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 21,
    title: "Soccer Free Kick 2",
    photographer: "Carlos Mendez",
    profilePic: "https://randomuser.me/api/portraits/men/77.jpg",
    image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 22,
    title: "Swimming Relay 2",
    photographer: "Lisa Park",
    profilePic: "https://randomuser.me/api/portraits/women/23.jpg",
    image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 23,
    title: "Tennis Match Point 2",
    photographer: "Ryan Wilson",
    profilePic: "https://randomuser.me/api/portraits/men/88.jpg",
    image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800"
  },
  {
    id: 24,
    title: "Track Hurdles 2",
    photographer: "Maria Garcia",
    profilePic: "https://randomuser.me/api/portraits/women/34.jpg",
    image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=800"
  }
];

export const Portfolio = (): JSX.Element => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [lightbox, setLightbox] = useState<{ open: boolean; image: GalleryImage } | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [fetching, setFetching] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", file: null as File | null });
  const [deletingImage, setDeletingImage] = useState<string | null>(null);

  // Fetch images from Supabase
  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select(`
          *,
          user:users!gallery_images_user_id_fkey(
            id,
            full_name,
            badges,
            profile_picture_url
          )
        `)
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
    fetchImages();
    // eslint-disable-next-line
  }, []);

  // Infinite scroll: load more images when loaderRef is visible
  useEffect(() => {
    if (!hasMore || fetching) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchImages();
      }
    }, { threshold: 1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, fetching]);

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
      console.log('Starting upload process...');
      
      // 1. Upload to Supabase Storage (using anon key, no auth needed)
      console.log('Uploading to storage...');
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('gallery')
        .upload(fileName, uploadForm.file, { upsert: false });
      
      if (storageError) {
        console.error('Storage error details:', {
          message: storageError.message,
          name: storageError.name,
          statusCode: (storageError as any).statusCode
        });
        throw storageError;
      }
      console.log('Storage upload successful:', storageData);
      
      // 2. Get public URL
      const { data: publicUrlData } = supabase.storage.from('gallery').getPublicUrl(fileName);
      const imageUrl = publicUrlData.publicUrl;
      console.log('Image URL:', imageUrl);
      
      // 3. Insert into gallery_images with correct field mapping
      console.log('Inserting into gallery_images...');
      console.log('User data:', { id: user?.id, full_name: user?.full_name, email: user?.email });
      
      const insertData = {
        image_url: imageUrl,
        title: uploadForm.title,
        photographer: user?.full_name || user?.email || "Anonymous",
        profile_pic: user?.profile_picture_url || null,
        user_id: user?.id || null,
      };
      console.log('Insert data:', insertData);
      
      const { data: insertResult, error: insertError } = await supabase.from('gallery_images').insert([insertData]);
      
      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }
      console.log('Insert successful:', insertResult);
      
      setShowUpload(false);
      setUploadForm({ title: "", file: null });
      fetchImages();
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Handle image deletion
  const handleDeleteImage = async (imageId: string, fileName: string) => {
    try {
      // 1. Delete from storage
      const { error: storageError } = await supabase.storage
        .from('gallery')
        .remove([fileName]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        throw storageError;
      }

      // 2. Delete from database
      const { data: deleteData, error: deleteError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId)
        .select();
      
      if (deleteError) {
        console.error('Database delete error:', deleteError);
        throw deleteError;
      }
      
      // 3. Refresh the gallery
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Check if user owns the image
  const isOwner = (image: GalleryImage) => {
    return user?.id && image.user_id === user.id;
  };

  // Masonry breakpoints
  const breakpointColumnsObj = {
    default: 5,
    1200: 4,
    900: 3,
    600: 2,
    400: 1
  };

  return (
    <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
      <NavigationSection />
      {/* Hero Section */}
      <section className="relative w-full py-20 px-10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
            Gallery
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-['Merriweather',serif] tracking-tight">
            Sports Photography
            <span className="block text-orange-500">Gallery</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-['Figtree',sans-serif]">
            Explore stunning moments captured by talented sports photographers. From championship victories to everyday practice sessions, discover the art of sports photography.
          </p>
        </div>
      </section>
      {/* Masonry Gallery using react-masonry-css */}
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
                  {/* Delete button - only show for owner */}
                  {isOwner(image) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this image?')) {
                          handleDeleteImage(image.id, image.image_url.split('/').pop() || "");
                        }
                      }}
                      disabled={deletingImage === image.id}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Delete image"
                    >
                      {deletingImage === image.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {hasMore && <div ref={loaderRef} className="h-8"></div>}
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
            <div className="flex items-center gap-3 mt-6">
              {(lightbox.image.user?.profile_picture_url || lightbox.image.profile_pic) && (
                <img
                  src={lightbox.image.user?.profile_picture_url || lightbox.image.profile_pic || ''}
                  alt={lightbox.image.photographer}
                  className="w-10 h-10 rounded-full object-cover border-2 border-orange-400"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="text-white font-semibold text-lg">{lightbox.image.photographer}</div>
                  {/* Display badges */}
                  {lightbox.image.user?.badges?.includes('verified') && (
                    <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Verified
                    </Badge>
                  )}
                  {lightbox.image.user?.badges?.includes('founder') && (
                    <Badge className="bg-yellow-400/20 text-yellow-500 border-yellow-400 flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                      </svg>
                      Founder
                    </Badge>
                  )}
                </div>
                <div className="text-gray-400 text-sm">{lightbox.image.title}</div>
              </div>
            </div>
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
            <h2 className="text-2xl font-bold text-white mb-4">Post a New Photo</h2>
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
              {uploading ? "Uploading..." : "Post Photo"}
            </button>
          </form>
        </div>
      )}
      {/* Floating Post Button */}
      <button
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
        aria-label="Post a new photo"
        onClick={() => setShowUpload(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}; 