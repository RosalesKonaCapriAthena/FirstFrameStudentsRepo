import { useUser as useClerkUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { Database } from '../database.types';

type User = Database['public']['Tables']['users']['Row'];

export function useUser() {
  const { user: clerkUser, isLoaded } = useClerkUser();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !clerkUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    async function fetchUser() {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', clerkUser!.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user:', error);
        }

        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [clerkUser, isLoaded]);

  const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const updateProfilePicture = async (profilePictureUrl: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({ profile_picture_url: profilePictureUrl })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setUser(data);
      return data;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    createUser,
    updateUser,
    updateProfilePicture,
    clerkUser,
    isLoaded
  };
} 