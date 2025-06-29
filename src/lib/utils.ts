import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// File upload utilities
export const uploadFile = async (file: File, bucket: string, path: string): Promise<string> => {
  const { supabase } = await import('./supabase');
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
};

export const deleteFile = async (bucket: string, path: string): Promise<void> => {
  const { supabase } = await import('./supabase');
  
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};

// Profile picture utilities
export const uploadProfilePicture = async (file: File, userId: string): Promise<string> => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('File size must be less than 5MB');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  
  const { supabase } = await import('./supabase');
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrl;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Geocode a location string to [lat, lng] using Nominatim (OpenStreetMap)
export async function geocodeLocation(location: string): Promise<[number, number] | null> {
  if (!location) return null;
  console.log('[Geocode] Looking up:', location);
  // Check cache first
  const cacheKey = `geocode_${location}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed && Array.isArray(parsed) && parsed.length === 2) {
        console.log(`[Geocode] Cache hit for ${location}:`, parsed);
        return parsed as [number, number];
      }
    } catch {}
  } else {
    console.log(`[Geocode] Cache miss for ${location}`);
  }
  // Fetch from Nominatim
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  try {
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lon = parseFloat(data[0].lon);
      if (!isNaN(lat) && !isNaN(lon)) {
        localStorage.setItem(cacheKey, JSON.stringify([lat, lon]));
        console.log(`[Geocode] API result for ${location}:`, [lat, lon]);
        return [lat, lon];
      }
    }
    console.warn(`[Geocode] No results for ${location}`, data);
  } catch (e) {
    console.error(`[Geocode] Error for ${location}:`, e);
  }
  return null;
}
