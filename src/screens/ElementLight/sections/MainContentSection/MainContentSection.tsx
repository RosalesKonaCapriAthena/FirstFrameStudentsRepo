import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Separator } from "../../../../components/ui/separator";

export const MainContentSection = (): JSX.Element => {
  // Navigation links data
  const navigationLinks = {
    links: [
      { label: "For Students", path: "/students" },
      { label: "For Organizers", path: "/organizers" },
      { label: "Gallery", path: "/portfolio" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" }
    ],
    pages: [
      { label: "Home", path: "/" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
    ],
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/firstframestudents/" },
      { label: "Discord", url: "https://discord.gg/sDFEwtEdTe" }
    ],
  };

  return (
    <footer className="w-full relative">
      <Separator className="border-t-2 border-[#222222]" />
      <div className="px-10 py-16 [background:radial-gradient(50%_50%_at_50%_3%,rgba(249,115,22,0.3)_0%,rgba(249,115,22,0)_100%)] flex flex-col items-center justify-center w-full">
        <div className="flex max-w-[1200px] items-start justify-center gap-5 w-full">
          {/* Left column - Logo, slogan and newsletter */}
          <div className="flex flex-col items-start justify-center gap-[15px] flex-1">
            <div className="flex flex-col items-start justify-center gap-[19px] w-full">
              {/* Logo and brand name */}
              <div className="inline-flex items-center gap-1">
                <h2 className="font-['Figtree',Helvetica] font-bold text-white text-3xl tracking-[-1.80px] leading-9">
                  First Frame
                </h2>
              </div>

              {/* Slogan */}
              <p className="font-['Figtree',Helvetica] font-medium text-white text-base tracking-[-0.32px] leading-[22.4px]">
                Frist Frame - Capture the Game. Frame the Moment.
              </p>
            </div>

            {/* Newsletter section */}
            <div className="flex flex-col items-start justify-center gap-2.5 w-full">
              <h3 className="font-['Figtree',Helvetica] font-medium text-white text-lg tracking-[-0.36px] leading-[27px]">
                Join our newsletter
              </h3>

              <div className="w-80 max-w-xs relative">
                <div className="flex items-center">
                  <div className="relative w-full">
                    <Input
                      className="pl-[15px] py-[15px] bg-[#0d0d0dcc] text-[#cccccc] font-['Figtree',Helvetica] font-medium border-[#222222] rounded-lg h-[49px]"
                      placeholder="name@email.com"
                    />
                    <Button className="absolute right-0 top-[5px] h-[39px] w-[100px] bg-orange-500 hover:bg-orange-600 font-['Figtree',Helvetica] font-medium text-white rounded-[3px]">
                      Subscribe
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right columns - Navigation links */}
          <div className="flex items-start justify-center gap-2.5 flex-1">
            {/* Links column */}
            <div className="flex flex-col items-start justify-center gap-1.5 flex-1">
              <h3 className="font-['Figtree',Helvetica] font-medium text-white text-lg tracking-[-0.36px] leading-[27px]">
                Links
              </h3>
              {navigationLinks.links.map((link, index) => (
                <Link
                  key={`link-${index}`}
                  to={link.path}
                  className="font-['Figtree',Helvetica] font-medium text-white text-base tracking-[-0.32px] leading-[22.4px] hover:text-orange-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Pages column */}
            <div className="flex flex-col items-start justify-center gap-1.5 flex-1">
              <h3 className="font-['Figtree',Helvetica] font-medium text-white text-lg tracking-[-0.36px] leading-[27px]">
                Pages
              </h3>
              {navigationLinks.pages.map((page, index) => (
                <Link
                  key={`page-${index}`}
                  to={page.path}
                  className="font-['Figtree',Helvetica] font-medium text-white text-base tracking-[-0.32px] leading-[22.4px] hover:text-orange-300"
                >
                  {page.label}
                </Link>
              ))}
            </div>

            {/* Socials column */}
            <div className="flex flex-col items-start justify-center gap-1.5 flex-1">
              <h3 className="font-['Figtree',Helvetica] font-medium text-white text-lg tracking-[-0.36px] leading-[27px]">
                Socials
              </h3>
              {navigationLinks.socials.map((social, index) => (
                <a
                  key={`social-${index}`}
                  href={social.url}
                  className="font-['Figtree',Helvetica] font-medium text-white text-base tracking-[-0.32px] leading-[22.4px] hover:text-orange-300"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
