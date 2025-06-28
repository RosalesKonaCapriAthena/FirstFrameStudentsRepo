import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { useUser as useAppUser } from "../../../../lib/hooks/useUser";
import { getInitials } from "../../../../lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../../../../components/ui/navigation-menu";
import { Button } from "../../../../components/ui/button";
import { 
  User, 
  Settings, 
  LogOut,
  ChevronDown
} from "lucide-react";

export const NavigationSection = (): JSX.Element => {
  const location = useLocation();
  const { isSignedIn, user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { user: appUser, loading: isAppUserLoading } = useAppUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Navigation menu items data
  const menuItems = [
    { label: "Home", path: "/" },
    { label: "For Students", path: "/students" },
    { label: "For Organizers", path: "/organizers" },
    { label: "Gallery", path: "/portfolio" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const isLoading = !isClerkLoaded || isAppUserLoading;

  return (
    <header className="w-full sticky top-0 left-0 z-50">
      <nav className="flex items-center justify-center px-10 py-2.5 bg-neutral-900 border-b border-neutral-950 relative">
        <div className="flex w-full max-w-[1200px] items-center justify-center relative">
          {/* Logo section - positioned absolutely on the left */}
          <div className="absolute left-0">
            <Link to="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              {/* Logo image removed */}
              <div className="[font-family:'Figtree',Helvetica] font-bold text-white text-[21px] tracking-[-1.26px] leading-[25.2px]">
                First Frame
              </div>
            </Link>
          </div>

          {/* Navigation menu - centered */}
          <NavigationMenu>
            <NavigationMenuList className="flex items-center">
              {menuItems.map((item, index) => (
                <NavigationMenuItem key={index}>
                  <Link to={item.path}>
                    <NavigationMenuLink 
                      className={`inline-flex items-center justify-center pt-[7px] pb-2 px-3.5 rounded [font-family:'Figtree',Helvetica] font-medium text-sm tracking-[-0.28px] leading-[16.8px] transition-colors ${
                        location.pathname === item.path 
                          ? 'text-orange-500 bg-orange-500/10' 
                          : 'text-white hover:text-orange-400'
                      }`}
                    >
                      {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Authentication buttons - positioned absolutely on the right */}
          <div className="absolute right-0 flex items-center gap-2">
            {isLoading ? (
              <div className="w-[140px] flex items-center justify-end pr-2">
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : isSignedIn ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 text-white hover:bg-neutral-800"
                >
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center overflow-hidden">
                    {appUser?.profile_picture_url ? (
                      <img 
                        src={appUser.profile_picture_url} 
                        alt={appUser.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-sm font-bold">
                        {appUser ? getInitials(appUser.full_name) : 'U'}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {appUser?.full_name || clerkUser?.firstName || clerkUser?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Profile'}
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </Button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-white hover:bg-neutral-700 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/profile?tab=settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-4 py-2 text-white hover:bg-neutral-700 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t border-neutral-700 my-1"></div>
                      <SignOutButton>
                        <button className="flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-neutral-700 transition-colors w-full text-left">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </SignOutButton>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* Click outside to close dropdown */}
      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </header>
  );
};
