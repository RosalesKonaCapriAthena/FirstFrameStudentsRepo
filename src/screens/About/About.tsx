import React from "react";
import { NavigationSection } from "../ElementLight/sections/NavigationSection/NavigationSection";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../lib/hooks/useUser";
import { 
  Camera, 
  Users, 
  Target, 
  Heart, 
  Award, 
  Globe,
  Mail,
  Linkedin,
  Twitter,
  Instagram
} from "lucide-react";

export const About = (): JSX.Element => {
  const navigate = useNavigate();
  const { user } = useUser();

  const handleGetStarted = () => {
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

  const handleJoinCommunity = () => {
    if (!user) {
      // If not logged in, go to auth page
      navigate('/auth');
    } else {
      // If logged in, go to students page (default)
      navigate('/students');
    }
  };

  const teamMembers = [
    {
      name: "Taylor Schmedeman",
      role: "Founder",
      image: "https://res.cloudinary.com/djwnjp7er/image/upload/v1751189025/IMG_0107_rp78av.jpg",
      bio: "Senior at Hamilton High School passionate about photography and dedicated to making creative opportunities more accessible for student photographers.",
      social: {
        linkedin: "#",
        instagram: "https://www.instagram.com/talobeey/",
        email: "tschmede83@gmail.com"
      }
    },
    {
      name: "Gavin Rosales",
      role: "Founder",
      image: "https://res.cloudinary.com/djwnjp7er/image/upload/v1751188855/blank-profile-picture-973460_1280_mapt7e.webp",
      bio: "Senior at LACES High School with a passion for photography and a mission to help other students gain access to real-world creative opportunities through visual storytelling.",
      social: {
        linkedin: "https://www.linkedin.com/in/gavin-rosales-7012a4369/",
        instagram: "https://www.instagram.com/gavin.rosales/",
        email: "gavinrosales@icloud.com"
      }
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8 text-orange-500" />,
      title: "Community First",
      description: "We believe in building strong, supportive communities where young photographers can thrive and grow together."
    },
    {
      icon: <Target className="w-8 h-8 text-orange-500" />,
      title: "Empowerment",
      description: "Every student deserves the opportunity to develop their creative skills and showcase their unique perspective."
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" />,
      title: "Excellence",
      description: "We strive for excellence in everything we do, from our platform to the opportunities we create for students."
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-500" />,
      title: "Accessibility",
      description: "Making photography opportunities accessible to all students, regardless of their background or resources."
    }
  ];

  return (
    <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
      <NavigationSection />
      
      {/* Hero Section */}
      <section className="relative w-full py-20 px-10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="mb-6 bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">
            About First Frame
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-['Merriweather',serif] tracking-tight">
            Connecting Passion with
            <span className="block text-orange-500">Opportunity</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-['Figtree',sans-serif]">
            First Frame is more than just a platform—we're a community dedicated to empowering the next generation of sports photographers and bringing communities together through the art of visual storytelling.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="w-full py-20 px-10 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6 font-['Merriweather',serif]">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed font-['Figtree',sans-serif]">
                We're on a mission to democratize sports photography by connecting talented high school photographers with local sports events, creating opportunities for skill development, portfolio building, and community engagement.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed font-['Figtree',sans-serif]">
                Through our platform, students gain real-world experience, build professional networks, and contribute to their communities while pursuing their passion for photography.
              </p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300" onClick={handleJoinCommunity}>
                Join Our Community
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl p-8 border border-orange-500/20">
                <Camera className="w-16 h-16 text-orange-500 mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4 font-['Merriweather',serif]">
                  The First Frame Story
                </h3>
                <p className="text-gray-300 leading-relaxed font-['Figtree',sans-serif]">
                Founded in 2025, FirstFrame emerged from a simple observation: talented young photographers needed opportunities, and local sports events needed professional coverage. Built by two high school students with a passion for sports and storytelling, FirstFrame bridges that gap — connecting student creators with real-world experience and community impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full py-20 px-10 bg-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 font-['Merriweather',serif]">
              Our Values
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-['Figtree',sans-serif]">
              These core principles guide everything we do at First Frame
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-neutral-900 border-neutral-700 hover:border-orange-500/30 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-['Merriweather',serif]">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-['Figtree',sans-serif]">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="w-full py-20 px-10 bg-neutral-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6 font-['Merriweather',serif]">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-['Figtree',sans-serif]">
              The passionate individuals behind First Frame's mission to empower young photographers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center items-center mx-auto max-w-2xl">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-neutral-800 border-neutral-700 hover:border-orange-500/30 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-neutral-700 group-hover:border-orange-500/50 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 font-['Merriweather',serif]">
                    {member.name}
                  </h3>
                  <p className="text-orange-500 font-medium mb-4 font-['Figtree',sans-serif]">
                    {member.role}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 font-['Figtree',sans-serif]">
                    {member.bio}
                  </p>
                  <div className="flex justify-center gap-3">
                    <a href={member.social.linkedin} className="text-gray-400 hover:text-orange-500 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={member.social.instagram} className="text-gray-400 hover:text-orange-500 transition-colors">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href={`mailto:${member.social.email}`} className="text-gray-400 hover:text-orange-500 transition-colors">
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 px-10 bg-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2"></div>
              <div className="text-gray-300 font-medium font-['Figtree',sans-serif]"></div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2"></div>
              <div className="text-gray-300 font-medium font-['Figtree',sans-serif]"></div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2"></div>
              <div className="text-gray-300 font-medium font-['Figtree',sans-serif]"></div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2"></div>
              <div className="text-gray-300 font-medium font-['Figtree',sans-serif]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-10 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-['Merriweather',serif]">
            Ready to Join First Frame?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto font-['Figtree',sans-serif]">
            Whether you're a student photographer looking for opportunities or an event organizer seeking coverage, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-all duration-300" onClick={handleGetStarted}>
              Get Started as Student
            </Button>
            <Link to="/contact">
              <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-3 rounded-lg font-medium transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t-2 border-[#222222] px-10 py-[25px]">
        <div className="flex items-center w-full">
          <div className="font-medium text-[#cccccc] text-sm tracking-[-0.28px]">
            © 2025 First Frame. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}; 