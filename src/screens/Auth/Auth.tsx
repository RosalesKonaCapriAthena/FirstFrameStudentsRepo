import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { NavigationSection } from "../ElementLight/sections/NavigationSection/NavigationSection";

export const Auth = (): JSX.Element => {
  const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  return (
    <div className="flex flex-col w-full items-start relative bg-neutral-900 min-h-screen">
      <NavigationSection />
      
      <section className="relative w-full py-20 px-10 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 font-['Merriweather',serif] tracking-tight">
            Join First Frame
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-['Figtree',sans-serif]">
            Connect with local sports events and build your photography portfolio
          </p>
          {!clerkKey && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-400">Clerk key not found. Please check your environment variables.</p>
            </div>
          )}
        </div>
      </section>

      <section className="w-full py-16 px-10 bg-neutral-900">
        <div className="max-w-md mx-auto">
          {clerkKey ? (
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-neutral-800 border border-neutral-700",
                  headerTitle: "text-white font-['Merriweather',serif]",
                  headerSubtitle: "text-gray-300",
                  formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white",
                  formFieldInput: "bg-neutral-700 border-neutral-600 text-white",
                  formFieldLabel: "text-gray-300",
                  footerActionLink: "text-orange-500 hover:text-orange-400",
                  dividerLine: "bg-neutral-600",
                  dividerText: "text-gray-400"
                }
              }}
            />
          ) : (
            <div className="text-center p-8 bg-neutral-800 border border-neutral-700 rounded-lg">
              <p className="text-white">Loading authentication...</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}; 