import React from "react";
import { NavigationMenuSection } from "./sections/NavigationMenuSection/NavigationMenuSection";
import { UserProfileSection } from "./sections/UserProfileSection/UserProfileSection";

export const HomeScreen = (): JSX.Element => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-sky-100">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <UserProfileSection />
        <NavigationMenuSection />
      </div>
    </div>
  );
};