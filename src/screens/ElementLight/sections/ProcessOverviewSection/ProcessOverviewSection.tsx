import React, { useEffect, useState } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { 
  Search, 
  Camera, 
  Share, 
  Users,
  ArrowRight
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../lib/hooks/useUser";

export const ProcessOverviewSection = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('process-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const handleJoinFirstFrame = () => {
    if (!user) {
      // If not logged in, go to auth page
      navigate('/auth');
    } else if (user.user_type === 'student') {
      // If logged in as student, go to students page
      navigate('/students');
    } else if (user.user_type === 'organizer') {
      // If logged in as organizer, go to organizers page
      navigate('/organizers');
    } else {
      // Default to students page
      navigate('/students');
    }
  };

  const steps = [
    {
      icon: <Search className="w-8 h-8 text-orange-500" />,
      title: "Find Opportunities",
      description: "Browse available sports events in your area and find photography opportunities that match your interests and skills.",
      step: "01"
    },
    {
      icon: <Camera className="w-8 h-8 text-orange-500" />,
      title: "Capture the Moment",
      description: "Attend the event and capture stunning sports photography using your creative vision and technical skills.",
      step: "02"
    },
    {
      icon: <Share className="w-8 h-8 text-orange-500" />,
      title: "Share Your Work",
      description: "Upload your best shots to your portfolio and share them with the community and event organizers.",
      step: "03"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Build Connections",
      description: "Connect with other photographers, coaches, and sports enthusiasts to grow your network and opportunities.",
      step: "04"
    }
  ];

  return (
    <section id="process-section" className="w-full py-20 px-10 bg-neutral-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className={`mb-6 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20 transition-all duration-1500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            How It Works
          </Badge>
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 font-['Merriweather',serif] transition-all duration-1500 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Simple Steps to Get Started
          </h2>
          <p className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1500 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Join our community in just a few easy steps and start capturing amazing sports moments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`text-center transition-all duration-1500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${1200 + index * 300}ms`
              }}
            >
              <div className="relative mb-6 group">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-700 group-hover:shadow-orange-500/25">
                  {index + 1}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-xl"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-['Merriweather',serif] group-hover:text-orange-400 transition-colors duration-700">
                {step.title}
              </h3>
              <p className="text-gray-400 leading-relaxed font-['Figtree',sans-serif] group-hover:text-gray-300 transition-colors duration-700">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-1500 delay-2000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <Button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-lg font-medium transition-all duration-500 shadow-2xl hover:shadow-orange-500/25 border border-orange-400/20 transform hover:scale-105 active:scale-95" onClick={handleJoinFirstFrame}>
            <span className="font-['Figtree',sans-serif] font-medium tracking-tight">
              Join First Frame
            </span>
            <ArrowRightIcon className="w-5 h-5 ml-2 transition-transform duration-500 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};