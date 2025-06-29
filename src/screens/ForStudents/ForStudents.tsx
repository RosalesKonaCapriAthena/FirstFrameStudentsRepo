import React, { useState } from "react";
import { NavigationSection } from "../ElementLight/sections/NavigationSection/NavigationSection";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { useOpportunities } from "../../lib/hooks/useOpportunities";
import { useApplications } from "../../lib/hooks/useApplications";
import { useUser } from "../../lib/hooks/useUser";
import { SearchFiltersComponent } from "../../components/SearchFilters";
import { OpportunityMap } from "../../components/OpportunityMap";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Camera, 
  BookOpen, 
  Video, 
  FileText,
  Star,
  Filter,
  Search,
  DollarSign,
  Award,
  Play,
  Download,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import emailjs from 'emailjs-com';

// Add type for opportunity with optional organizer
import type { Database } from '../../lib/database.types';
type OpportunityWithOrganizer = Database['public']['Tables']['opportunities']['Row'] & { organizer?: { full_name?: string, badges?: string[] } };

export const ForStudents = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("shoots");
  const { 
    opportunities, 
    filteredOpportunities,
    loading, 
    searchOpportunities, 
    clearFilters, 
    getUniqueSports, 
    getUniqueLocations,
    filters 
  } = useOpportunities();
  const { applications, createApplication, checkExistingApplication } = useApplications();
  const { user } = useUser();
  const [showApply, setShowApply] = useState(false);
  const [applyOpportunity, setApplyOpportunity] = useState<any>(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [applyLoading, setApplyLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // Check if already applied
  const hasApplied = (opportunityId: string) => {
    return applications.some(app => app.opportunity_id === opportunityId && app.photographer_id === user?.id);
  };

  const handleApplyClick = (opportunity: any) => {
    setApplyOpportunity(opportunity);
    setShowApply(true);
    setApplyMessage("");
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !applyOpportunity) return;
    setApplyLoading(true);
    try {
      await createApplication({
        opportunity_id: applyOpportunity.id,
        photographer_id: user.id,
        message: applyMessage,
        status: "pending"
      });

      // Send email to organizer
      try {
        const SERVICE_ID = 'service_ghndhun';
        const TEMPLATE_ID = 'template_51lf1nk';
        const PUBLIC_KEY = '0wMfSsa4TgwxSoztk';
        const templateParams = {
          from_name: user.full_name,
          from_email: user.email,
          to_email: applyOpportunity.organizer?.email || 'firstframestudents@gmail.com',
          subject: `New Application for ${applyOpportunity.title}`,
          message: `A new application has been submitted for your opportunity "${applyOpportunity.title}".\n\nApplicant Name: ${user.full_name}\nApplicant Email: ${user.email}\n\nOpportunity: ${applyOpportunity.title}\nLocation: ${applyOpportunity.location}\nDate: ${applyOpportunity.date}\nTime: ${applyOpportunity.time}`
        };
        await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      } catch (emailErr) {
        // Optionally log or show a warning, but don't block the application
        console.error('Failed to send application email:', emailErr);
      }

      setToastMessage("Application received! The organizer will be notified.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
      setShowApply(false);
    } catch (err) {
      setToastMessage("Failed to submit application");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } finally {
      setApplyLoading(false);
    }
  };

  const handleJoinCommunity = () => {
    setToastMessage("Welcome to the First Frame community! You're all set to start capturing amazing sports moments.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleDownloadResources = () => {
    setToastMessage("Resource pack download started! Check your downloads folder.");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleResourceClick = (resource: any) => {
    if (resource.type.includes('Video')) {
      setToastMessage(`Opening video: ${resource.title}`);
    } else {
      setToastMessage(`Opening guide: ${resource.title}`);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFiltersChange = (newFilters: any) => {
    searchOpportunities(newFilters);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  // Use filtered opportunities if filters are applied, otherwise use all opportunities
  const displayOpportunities = Object.values(filters).some(value => value && value !== '') 
    ? filteredOpportunities 
    : opportunities;

  const photographyResources = [
    {
      category: "Getting Started",
      resources: [
        {
          title: "Sports Photography Basics",
          type: "Video Tutorial",
          duration: "15 min",
          difficulty: "Beginner",
          description: "Learn the fundamentals of capturing fast-paced sports action.",
          thumbnail: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        },
        {
          title: "Camera Settings for Sports",
          type: "Guide",
          duration: "10 min read",
          difficulty: "Beginner",
          description: "Essential camera settings to freeze motion and capture sharp images.",
          thumbnail: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        },
        {
          title: "Equipment Guide for Beginners",
          type: "Article",
          duration: "8 min read",
          difficulty: "Beginner",
          description: "What gear you need to get started in sports photography.",
          thumbnail: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        }
      ]
    },
    {
      category: "Advanced Techniques",
      resources: [
        {
          title: "Panning Techniques",
          type: "Video Tutorial",
          duration: "20 min",
          difficulty: "Advanced",
          description: "Master the art of panning to create dynamic motion blur effects.",
          thumbnail: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        },
        {
          title: "Lighting in Indoor Sports",
          type: "Guide",
          duration: "12 min read",
          difficulty: "Intermediate",
          description: "How to work with challenging indoor lighting conditions.",
          thumbnail: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        },
        {
          title: "Post-Processing Workflow",
          type: "Video Tutorial",
          duration: "25 min",
          difficulty: "Intermediate",
          description: "Complete workflow from capture to final delivery.",
          thumbnail: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        }
      ]
    },
    {
      category: "Business & Marketing",
      resources: [
        {
          title: "Building Your Portfolio",
          type: "Guide",
          duration: "15 min read",
          difficulty: "All Levels",
          description: "How to showcase your best work and attract clients.",
          thumbnail: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        },
        {
          title: "Pricing Your Services",
          type: "Article",
          duration: "10 min read",
          difficulty: "Intermediate",
          description: "Understanding market rates and setting competitive prices.",
          thumbnail: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        },
        {
          title: "Client Communication",
          type: "Video Tutorial",
          duration: "18 min",
          difficulty: "All Levels",
          description: "Professional communication skills for photographers.",
          thumbnail: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=400",
          url: "#"
        }
      ]
    }
  ];

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
      
      {/* Hero Section */}
      <section className="relative w-full py-20 px-10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
            For Students
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-['Merriweather',serif] tracking-tight">
            Start Your Photography
            <span className="block text-orange-500">Journey</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-['Figtree',sans-serif]">
            Find exciting photography opportunities, build your portfolio, and learn from industry experts. Your path to becoming a professional sports photographer starts here.
          </p>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="w-full py-16 px-10 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-neutral-800 border border-neutral-700">
              <TabsTrigger 
                value="shoots" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Find Shoots
              </TabsTrigger>
              <TabsTrigger 
                value="resources" 
                className="data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learn & Resources
              </TabsTrigger>
            </TabsList>

            {/* Potential Shoots Tab */}
            <TabsContent value="shoots" className="mt-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Map Section */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                  <OpportunityMap 
                    opportunities={displayOpportunities}
                    loading={loading}
                    onOpportunityClick={(opportunity) => {
                      const element = document.getElementById(`opportunity-${opportunity.id}`);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setHighlightedId(opportunity.id);
                        setTimeout(() => setHighlightedId(null), 2000);
                      }
                    }}
                  />
                </div>

                {/* Shoots List */}
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <SearchFiltersComponent
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                      sports={getUniqueSports()}
                      locations={getUniqueLocations()}
                      loading={loading}
                    />
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white font-['Merriweather',serif]">
                      Available Shoots
                      {Object.values(filters).some(value => value && value !== '') && (
                        <span className="text-lg text-gray-400 ml-2">
                          ({displayOpportunities.length} results)
                        </span>
                      )}
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {loading ? (
                      <div className="text-center text-gray-400 py-12">Loading opportunities...</div>
                    ) : displayOpportunities.length === 0 ? (
                      <div className="text-center text-gray-400 py-12">
                        {Object.values(filters).some(value => value && value !== '') 
                          ? "No opportunities match your current filters. Try adjusting your search criteria."
                          : "No opportunities available right now."
                        }
                      </div>
                    ) : (
                      (displayOpportunities as OpportunityWithOrganizer[]).map((shoot) => {
                        console.log('Opportunity card data:', shoot);
                        return (
                          <Card 
                            key={shoot.id} 
                            id={`opportunity-${shoot.id}`} 
                            className={`bg-neutral-800 border-neutral-700 hover:border-orange-500/30 transition-all duration-300 ${highlightedId === shoot.id ? 'ring-4 ring-orange-400 ring-opacity-80 animate-pulse' : ''}`}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-white mb-2 font-['Merriweather',serif]">
                                    {shoot.title}
                                  </h3>
                                  {(shoot.organizer?.full_name) ? (
                                    <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">Posted by: <span className="font-semibold text-white flex items-center gap-1">{shoot.organizer.full_name}
                                      {shoot.organizer.badges?.includes('verified') && (
                                        <Badge className="bg-blue-500/20 text-blue-500 border-blue-500 flex items-center gap-1 ml-1">
                                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                          Verified
                                        </Badge>
                                      )}
                                    </span></div>
                                  ) : (
                                    <div className="text-xs text-gray-400 mb-2">Posted by: <span className="font-semibold text-white">Unknown Organizer</span></div>
                                  )}
                                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      {shoot.location}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-4 h-4" />
                                      {shoot.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      {shoot.time}
                                    </div>
                                  </div>
                                  <p className="text-gray-300 mb-4 font-['Figtree',sans-serif]">
                                    {shoot.description}
                                  </p>
                                </div>
                                <div className="text-right ml-4 flex gap-2">
                                  <Badge className={`${
                                    shoot.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                    shoot.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {shoot.difficulty?.charAt(0).toUpperCase() + shoot.difficulty?.slice(1)}
                                  </Badge>
                                  <Badge className="bg-blue-500/20 text-blue-400">
                                    {shoot.sport}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <h4 className="text-sm font-semibold text-white mb-2">Requirements:</h4>
                                <div className="flex flex-wrap gap-2">
                                  {(Array.isArray(shoot.requirements) ? shoot.requirements : (shoot.requirements ? [shoot.requirements] : [])).map((req, index) => (
                                    <Badge key={index} className="border border-neutral-600 bg-neutral-800 text-gray-300">
                                      {req}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-400">
                                  <span className="font-medium text-white">{shoot.address}</span>
                                </div>
                                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleApplyClick(shoot)} disabled={hasApplied(shoot.id)}>
                                  {hasApplied(shoot.id) ? "Applied" : "Capture Event"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="resources" className="mt-8">
              <div className="flex flex-col items-center justify-center min-h-[350px] w-full">
                <BookOpen className="w-20 h-20 mb-6 text-orange-500" />
                <h2 className="text-3xl font-bold text-white mb-2 font-['Merriweather',serif] text-center">
                  Learn & Resources
                </h2>
                <p className="text-gray-300 max-w-md mx-auto font-['Figtree',sans-serif] text-lg text-center">
                  This section is <span className="text-orange-400 font-semibold">coming soon</span>!<br />
                  Stay tuned for tutorials, guides, and resources to help you grow as a sports photographer.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Application Modal */}
      {showApply && applyOpportunity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-neutral-800 border-neutral-700">
            <CardHeader>
              <CardTitle className="text-white">Apply for {applyOpportunity.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message to Organizer (Optional)
                  </label>
                  <textarea
                    value={applyMessage}
                    onChange={(e) => setApplyMessage(e.target.value)}
                    placeholder="Tell the organizer why you'd be great for this shoot..."
                    className="w-full p-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={applyLoading}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {applyLoading ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowApply(false)}
                    className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}; 