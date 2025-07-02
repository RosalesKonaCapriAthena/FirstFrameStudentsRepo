import React, { useState, useEffect, useRef } from "react";
import { NavigationSection } from "../ElementLight/sections/NavigationSection/NavigationSection";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useUser } from "../../lib/hooks/useUser";
import { useApplications } from "../../lib/hooks/useApplications";
import { useOpportunities } from "../../lib/hooks/useOpportunities";
import { useSearchParams, useNavigate } from "react-router-dom";
import { uploadProfilePicture, getInitials, formatFileSize } from "../../lib/utils";
import { 
  User, 
  Mail, 
  MapPin, 
  Camera, 
  Settings, 
  Edit, 
  Save, 
  X,
  Calendar,
  Clock,
  Star,
  Award,
  BookOpen,
  ExternalLink,
  Upload,
  Trash2,
  Plus,
  Eye
} from "lucide-react";
import { ProfilePortfolioTab } from "./ProfilePortfolioTab";

export const Profile = (): JSX.Element => {
  const { user, updateUser, updateProfilePicture, loading } = useUser();
  const { applications } = useApplications();
  const { opportunities, fetchOrganizerOpportunities } = useOpportunities();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || "",
    location: user?.location || "",
    bio: user?.bio || "",
    experience_level: user?.experience_level || "beginner",
    portfolio_url: user?.portfolio_url || "",
    instagram_handle: user?.instagram_handle || "",
  });

  // Handle URL parameters for tab selection
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'activity', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  useEffect(() => {
    if (user?.id && user?.user_type === 'organizer') {
      fetchOrganizerOpportunities(user.id);
    }
  }, [user?.id, user?.user_type]);

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Only include fields that have actually changed
      const updates: Partial<typeof editForm> = {};
      
      if (editForm.full_name !== user?.full_name) {
        updates.full_name = editForm.full_name;
      }
      if (editForm.location !== user?.location) {
        updates.location = editForm.location;
      }
      if (editForm.bio !== user?.bio) {
        updates.bio = editForm.bio;
      }
      if (editForm.experience_level !== user?.experience_level) {
        updates.experience_level = editForm.experience_level;
      }
      if (editForm.portfolio_url !== user?.portfolio_url) {
        updates.portfolio_url = editForm.portfolio_url;
      }
      if (editForm.instagram_handle !== user?.instagram_handle) {
        updates.instagram_handle = editForm.instagram_handle;
      }

      // Only update if there are actual changes
      if (Object.keys(updates).length > 0) {
        await updateUser(updates);
        setToastMessage("Profile updated successfully!");
      } else {
        setToastMessage("No changes to save");
      }
      
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setToastMessage("Failed to update profile");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      full_name: user?.full_name || "",
      location: user?.location || "",
      bio: user?.bio || "",
      experience_level: user?.experience_level || "beginner",
      portfolio_url: user?.portfolio_url || "",
      instagram_handle: user?.instagram_handle || "",
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setUploadingImage(true);
      const imageUrl = await uploadProfilePicture(file, user.id);
      await updateProfilePicture(imageUrl);
      setToastMessage("Profile picture updated successfully!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setToastMessage(error instanceof Error ? error.message : "Failed to upload image");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getExperienceColor = (level: string | null) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const userApplications = applications.filter(app => app.photographer_id === user?.id);
  const userOpportunities = opportunities.filter(opp => opp.organizer_id === user?.id);

  if (loading) {
    return (
      <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
        <NavigationSection />
        <div className="w-full flex items-center justify-center py-20">
          <div className="text-center text-gray-400">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <h2 className="text-2xl font-bold text-white mb-2">Loading Profile...</h2>
          </div>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
        <NavigationSection />
        <div className="w-full flex items-center justify-center py-20">
          <div className="text-center text-gray-400">
            <User className="w-16 h-16 mx-auto mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
            <p>Please sign in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg animate-fade-in-up">
            {toastMessage}
          </div>
        </div>
      )}

      <NavigationSection />
      
      {/* Hidden file input for profile picture upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      
      {/* Hero Section */}
      <section className="relative w-full py-10 px-4 sm:py-20 sm:px-10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group mb-4 sm:mb-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                {user.profile_picture_url ? (
                  <img 
                    src={user.profile_picture_url} 
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    {getInitials(user.full_name)}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  onClick={triggerFileInput}
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex-1 w-full min-w-0">
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 font-['Merriweather',serif] flex flex-wrap items-center gap-2 break-words">
                {user.full_name}
                {user.badges?.includes('verified') && (
                  <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Verified
                  </Badge>
                )}
                {user.badges?.includes('founder') && (
                  <Badge className="bg-yellow-400/20 text-yellow-500 border-yellow-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" /></svg>
                    Founder
                  </Badge>
                )}
              </h1>
              <p className="text-base sm:text-xl text-gray-300 font-['Figtree',sans-serif] break-words">
                {user.user_type === 'student' ? 'Student Photographer' : 'Event Organizer'}
              </p>
              {user.location && (
                <div className="flex items-center gap-2 text-gray-400 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-[150px] sm:max-w-xs">{user.location}</span>
                </div>
              )}
            </div>
            <div className="text-right flex flex-col items-end gap-2 min-w-[100px]">
              <Badge className={`${getExperienceColor(user.experience_level)} w-full text-center`}>
                {user.experience_level ? 
                  user.experience_level.charAt(0).toUpperCase() + user.experience_level.slice(1) 
                  : 'Not Specified'
                }
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-400 w-full text-center">
                {user.user_type === 'student' ? 'Student' : 'Organizer'}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-16 px-10 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 bg-neutral-800 border border-neutral-700">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <User className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Camera className="w-4 h-4 mr-2" />
                Portfolio
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-2">
                  <Card className="bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">Profile Information</CardTitle>
                        {!isEditing ? (
                          <Button
                            onClick={() => setIsEditing(true)}
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button
                              onClick={handleSaveProfile}
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                            <Button
                              onClick={handleCancelEdit}
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                          {isEditing ? (
                            <Input
                              value={editForm.full_name}
                              onChange={(e) => handleInputChange('full_name', e.target.value)}
                              className="bg-neutral-700 border-neutral-600 text-white"
                            />
                          ) : (
                            <p className="text-white">{user.full_name}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                          <p className="text-white">{user.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                        {isEditing ? (
                          <Input
                            value={editForm.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="bg-neutral-700 border-neutral-600 text-white"
                            placeholder="City, State"
                          />
                        ) : (
                          <p className="text-white">{user.location || "Not specified"}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                        {isEditing ? (
                          <textarea
                            value={editForm.bio}
                            onChange={(e) => handleInputChange('bio', e.target.value)}
                            className="w-full h-24 bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-white resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        ) : (
                          <p className="text-white">{user.bio || "No bio provided"}</p>
                        )}
                      </div>

                      {user.user_type === 'student' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Experience Level</label>
                            {isEditing ? (
                              <select
                                value={editForm.experience_level}
                                onChange={(e) => handleInputChange('experience_level', e.target.value)}
                                className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                              </select>
                            ) : (
                              <Badge className={getExperienceColor(user.experience_level)}>
                                {user.experience_level ? 
                                  user.experience_level.charAt(0).toUpperCase() + user.experience_level.slice(1) 
                                  : 'Not Specified'
                                }
                              </Badge>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio URL</label>
                              {isEditing ? (
                                <Input
                                  value={editForm.portfolio_url}
                                  onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                                  className="bg-neutral-700 border-neutral-600 text-white"
                                  placeholder="https://your-portfolio.com"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  {user.portfolio_url ? (
                                    <>
                                      <a 
                                        href={user.portfolio_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-orange-500 hover:text-orange-400 flex items-center gap-1"
                                      >
                                        <ExternalLink className="w-4 h-4" />
                                        View Portfolio
                                      </a>
                                    </>
                                  ) : (
                                    <p className="text-gray-400">No portfolio link</p>
                                  )}
                                </div>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-2">Instagram Handle</label>
                              {isEditing ? (
                                <Input
                                  value={editForm.instagram_handle}
                                  onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                                  className="bg-neutral-700 border-neutral-600 text-white"
                                  placeholder="@username"
                                />
                              ) : (
                                <div className="flex items-center gap-2">
                                  {user.instagram_handle ? (
                                    <a 
                                      href={`https://instagram.com/${user.instagram_handle}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-orange-500 hover:text-orange-400 flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                      @{user.instagram_handle}
                                    </a>
                                  ) : (
                                    <p className="text-gray-400">No Instagram handle</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {/* Organizer Promo & Socials Section */}
                      {user.user_type === 'organizer' && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Instagram Handle</label>
                            {isEditing ? (
                              <Input
                                value={editForm.instagram_handle}
                                onChange={(e) => handleInputChange('instagram_handle', e.target.value)}
                                className="bg-neutral-700 border-neutral-600 text-white"
                                placeholder="@username"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                {user.instagram_handle ? (
                                  <a 
                                    href={`https://instagram.com/${user.instagram_handle}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-orange-500 hover:text-orange-400 flex items-center gap-1"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                    @{user.instagram_handle}
                                  </a>
                                ) : (
                                  <p className="text-gray-400">No Instagram handle</p>
                                )}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Stats */}
                <div className="space-y-6">
                  <Card className="bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-white">Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {user.user_type === 'student' ? (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Applications</span>
                            <Badge className="bg-blue-500/20 text-blue-400">
                              {userApplications.length}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Approved</span>
                            <Badge className="bg-green-500/20 text-green-400">
                              {userApplications.filter(app => app.status === 'approved').length}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Pending</span>
                            <Badge className="bg-yellow-500/20 text-yellow-400">
                              {userApplications.filter(app => app.status === 'pending').length}
                            </Badge>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Opportunities Posted</span>
                            <Badge className="bg-blue-500/20 text-blue-400">
                              {userOpportunities.length}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Active</span>
                            <Badge className="bg-green-500/20 text-green-400">
                              {userOpportunities.filter(opp => opp.status === 'active').length}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-300">Completed</span>
                            <Badge className="bg-blue-500/20 text-blue-400">
                              {userOpportunities.filter(opp => opp.status === 'completed').length}
                            </Badge>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-neutral-800 border-neutral-700">
                    <CardHeader>
                      <CardTitle className="text-white">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {user.user_type === 'student' ? (
                        <>
                          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                            <Camera className="w-4 h-4 mr-2" />
                            Browse Opportunities
                          </Button>
                          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                            <BookOpen className="w-4 h-4 mr-2" />
                            View Resources
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => navigate('/organizers?tab=post-opportunity')}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Post Opportunity
                          </Button>
                          <Button
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => navigate('/organizers?tab=find-photographers')}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Find Photographers
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="mt-8">
              {user.user_type === 'student' ? <ProfilePortfolioTab userId={user.id} /> : (
                <div className="text-center text-gray-400 py-20">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                  <h2 className="text-2xl font-bold text-white mb-2">Portfolio Only Available for Students</h2>
                  <p>Only student photographers can upload and manage a portfolio.</p>
                </div>
              )}
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-8">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white font-['Merriweather',serif]">
                  Recent Activity
                </h2>
                
                {user.user_type === 'student' ? (
                  <div className="space-y-4">
                    {userApplications.length === 0 ? (
                      <Card className="bg-neutral-800 border-neutral-700">
                        <CardContent className="p-8 text-center">
                          <Camera className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                          <h3 className="text-xl font-bold text-white mb-2">No Applications Yet</h3>
                          <p className="text-gray-400 mb-4">Start applying to photography opportunities to see your activity here.</p>
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            Browse Opportunities
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      userApplications.map((application) => (
                        <Card key={application.id} className="bg-neutral-800 border-neutral-700">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-white mb-2">Application Submitted</h3>
                                <p className="text-gray-300">Opportunity ID: {application.opportunity_id}</p>
                                <p className="text-sm text-gray-400">
                                  Applied on {new Date(application.applied_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={`${
                                application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                application.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOpportunities.length === 0 ? (
                      <Card className="bg-neutral-800 border-neutral-700">
                        <CardContent className="p-8 text-center">
                          <Plus className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                          <h3 className="text-xl font-bold text-white mb-2">No Opportunities Posted</h3>
                          <p className="text-gray-400 mb-4">Start posting photography opportunities to see your activity here.</p>
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            Post Opportunity
                          </Button>
                        </CardContent>
                      </Card>
                    ) : (
                      userOpportunities.map((opportunity) => (
                        <Card key={opportunity.id} className="bg-neutral-800 border-neutral-700">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-white mb-2">{opportunity.title}</h3>
                                <p className="text-gray-300">{opportunity.sport} • {opportunity.location}</p>
                                <p className="text-sm text-gray-400">
                                  Posted on {new Date(opportunity.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <Badge className={`${
                                opportunity.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                opportunity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                opportunity.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {opportunity.status?.charAt(0).toUpperCase() + opportunity.status?.slice(1)}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-8">
              <div className="max-w-2xl mx-auto">
                <Card className="bg-neutral-800 border-neutral-700">
                  <CardHeader>
                    <CardTitle className="text-white">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Profile Picture</h3>
                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center">
                            {user.profile_picture_url ? (
                              <img 
                                src={user.profile_picture_url} 
                                alt={user.full_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white text-xl font-bold">
                                {getInitials(user.full_name)}
                              </span>
                            )}
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              onClick={triggerFileInput}
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                              disabled={uploadingImage}
                            >
                              {uploadingImage ? (
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Camera className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1">
                          <Button
                            className="w-full border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                            onClick={triggerFileInput}
                            disabled={uploadingImage}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {uploadingImage ? "Uploading..." : "Upload New Picture"}
                          </Button>
                          <p className="text-sm text-gray-400 mt-2">
                            JPG, PNG, or GIF. Max 5MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-neutral-700 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                          <p className="text-white">{user.email}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Account Type</label>
                          <Badge className="bg-blue-500/20 text-blue-400">
                            {user.user_type === 'student' ? 'Student Photographer' : 'Event Organizer'}
                          </Badge>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Member Since</label>
                          <p className="text-white">{new Date(user.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-neutral-700 pt-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <h4 className="text-red-400 font-semibold mb-2">Delete Account</h4>
                          <p className="text-gray-300 text-sm mb-3">
                            This action cannot be undone. This will permanently delete your account and remove all your data.
                          </p>
                          <Button
                            className="border border-red-600 bg-neutral-800 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}; 