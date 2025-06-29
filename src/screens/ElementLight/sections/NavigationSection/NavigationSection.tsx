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
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export const NavigationSection = (): JSX.Element => {
  const location = useLocation();
  const { isSignedIn, user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const { user: appUser, loading: isAppUserLoading } = useAppUser();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
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
      <nav className="flex items-center justify-center px-4 sm:px-10 py-2.5 bg-neutral-900 border-b border-neutral-950 relative">
        <div className="flex w-full max-w-[1200px] items-center justify-center relative">
          {/* Logo section - positioned absolutely on the left */}
          <div className="absolute left-0">
            <Link to="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
              {/* Logo image removed */}
              <div className="[font-family:'Figtree',Helvetica] font-bold text-white text-lg sm:text-[21px] tracking-[-1.26px] leading-[25.2px]">
                First Frame
              </div>
            </Link>
          </div>

          {/* Desktop Navigation menu - centered */}
          <NavigationMenu className="hidden md:block">
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

          {/* Mobile menu button */}
          <div className="absolute right-0 flex items-center gap-2">
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-white hover:bg-neutral-800 p-2"
              aria-label="Toggle mobile menu"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>

            {/* Desktop Authentication buttons */}
            <div className="hidden md:flex items-center gap-2">
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
                    <span className="text-sm font-medium">
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

            {/* Mobile authentication - simplified */}
            <div className="md:hidden">
              {isLoading ? (
                <div className="w-8 h-8 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : isSignedIn ? (
                <Link to="/profile">
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
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white p-2">
                    <span className="sr-only">Sign In</span>
                    <User className="w-4 h-4" />
                  </Button>
                </SignInButton>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="absolute top-full left-0 right-0 bg-neutral-900 border-b border-neutral-700 md:hidden">
            <div className="px-4 py-4 space-y-2">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'text-orange-500 bg-orange-500/10' 
                      : 'text-white hover:text-orange-400 hover:bg-neutral-800'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile auth section */}
              {isSignedIn && (
                <div className="border-t border-neutral-700 pt-4 mt-4">
                  <div className="px-4 py-2 text-sm text-gray-400">
                    Signed in as {appUser?.full_name || clerkUser?.firstName || 'User'}
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-3 text-white hover:text-orange-400 hover:bg-neutral-800 rounded-lg"
                  >
                    Profile
                  </Link>
                  <SignOutButton>
                    <button 
                      onClick={() => setShowMobileMenu(false)}
                      className="block w-full text-left px-4 py-3 text-red-400 hover:bg-neutral-800 rounded-lg"
                    >
                      Sign Out
                    </button>
                  </SignOutButton>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Click outside to close dropdowns */}
      {(showProfileMenu || showMobileMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowProfileMenu(false);
            setShowMobileMenu(false);
          }}
        />
      )}
    </header>
  );
};
