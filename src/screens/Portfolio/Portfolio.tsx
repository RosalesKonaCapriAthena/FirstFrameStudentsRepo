import React, { useState } from "react";
import { NavigationSection } from "../ElementLight/sections/NavigationSection/NavigationSection";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { 
  Grid3X3, 
  Heart, 
  Eye, 
  Download, 
  Share2, 
  Filter,
  Search,
  Camera,
  MapPin,
  Calendar,
  Star,
  User,
  Award,
  Instagram,
  Globe,
  Mail,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

export const Portfolio = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("featured");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Sports", icon: "🏃" },
    { id: "basketball", label: "Basketball", icon: "🏀" },
    { id: "soccer", label: "Soccer", icon: "⚽" },
    { id: "football", label: "Football", icon: "🏈" },
    { id: "baseball", label: "Baseball", icon: "⚾" },
    { id: "track", label: "Track & Field", icon: "🏃‍♂️" },
    { id: "swimming", label: "Swimming", icon: "🏊" },
    { id: "tennis", label: "Tennis", icon: "🎾" }
  ];

  const featuredPhotographers = [
    {
      id: 1,
      name: "Sarah Chen",
      location: "Los Angeles, CA",
      experience: "Advanced",
      bio: "Specializing in basketball and track photography. Passionate about capturing the intensity and emotion of competitive sports.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400",
      portfolio: "sarahchen.portfolio.com",
      instagram: "@sarahchen.photo",
      featuredImage: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 247,
      views: 1200
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      location: "Miami, FL",
      experience: "Intermediate",
      bio: "Focusing on soccer and swimming. Love capturing the fluid motion and dynamic moments in water sports.",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      portfolio: "marcusrodriguez.portfolio.com",
      instagram: "@marcus.rodriguez.photo",
      featuredImage: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 189,
      views: 890
    },
    {
      id: 3,
      name: "Emily Watson",
      location: "Chicago, IL",
      experience: "Advanced",
      bio: "Expert in football and baseball photography. Capturing the strategic moments and team dynamics.",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      portfolio: "emilywatson.portfolio.com",
      instagram: "@emily.watson.photo",
      featuredImage: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=800",
      likes: 312,
      views: 1500
    }
  ];

  const portfolioImages = [
    {
      id: 1,
      title: "Basketball Championship Moment",
      photographer: "Sarah Chen",
      category: "basketball",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600",
      likes: 156,
      views: 890,
      date: "March 2024"
    },
    {
      id: 2,
      title: "Soccer Goal Celebration",
      photographer: "Marcus Rodriguez",
      category: "soccer",
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600",
      likes: 98,
      views: 567,
      date: "March 2024"
    },
    {
      id: 3,
      title: "Track Sprint Finish",
      photographer: "Emily Watson",
      category: "track",
      image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=600",
      likes: 203,
      views: 1200,
      date: "February 2024"
    },
    {
      id: 4,
      title: "Swimming Butterfly Stroke",
      photographer: "David Kim",
      category: "swimming",
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=600",
      likes: 134,
      views: 745,
      date: "February 2024"
    },
    {
      id: 5,
      title: "Tennis Serve Action",
      photographer: "Alex Johnson",
      category: "tennis",
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600",
      likes: 87,
      views: 432,
      date: "January 2024"
    },
    {
      id: 6,
      title: "Football Quarterback Pass",
      photographer: "Mike Thompson",
      category: "football",
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600",
      likes: 178,
      views: 980,
      date: "January 2024"
    },
    {
      id: 7,
      title: "Baseball Home Run",
      photographer: "Jessica Lee",
      category: "baseball",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600",
      likes: 145,
      views: 823,
      date: "December 2023"
    },
    {
      id: 8,
      title: "Basketball Dunk",
      photographer: "Sarah Chen",
      category: "basketball",
      image: "https://images.pexels.com/photos/3807755/pexels-photo-3807755.jpeg?auto=compress&cs=tinysrgb&w=600",
      likes: 267,
      views: 1400,
      date: "December 2023"
    }
  ];

  const filteredImages = selectedCategory === "all" 
    ? portfolioImages 
    : portfolioImages.filter(img => img.category === selectedCategory);

  return (
    <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
      <NavigationSection />
      <div className="flex flex-1 flex-col items-center justify-center w-full min-h-[60vh]">
        <div className="text-center mt-32">
          <h1 className="text-5xl font-bold text-white mb-6 font-['Merriweather',serif]">Gallery</h1>
          <p className="text-2xl text-orange-500 mb-4 font-['Figtree',sans-serif]">Coming Soon</p>
          <p className="text-gray-400 max-w-xl mx-auto font-['Figtree',sans-serif]">
            We're working hard to bring you an amazing gallery experience. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
}; 