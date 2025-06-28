import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../database.types';

type Application = Database['public']['Tables']['applications']['Row'];
type ApplicationInsert = Database['public']['Tables']['applications']['Insert'];

type ApplicationWithPhotographer = Application & {
  photographer?: {
    full_name?: string;
    email?: string;
  };
};

export function useApplications() {
  const [applications, setApplications] = useState<(Application | ApplicationWithPhotographer)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create new application
  const createApplication = async (applicationData: Omit<ApplicationInsert, 'id' | 'applied_at'>) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert([applicationData])
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the applications list
      await fetchApplications();
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application');
      throw err;
    }
  };

  // Update application status
  const updateApplicationStatus = async (id: string, status: 'pending' | 'approved' | 'declined') => {
    // Store original state for potential rollback
    const originalApplications = [...applications];
    
    try {
      // Optimistic update - update local state immediately
      setApplications(prev => prev.map(app => 
        app.id === id ? { ...app, status, reviewed_at: new Date().toISOString() } : app
      ));

      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status, 
          reviewed_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return data;
    } catch (err) {
      // Revert optimistic update on error
      setApplications(originalApplications);
      setError(err instanceof Error ? err.message : 'Failed to update application');
      throw err;
    }
  };

  // Fetch applications for a photographer
  const fetchPhotographerApplications = async (photographerId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities!applications_opportunity_id_fkey(
            *,
            organizer:users!opportunities_organizer_id_fkey(full_name, location, email)
          )
        `)
        .eq('photographer_id', photographerId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch photographer applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications for an opportunity
  const fetchOpportunityApplications = async (opportunityId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          photographer:users!applications_photographer_id_fkey(*)
        `)
        .eq('opportunity_id', opportunityId)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch opportunity applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all applications (for organizers)
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities!applications_opportunity_id_fkey(
            *,
            organizer:users!opportunities_organizer_id_fkey(full_name, location, email)
          ),
          photographer:users!applications_photographer_id_fkey(*)
        `)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  // Check if user has already applied to an opportunity
  const checkExistingApplication = async (photographerId: string, opportunityId: string) => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('photographer_id', photographerId)
        .eq('opportunity_id', opportunityId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (err) {
      console.error('Error checking existing application:', err);
      return null;
    }
  };

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplicationStatus,
    fetchPhotographerApplications,
    fetchOpportunityApplications,
    fetchApplications,
    checkExistingApplication
  };
} 