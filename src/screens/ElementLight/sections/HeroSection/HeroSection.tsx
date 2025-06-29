import { ArrowRightIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../lib/hooks/useUser";

export const HeroSection = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    setIsVisible(true);
  }, []);

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

  return (
    <section className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://gku.swr.mybluehost.me/website_d4eaa78c/wp-content/uploads/2017/03/nba_jordan_08.jpg"
          alt="Sports photography background"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 sm:gap-8 px-4 sm:px-10 py-16 sm:py-20 w-full max-w-6xl mx-auto text-center">
        {/* Main Title */}
        <div className={`flex flex-col items-center gap-3 sm:gap-4 transition-all duration-1500 ease-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}>
          <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-normal leading-tight">
            <span className={`block text-white font-['Merriweather',serif] tracking-tight transition-all duration-1500 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              Capture the Game.
            </span>
            <span className={`block text-orange-500 font-['Merriweather',serif] tracking-tight transition-all duration-1500 delay-800 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              Frame the Moment.
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div className={`max-w-4xl mx-auto px-4 transition-all duration-1500 delay-1100 ease-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-['Figtree',sans-serif] font-medium">
            First Frame empowers high school photographers to connect with local pickup sports events,
            build their creative skills, and share their work with the community.
          </p>
        </div>

        {/* CTA Button */}
        <div className={`mt-2 sm:mt-4 transition-all duration-1500 delay-1400 ease-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
        }`}>
          <Button 
            onClick={handleGetStarted}
            className="relative px-4 sm:px-6 py-3 sm:py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-base sm:text-lg font-medium transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 border border-orange-400/20 transform hover:scale-105 active:scale-95 group w-full sm:w-auto"
          >
            <span className="font-['Figtree',sans-serif] font-medium tracking-tight">
              Get Started
            </span>
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 transition-all duration-1500 delay-1700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <div className="flex flex-col items-center gap-2 text-white/60 animate-bounce">
          <span className="text-sm font-['Figtree',sans-serif] tracking-wide">SCROLL</span>
          <div className="w-px h-8 bg-white/30"></div>
        </div>
      </div>
    </section>
  );
};