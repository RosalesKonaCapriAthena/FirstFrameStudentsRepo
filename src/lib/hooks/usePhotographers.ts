import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../database.types';

type User = Database['public']['Tables']['users']['Row'];

export interface PhotographerFilters {
  searchTerm?: string;
  location?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
  userType?: 'student' | 'organizer';
}

export function usePhotographers() {
  const [photographers, setPhotographers] = useState<User[]>([]);
  const [filteredPhotographers, setFilteredPhotographers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PhotographerFilters>({});

  // Fetch all photographers with optional filters
  const fetchPhotographers = async (searchFilters?: PhotographerFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('users')
        .select('*')
        .eq('user_type', 'student'); // Only fetch students (photographers)

      // Apply filters
      if (searchFilters?.location) {
        query = query.ilike('location', `%${searchFilters.location}%`);
      }

      if (searchFilters?.experienceLevel) {
        query = query.eq('experience_level', searchFilters.experienceLevel);
      }

      if (searchFilters?.searchTerm) {
        query = query.or(`full_name.ilike.%${searchFilters.searchTerm}%,bio.ilike.%${searchFilters.searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPhotographers(data || []);
      setFilteredPhotographers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photographers');
    } finally {
      setLoading(false);
    }
  };

  // Search photographers with filters
  const searchPhotographers = async (searchFilters: PhotographerFilters) => {
    setFilters(searchFilters);
    await fetchPhotographers(searchFilters);
  };

  // Clear all filters
  const clearFilters = async () => {
    setFilters({});
    await fetchPhotographers();
  };

  // Get unique locations for filter dropdown
  const getUniqueLocations = () => {
    const locations = photographers
      .map(photographer => photographer.location)
      .filter((location): location is string => location !== null);
    return [...new Set(locations)].sort();
  };

  // Get photographers by experience level
  const getPhotographersByExperience = (level: 'beginner' | 'intermediate' | 'advanced') => {
    return photographers.filter(photographer => photographer.experience_level === level);
  };

  // Get photographers by location
  const getPhotographersByLocation = (location: string) => {
    return photographers.filter(photographer => 
      photographer.location?.toLowerCase().includes(location.toLowerCase())
    );
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  return {
    photographers,
    filteredPhotographers,
    loading,
    error,
    filters,
    fetchPhotographers,
    searchPhotographers,
    clearFilters,
    getUniqueLocations,
    getPhotographersByExperience,
    getPhotographersByLocation
  };
} 