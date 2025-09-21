import React from 'react';
import { ChevronDown, MapPin, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { profileData } from '../data/mock';

const Hero = () => {
  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 pt-20">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-blue-600 mb-4">
            <MapPin size={20} />
            <span className="text-lg font-medium">{profileData.location}</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 leading-tight">
            {profileData.name}
          </h1>
          
          <div className="flex items-center justify-center gap-2 mb-6">
            <Building2 className="text-blue-600" size={24} />
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              {profileData.title}
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-gray-600 mb-2">
            at {profileData.company}
          </p>
          
          <p className="text-xl md:text-2xl text-blue-700 font-semibold max-w-4xl mx-auto leading-relaxed">
            {profileData.tagline}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-delay">
          <Button
            onClick={scrollToAbout}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Explore My Journey
          </Button>
          <Button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            variant="outline"
            size="lg"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200"
          >
            Get In Touch
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown 
            className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors" 
            size={32}
            onClick={scrollToAbout}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;