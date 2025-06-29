import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Opportunity = Database['public']['Tables']['opportunities']['Row'];
type OpportunityInsert = Database['public']['Tables']['opportunities']['Insert'];

export interface SearchFilters {
  searchTerm?: string;
  sport?: string;
  location?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  dateFrom?: string;
  dateTo?: string;
  status?: 'active' | 'pending' | 'completed' | 'cancelled';
}

export function useOpportunities() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  // Fetch all opportunities with optional filters
  const fetchOpportunities = async (searchFilters?: SearchFilters) => {
    try {
      setLoading(true);
      let query = supabase
        .from('opportunities')
        .select(`
          *,
          organizer:users!opportunities_organizer_id_fkey(full_name, location, email, badges)
        `);

      // Apply filters
      if (searchFilters?.status) {
        query = query.eq('status', searchFilters.status);
      } else {
        query = query.eq('status', 'active'); // Default to active opportunities
      }

      if (searchFilters?.sport) {
        query = query.ilike('sport', `%${searchFilters.sport}%`);
      }

      if (searchFilters?.location) {
        query = query.ilike('location', `%${searchFilters.location}%`);
      }

      if (searchFilters?.difficulty) {
        query = query.eq('difficulty', searchFilters.difficulty);
      }

      if (searchFilters?.dateFrom) {
        query = query.gte('date', searchFilters.dateFrom);
      }

      if (searchFilters?.dateTo) {
        query = query.lte('date', searchFilters.dateTo);
      }

      if (searchFilters?.searchTerm) {
        query = query.or(`title.ilike.%${searchFilters.searchTerm}%,description.ilike.%${searchFilters.searchTerm}%,sport.ilike.%${searchFilters.searchTerm}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
      setFilteredOpportunities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  // Search opportunities with filters
  const searchOpportunities = async (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    await fetchOpportunities(searchFilters);
  };

  // Clear all filters
  const clearFilters = async () => {
    setFilters({});
    await fetchOpportunities();
  };

  // Get unique sports for filter dropdown
  const getUniqueSports = () => {
    const sports = opportunities.map(opp => opp.sport);
    return [...new Set(sports)].sort();
  };

  // Get unique locations for filter dropdown
  const getUniqueLocations = () => {
    const locations = opportunities.map(opp => opp.location);
    return [...new Set(locations)].sort();
  };

  // Create new opportunity
  const createOpportunity = async (opportunityData: Omit<OpportunityInsert, 'id' | 'created_at' | 'updated_at' | 'applications_count' | 'views_count'>) => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([opportunityData])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the opportunities list
      await fetchOpportunities(filters);
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create opportunity');
      throw err;
    }
  };

  // Update opportunity
  const updateOpportunity = async (id: string, updates: Partial<Opportunity>, organizerId: string) => {
    try {
      // Optimistic update - update local state immediately
      const originalOpportunities = [...opportunities];
      setOpportunities(prev => prev.map(opp => 
        opp.id === id ? { ...opp, ...updates } : opp
      ));
      setFilteredOpportunities(prev => prev.map(opp => 
        opp.id === id ? { ...opp, ...updates } : opp
      ));

      const { data, error } = await supabase
        .from('opportunities')
        .update(updates)
        .eq('id', id)
        .eq('organizer_id', organizerId)
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      // Revert optimistic update on error
      await fetchOrganizerOpportunities(organizerId);
      setError(err instanceof Error ? err.message : 'Failed to update opportunity');
      throw err;
    }
  };

  // Delete opportunity
  const deleteOpportunity = async (id: string, organizerId: string) => {
    // Store original state for potential rollback
    const originalOpportunities = [...opportunities];
    
    try {
      // Optimistic update - remove from local state immediately
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
      setFilteredOpportunities(prev => prev.filter(opp => opp.id !== id));

      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id)
        .eq('organizer_id', organizerId);

      if (error) throw error;
      
    } catch (err) {
      // Revert optimistic update on error
      setOpportunities(originalOpportunities);
      setFilteredOpportunities(originalOpportunities);
      setError(err instanceof Error ? err.message : 'Failed to delete opportunity');
      throw err;
    }
  };

  // Fetch opportunities by organizer
  const fetchOrganizerOpportunities = async (organizerId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          organizer:users!opportunities_organizer_id_fkey(full_name, location, email, badges)
        `)
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
      setFilteredOpportunities(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch organizer opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  return {
    opportunities,
    filteredOpportunities,
    loading,
    error,
    filters,
    fetchOpportunities,
    searchOpportunities,
    clearFilters,
    getUniqueSports,
    getUniqueLocations,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    fetchOrganizerOpportunities
  };
} 