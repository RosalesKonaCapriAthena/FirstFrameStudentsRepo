import React, { useState } from "react";
import { NavigationSection } from "../ElementLight/sections/NavigationSection/NavigationSection";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { useOpportunities } from "../../lib/hooks/useOpportunities";
import { useUser } from "../../lib/hooks/useUser";
import { useApplications } from "../../lib/hooks/useApplications";
import { usePhotographers } from "../../lib/hooks/usePhotographers";
import { PhotographerSearchComponent, PhotographerCard } from "../../components/PhotographerSearch";
import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Camera, 
  Edit, 
  Trash2, 
  Eye, 
  Star,
  Filter,
  Search,
  Upload,
  Settings,
  BarChart3,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Building,
  Globe,
  Phone,
  Mail,
  ArrowRight,
  XCircle
} from "lucide-react";
import type { Database } from '../../lib/database.types';

// Extend Application type to include photographer

type ApplicationWithPhotographer = Database['public']['Tables']['applications']['Row'] & {
  photographer?: {
    full_name?: string;
    email?: string;
  };
};

export const ForOrganizers = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("post-opportunity");
  const [formData, setFormData] = useState({
    title: "",
    sport: "",
    date: "",
    time: "",
    location: "",
    address: "",
    description: "",
    requirements: "",
    difficulty: "beginner",
    status: "active",
  });
  const { user } = useUser();
  const { opportunities, createOpportunity, fetchOrganizerOpportunities, loading, deleteOpportunity, updateOpportunity } = useOpportunities();
  const { applications, loading: loadingApps, fetchApplications, updateApplicationStatus } = useApplications();
  const { 
    photographers, 
    filteredPhotographers, 
    loading: loadingPhotographers, 
    searchPhotographers, 
    clearFilters: clearPhotographerFilters, 
    getUniqueLocations: getPhotographerLocations,
    filters: photographerFilters 
  } = usePhotographers();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editOpportunity, setEditOpportunity] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState<any>(null);

  React.useEffect(() => {
    if (user?.id) {
      fetchOrganizerOpportunities(user.id);
      fetchApplications();
    }
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    try {
      if (!user?.id) throw new Error("User not found");
      await createOpportunity({
        organizer_id: user.id,
        title: formData.title,
        sport: formData.sport,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        address: formData.address,
        description: formData.description,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(Boolean),
        difficulty: formData.difficulty as any,
        status: formData.status as any,
      });
      setFormData({
        title: "",
        sport: "",
        date: "",
        time: "",
        location: "",
        address: "",
        description: "",
        requirements: "",
        difficulty: "beginner",
        status: "active",
      });
      setSuccess(true);
      setShowToast(true);
      setToastMessage("Opportunity posted!");
      setTimeout(() => setShowToast(false), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to post opportunity");
    } finally {
      setSubmitting(false);
      if (user?.id) fetchOrganizerOpportunities(user.id);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this opportunity? This cannot be undone.")) return;
    if (!user?.id) return;
    try {
      await deleteOpportunity(id, user.id);
      setToastMessage("Opportunity deleted!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      setToastMessage("Failed to delete opportunity");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const openDetails = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedOpportunity(null);
  };

  const openEdit = (opportunity: any) => {
    setEditOpportunity(opportunity);
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditOpportunity(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditOpportunity((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editOpportunity?.id || !user?.id) return;
    try {
      await updateOpportunity(editOpportunity.id, {
        ...editOpportunity,
        requirements: typeof editOpportunity.requirements === 'string'
          ? editOpportunity.requirements.split(',').map((r: string) => r.trim()).filter(Boolean)
          : editOpportunity.requirements,
      }, user.id);
      setToastMessage("Opportunity updated!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      closeEdit();
    } catch (err) {
      setToastMessage("Failed to update opportunity");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  const handlePhotographerFiltersChange = (newFilters: any) => {
    searchPhotographers(newFilters);
  };

  const handlePhotographerClearFilters = () => {
    clearPhotographerFilters();
  };

  const handleContactPhotographer = (photographer: any) => {
    setSelectedPhotographer(photographer);
    setShowContactModal(true);
  };

  const handleSendMessage = () => {
    if (selectedPhotographer) {
      const subject = encodeURIComponent("Photography Opportunity Inquiry");
      const body = encodeURIComponent(`Hi ${selectedPhotographer.full_name},\n\nI'm interested in discussing a photography opportunity with you.\n\nBest regards,\n${user?.full_name || 'Event Organizer'}`);
      window.open(`mailto:${selectedPhotographer.email}?subject=${subject}&body=${body}`);
      setShowContactModal(false);
      setSelectedPhotographer(null);
      setToastMessage("Email client opened!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    }
  };

  // Use filtered photographers if filters are applied, otherwise use all photographers
  const displayPhotographers = Object.values(photographerFilters).some(value => value && value !== '') 
    ? filteredPhotographers 
    : photographers;

  return (
    <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-lg animate-fade-in-up">
            {toastMessage.includes('deleted') ? <XCircle className="w-6 h-6 text-white" /> : <CheckCircle className="w-6 h-6 text-white" />}
            {toastMessage}
          </div>
        </div>
      )}
      <NavigationSection />
      
      {/* Hero Section */}
      <section className="relative w-full py-20 px-10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
            For Organizers
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-['Merriweather',serif] tracking-tight">
            Connect with Student
            <span className="block text-orange-500">Photographers</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-['Figtree',sans-serif]">
            Post photography opportunities for your sports events and connect with talented student photographers. Get professional-quality photos while supporting emerging talent.
          </p>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="w-full py-16 px-4 sm:px-10 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-4 bg-neutral-800 border border-neutral-700 gap-1 p-1 rounded-md overflow-hidden">
              <TabsTrigger 
                value="post-opportunity" 
                className="w-full data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-l-md rounded-r-none border-none"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Post Opportunity</span>
                <span className="sm:hidden">Post</span>
              </TabsTrigger>
              <TabsTrigger 
                value="manage-listings" 
                className="w-full data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-none border-none"
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Manage Listings</span>
                <span className="sm:hidden">Manage</span>
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="w-full data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-none border-none"
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Applications</span>
                <span className="sm:hidden">Apps</span>
              </TabsTrigger>
              <TabsTrigger 
                value="find-photographers" 
                className="w-full data-[state=active]:bg-orange-500 data-[state=active]:text-white text-xs sm:text-sm px-2 sm:px-3 py-2 sm:py-3 rounded-r-md rounded-l-none border-none"
              >
                <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Find Photographers</span>
                <span className="sm:hidden">Find</span>
              </TabsTrigger>
            </TabsList>

            {/* Post Opportunity Tab */}
            <TabsContent value="post-opportunity" className="mt-8">
              <div className="max-w-4xl mx-auto">
                <Card className="bg-neutral-800 border-neutral-700">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl font-['Merriweather',serif]">
                      Post a New Photography Opportunity
                    </CardTitle>
                    <p className="text-gray-300 font-['Figtree',sans-serif]">
                      Fill out the form below to create a new opportunity for student photographers.
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm sm:text-base">Event Title *</label>
                          <Input
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="e.g., High School Basketball Championship"
                            className="bg-neutral-700 border-neutral-600 text-white placeholder-gray-400 h-10 sm:h-11"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm sm:text-base">Sport *</label>
                          <Input
                            name="sport"
                            value={formData.sport}
                            onChange={handleInputChange}
                            placeholder="e.g., Basketball, Soccer, Track & Field"
                            className="bg-neutral-700 border-neutral-600 text-white placeholder-gray-400 h-10 sm:h-11"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm sm:text-base">Date *</label>
                          <Input
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="bg-neutral-700 border-neutral-600 text-white h-10 sm:h-11"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm sm:text-base">Start Time *</label>
                          <Input
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="bg-neutral-700 border-neutral-600 text-white h-10 sm:h-11"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="block text-white font-medium mb-2 text-sm sm:text-base">Difficulty Level</label>
                          <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleInputChange}
                            className="w-full h-10 sm:h-11 px-3 py-1 bg-neutral-700 border border-neutral-600 rounded-lg text-white text-sm sm:text-base"
                          >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm sm:text-base">Venue Name *</label>
                          <Input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="e.g., Central High School Gymnasium"
                            className="bg-neutral-700 border-neutral-600 text-white placeholder-gray-400 h-10 sm:h-11"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-white font-medium mb-2 text-sm sm:text-base">Full Address *</label>
                          <Input
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="e.g., 123 Main St, City, State 90210"
                            className="bg-neutral-700 border-neutral-600 text-white placeholder-gray-400 h-10 sm:h-11"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2 text-sm sm:text-base">Event Description *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe the event, what type of coverage you need, and any special requirements..."
                          className="w-full h-24 sm:h-32 bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-white font-medium mb-2 text-sm sm:text-base">Photographer Requirements</label>
                        <textarea
                          name="requirements"
                          value={formData.requirements}
                          onChange={handleInputChange}
                          placeholder="List any specific requirements (equipment, experience level, availability, etc.)"
                          className="w-full h-20 sm:h-24 bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none text-sm sm:text-base"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 sm:pt-6 gap-4">
                        <div className="text-xs sm:text-sm text-gray-400">
                          * Required fields
                        </div>
                        <Button type="submit" disabled={submitting} className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base w-full sm:w-auto">
                          {submitting ? "Posting..." : "Post Opportunity"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Find Photographers Tab */}
            <TabsContent value="find-photographers" className="mt-8">
              <div className="space-y-6">
                <div className="mb-6">
                  <PhotographerSearchComponent
                    filters={photographerFilters}
                    onFiltersChange={handlePhotographerFiltersChange}
                    onClearFilters={handlePhotographerClearFilters}
                    locations={getPhotographerLocations()}
                    loading={loadingPhotographers}
                  />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white font-['Merriweather',serif]">
                    Available Photographers
                    {Object.values(photographerFilters).some(value => value && value !== '') && (
                      <span className="text-lg text-gray-400 ml-2">
                        ({displayPhotographers.length} results)
                      </span>
                    )}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loadingPhotographers ? (
                    <div className="col-span-full text-center text-gray-400 py-12">Loading photographers...</div>
                  ) : displayPhotographers.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400 py-12">
                      {Object.values(photographerFilters).some(value => value && value !== '') 
                        ? "No photographers match your current filters. Try adjusting your search criteria."
                        : "No photographers available right now."
                      }
                    </div>
                  ) : (
                    displayPhotographers.map((photographer) => (
                      <PhotographerCard
                        key={photographer.id}
                        photographer={photographer}
                        onContact={handleContactPhotographer}
                      />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Manage Listings Tab */}
            <TabsContent value="manage-listings" className="mt-8 bg-neutral-900">
              <div className="space-y-6 bg-neutral-900">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white font-['Merriweather',serif]">
                    Your Posted Opportunities
                  </h2>
                </div>

                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center text-gray-400 py-12">Loading opportunities...</div>
                  ) : opportunities.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">No opportunities posted yet.</div>
                  ) : (
                    opportunities.map((opportunity) => (
                      <Card key={opportunity.id} className="bg-neutral-800 border-neutral-700">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-white mb-2 font-['Merriweather',serif]">
                                {opportunity.title}
                              </h3>
                              <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {opportunity.location}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {opportunity.date}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {opportunity.time}
                                </div>
                              </div>
                              <p className="text-gray-300 mb-4 font-['Figtree',sans-serif]">
                                {opportunity.description}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <Badge className={`mb-2 ${
                                opportunity.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                opportunity.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {opportunity.difficulty?.charAt(0).toUpperCase() + opportunity.difficulty?.slice(1)}
                              </Badge>
                              <Badge className={`${
                                opportunity.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                opportunity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                opportunity.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {opportunity.status?.charAt(0).toUpperCase() + opportunity.status?.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                              <span className="font-medium text-white">{opportunity.address}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => openDetails(opportunity)}
                                className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => openEdit(opportunity)}
                                className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleDelete(opportunity.id)}
                                className="border border-red-600 bg-neutral-800 text-red-400 hover:bg-red-600 hover:text-white"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="mt-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white font-['Merriweather',serif]">
                    Applications Received
                  </h2>
                </div>

                <div className="space-y-6">
                  {loadingApps ? (
                    <div className="text-center text-gray-400 py-12">Loading applications...</div>
                  ) : applications.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">No applications received yet.</div>
                  ) : (
                    (applications as ApplicationWithPhotographer[]).map((application) => (
                      <Card key={application.id} className="bg-neutral-800 border-neutral-700">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-2 font-['Merriweather',serif]">
                                Application for {application.opportunity_id}
                              </h3>
                              <div className="mb-2">
                                <span className="text-gray-300 font-semibold">Applicant Name: </span>
                                <span className="text-white">{application.photographer?.full_name || application.photographer_id || 'N/A'}</span>
                              </div>
                              <div className="mb-4">
                                <span className="text-gray-300 font-semibold">Applicant Email: </span>
                                <span className="text-white">{application.photographer?.email || 'N/A'}</span>
                              </div>
                              <div className="text-sm text-gray-400">
                                Applied: {new Date(application.applied_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <Badge className={`mb-2 ${
                                application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                application.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          {application.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateApplicationStatus(application.id, 'approved')}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => updateApplicationStatus(application.id, 'declined')}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                <XCircle className="w-4 h-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Photographer Modal */}
      {showContactModal && selectedPhotographer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-white">Contact {selectedPhotographer.full_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-gray-300">
                  <p>Email: {selectedPhotographer.email}</p>
                  {selectedPhotographer.location && (
                    <p>Location: {selectedPhotographer.location}</p>
                  )}
                  {selectedPhotographer.bio && (
                    <p className="mt-2">Bio: {selectedPhotographer.bio}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleSendMessage}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button
                    onClick={() => setShowContactModal(false)}
                    className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* View Opportunity Details Modal */}
      {showDetails && selectedOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-neutral-800 border-neutral-700 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl font-['Merriweather',serif]">
                  {selectedOpportunity.title}
                </CardTitle>
                <Button
                  onClick={closeDetails}
                  size="sm"
                  className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">Event Details</h4>
                  <div className="space-y-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date: {selectedOpportunity.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Time: {selectedOpportunity.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>Venue: {selectedOpportunity.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>Address: {selectedOpportunity.address}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Event Information</h4>
                  <div className="space-y-3 text-gray-300">
                    <div>
                      <span className="font-medium">Sport: </span>
                      {selectedOpportunity.sport}
                    </div>
                    <div>
                      <span className="font-medium">Difficulty: </span>
                      <Badge className={`ml-2 ${
                        selectedOpportunity.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                        selectedOpportunity.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedOpportunity.difficulty?.charAt(0).toUpperCase() + selectedOpportunity.difficulty?.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Status: </span>
                      <Badge className={`ml-2 ${
                        selectedOpportunity.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        selectedOpportunity.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        selectedOpportunity.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedOpportunity.status?.charAt(0).toUpperCase() + selectedOpportunity.status?.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-2">Description</h4>
                <p className="text-gray-300 font-['Figtree',sans-serif] leading-relaxed">
                  {selectedOpportunity.description}
                </p>
              </div>
              
              {selectedOpportunity.requirements && selectedOpportunity.requirements.length > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-2">Photographer Requirements</h4>
                  <div className="text-gray-300">
                    {Array.isArray(selectedOpportunity.requirements) ? (
                      <ul className="list-disc list-inside space-y-1">
                        {selectedOpportunity.requirements.map((req: string, index: number) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>{selectedOpportunity.requirements}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Opportunity Modal */}
      {showEdit && editOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-neutral-800 border-neutral-700 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-2xl font-['Merriweather',serif]">
                  Edit Opportunity
                </CardTitle>
                <Button
                  onClick={closeEdit}
                  size="sm"
                  className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditSave} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Event Title *</label>
                    <Input
                      name="title"
                      value={editOpportunity.title}
                      onChange={handleEditChange}
                      placeholder="e.g., High School Basketball Championship"
                      className="bg-neutral-700 border-neutral-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Sport *</label>
                    <Input
                      name="sport"
                      value={editOpportunity.sport}
                      onChange={handleEditChange}
                      placeholder="e.g., Basketball, Soccer, Track & Field"
                      className="bg-neutral-700 border-neutral-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Date *</label>
                    <Input
                      name="date"
                      type="date"
                      value={editOpportunity.date}
                      onChange={handleEditChange}
                      className="bg-neutral-700 border-neutral-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Start Time *</label>
                    <Input
                      name="time"
                      type="time"
                      value={editOpportunity.time}
                      onChange={handleEditChange}
                      className="bg-neutral-700 border-neutral-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Difficulty Level</label>
                    <select
                      name="difficulty"
                      value={editOpportunity.difficulty}
                      onChange={handleEditChange}
                      className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white font-medium mb-2">Venue Name *</label>
                    <Input
                      name="location"
                      value={editOpportunity.location}
                      onChange={handleEditChange}
                      placeholder="e.g., Central High School Gymnasium"
                      className="bg-neutral-700 border-neutral-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Full Address *</label>
                    <Input
                      name="address"
                      value={editOpportunity.address}
                      onChange={handleEditChange}
                      placeholder="e.g., 123 Main St, City, State 90210"
                      className="bg-neutral-700 border-neutral-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Event Description *</label>
                  <textarea
                    name="description"
                    value={editOpportunity.description}
                    onChange={handleEditChange}
                    placeholder="Describe the event, what type of coverage you need, and any special requirements..."
                    className="w-full h-32 bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Photographer Requirements</label>
                  <textarea
                    name="requirements"
                    value={Array.isArray(editOpportunity.requirements) ? editOpportunity.requirements.join(', ') : editOpportunity.requirements || ''}
                    onChange={handleEditChange}
                    placeholder="List any specific requirements (equipment, experience level, availability, etc.)"
                    className="w-full h-24 bg-neutral-700 border border-neutral-600 rounded-lg p-3 text-white placeholder-gray-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Status</label>
                  <select
                    name="status"
                    value={editOpportunity.status}
                    onChange={handleEditChange}
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <div className="text-sm text-gray-400">
                    * Required fields
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={closeEdit}
                      className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3">
                      Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 