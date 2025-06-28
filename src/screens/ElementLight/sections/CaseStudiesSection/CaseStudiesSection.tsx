import React, { useState, useEffect } from "react";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from "lucide-react";

export const CaseStudiesSection = (): JSX.Element => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const galleryImages = [
    {
      id: 1,
      title: "Basketball Championship",
      description: "Capturing the intensity of high school basketball championships",
      image: "https://www.si.com/.image/t_share/MTY4MTg5NDQ0MjYwNTcxMDM3/77-joe-dimaggio-1941-fsjpg.jpg",
      sport: "Basketball"
    },
    {
      id: 2,
      title: "Soccer Tournament",
      description: "Dynamic moments from youth soccer tournaments",
      image: "https://www.si.com/.image/t_share/MTY4MTg5NDQ0MjU4NjA0OTU3/new-santonio-holmesjpg.jpg",
      sport: "Soccer"
    },
    {
      id: 3,
      title: "Track & Field",
      description: "The speed and precision of track and field events",
      image: "https://www.cllct.com/_next/image?url=https%3A%2F%2Fuploads.cllct.com%2Ffreeman_homer_6201b88a4d.jpg&w=3840&q=75",
      sport: "Track & Field"
    },
    {
      id: 4,
      title: "Swimming Competition",
      description: "Underwater and surface shots from swimming meets",
      image: "https://static0.footballfancastimages.com/wordpress/wp-content/uploads/2023/08/lionel-messi-barcelona.jpeg",
      sport: "Swimming"
    },
    {
      id: 5,
      title: "Tennis Match",
      description: "The focus and technique of tennis players",
      image: "https://media.npr.org/assets/img/2022/02/10/gettyimages-1369869411-a1d41199dae1ce3cb0227e55c208e6b849e6b85f.jpg?s=1100&c=50&f=jpeg",
      sport: "Tennis"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, galleryImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="flex flex-col items-center justify-center gap-[60px] px-10 py-[100px] w-full">
      <div className="flex flex-col w-full max-w-[1840px] items-center justify-center gap-[25px]">
        <div className="inline-flex flex-col items-start relative z-[1]">
          <Badge
            className="relative bg-[#0d0d0dcc] text-white font-medium border-[#222222] rounded-md py-[7px] px-3"
          >
            Gallery
          </Badge>
        </div>

        <div className="flex flex-col w-full max-w-[1840px] items-center justify-center gap-[15px] z-0">
          <div className="flex flex-col max-w-[700px] w-full items-center">
            <h2 className="font-semibold text-white text-[49.4px] text-center tracking-[-2.00px] leading-[55px] font-['Figtree',Helvetica]">
              Photography Gallery
            </h2>
          </div>

          <div className="flex flex-col max-w-[600px] w-full items-center">
            <p className="font-medium text-[#cccccc] text-lg text-center tracking-[-0.36px] leading-[27px] font-['Figtree',Helvetica]">
              Explore stunning sports photography captured by talented student photographers
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full max-w-[1000px] items-center justify-center gap-6">
        {/* Slideshow Container */}
        <div className="relative w-full h-[500px] overflow-hidden rounded-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {galleryImages.map((image, index) => (
              <div key={image.id} className="w-full h-full flex-shrink-0 relative">
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-12 h-12"
            size="sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-12 h-12"
            size="sm"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Play/Pause Button */}
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-10 h-10"
            size="sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>

        {/* Slide Indicators */}
        <div className="flex items-center justify-center gap-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-orange-500 w-8' 
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="flex items-center justify-center gap-4">
          <div className="inline-flex flex-col items-start">
            <p className="font-medium text-[#cccccc] text-sm tracking-[-0.28px] leading-[16.8px] whitespace-nowrap font-['Figtree',Helvetica]">
              {currentSlide + 1} / {galleryImages.length}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full max-w-[600px] items-center">
          <Button
            className="border border-neutral-600 bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Read More
          </Button>
        </div>
      </div>
    </section>
  );
};
