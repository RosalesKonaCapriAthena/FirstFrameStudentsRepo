import React, { useEffect, useState } from "react";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { 
  Camera, 
  Users, 
  Award, 
  Globe, 
  Heart, 
  Target,
  ArrowRight
} from "lucide-react";

export const BenefitsOverviewSection = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('benefits-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  // Data for the benefit cards
  const benefitCards = [
    {
      title: "For Student Photographers",
      image: "https://images.pexels.com/photos/1263986/pexels-photo-1263986.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      benefits: [
        "Browse pickup events near you",
        "Contact event organizers directly", 
        "Build a profile with your photo portfolio",
        "Get experience and community exposure",
      ],
    },
    {
      title: "For Event Organizers",
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      benefits: [
        "Post pickup events",
        "Connect with student photographers",
        "Get free or low-cost photography coverage",
        "Support youth creative development",
      ],
    },
  ];

  const benefits = [
    {
      icon: <Camera className="w-8 h-8 text-orange-500" />,
      title: "Portfolio Building",
      description: "Gain real-world experience and build a professional portfolio showcasing your sports photography skills."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Community Connection",
      description: "Connect with local sports organizations and build relationships within your community."
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" />,
      title: "Skill Development",
      description: "Improve your photography techniques through hands-on experience with dynamic sports events."
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-500" />,
      title: "Networking Opportunities",
      description: "Meet other photographers, coaches, and sports enthusiasts to expand your professional network."
    },
    {
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      title: "Passion Projects",
      description: "Pursue your passion for sports photography while contributing to your local community."
    },
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: "Career Preparation",
      description: "Get valuable experience that can help prepare you for a career in sports photography."
    }
  ];

  return (
    <section id="benefits-section" className="w-full py-20 px-10 bg-neutral-800">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge className={`mb-6 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20 transition-all duration-1500 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Benefits
          </Badge>
          <h2 className={`text-4xl md:text-5xl font-bold text-white mb-6 font-['Merriweather',serif] transition-all duration-1500 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Why Choose First Frame?
          </h2>
          <p className={`text-xl text-gray-300 max-w-3xl mx-auto transition-all duration-1500 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Discover the advantages of joining our community of student photographers and sports organizations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className={`bg-neutral-900 border-neutral-700 hover:border-orange-500/30 transition-all duration-700 hover:transform hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${1200 + index * 200}ms`,
                transitionDuration: '1500ms'
              }}
            >
              <CardContent className="p-6 text-center group">
                <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-['Merriweather',serif] group-hover:text-orange-400 transition-colors duration-500">
                  {benefit.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-['Figtree',sans-serif] group-hover:text-gray-300 transition-colors duration-500">
                  {benefit.description}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <ArrowRight className="w-5 h-5 text-orange-500 mx-auto" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};