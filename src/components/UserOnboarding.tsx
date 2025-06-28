import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { useUser } from '../lib/hooks/useUser';
import { Camera, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserOnboardingProps {
  defaultUserType?: 'student' | 'organizer';
}

export const UserOnboarding = ({ defaultUserType }: UserOnboardingProps) => {
  const { user, createUser, clerkUser } = useUser();
  const [selectedType, setSelectedType] = useState<'student' | 'organizer'>(defaultUserType || 'student');
  const [formData, setFormData] = useState({
    user_type: defaultUserType || 'student',
    full_name: '',
    location: '',
    bio: '',
    experience_level: '' as 'beginner' | 'intermediate' | 'advanced',
    portfolio_url: '',
    instagram_handle: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect after onboarding
  useEffect(() => {
    if (user) {
      if (user.user_type === 'student') {
        navigate('/students', { replace: true });
      } else if (user.user_type === 'organizer') {
        navigate('/organizers', { replace: true });
      }
    }
  }, [user, navigate]);

  // Keep formData.user_type in sync with selectedType
  useEffect(() => {
    setFormData(prev => ({ ...prev, user_type: selectedType }));
  }, [selectedType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clerkUser) return;
    setLoading(true);
    setError(null);
    try {
      const userPayload = {
        clerk_id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        ...formData,
        experience_level: selectedType === 'student' ? formData.experience_level : null,
      };
      await createUser(userPayload);
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err?.message || 'There was a problem completing setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user) return null; // User already exists (redirect will happen)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-neutral-800 border-neutral-700">
        <CardHeader>
          <CardTitle className="text-white text-center mb-2">
            Welcome to First Frame!
          </CardTitle>
          <div className="flex justify-center gap-4 mt-2 mb-2">
            <Button
              onClick={() => setSelectedType('student')}
              className={`h-20 flex-1 flex flex-col items-center justify-center gap-1 ${selectedType === 'student' ? 'bg-orange-500 text-white' : 'bg-neutral-700 text-gray-300 hover:bg-orange-600'}`}
            >
              <Camera className="w-6 h-6" />
              Student Photographer
            </Button>
            <Button
              onClick={() => setSelectedType('organizer')}
              className={`h-20 flex-1 flex flex-col items-center justify-center gap-1 ${selectedType === 'organizer' ? 'bg-blue-500 text-white' : 'bg-neutral-700 text-gray-300 hover:bg-blue-600'}`}
            >
              <User className="w-6 h-6" />
              Event Organizer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Full Name</label>
              <Input
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
                className="bg-neutral-700 border-neutral-600 text-white"
                required
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, State"
                className="bg-neutral-700 border-neutral-600 text-white"
                required
              />
            </div>
            {selectedType === 'student' && (
              <>
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">Experience Level</label>
                  <div className="flex gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <Badge
                        key={level}
                        onClick={() => setFormData(prev => ({ ...prev, experience_level: level }))}
                        className={`cursor-pointer ${formData.experience_level === level ? 'bg-orange-500 text-white' : 'bg-neutral-700 text-gray-300 hover:bg-neutral-600'}`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">Portfolio URL (optional)</label>
                  <Input
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                    placeholder="https://your-portfolio.com"
                    className="bg-neutral-700 border-neutral-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm mb-1 block">Instagram Handle (optional)</label>
                  <Input
                    value={formData.instagram_handle}
                    onChange={(e) => setFormData(prev => ({ ...prev, instagram_handle: e.target.value }))}
                    placeholder="@yourusername"
                    className="bg-neutral-700 border-neutral-600 text-white"
                  />
                </div>
              </>
            )}
            <div>
              <label className="text-gray-300 text-sm mb-1 block">Bio (optional)</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself..."
                className="w-full bg-neutral-700 border border-neutral-600 text-white rounded-md p-3 resize-none h-20"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center pt-2">{error}</div>
            )}
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white flex-1"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Completing...
                  </span>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 