import React, { useState, useEffect } from 'react';
import { User, Award, Calendar, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { apiService } from '../services/api';

const About = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfileData(data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const highlights = [
    {
      icon: <Calendar className="text-blue-600" size={24} />,
      title: "16+ Years Experience",
      description: "Extensive experience in IT and software development"
    },
    {
      icon: <TrendingUp className="text-green-600" size={24} />,
      title: "Career Growth",
      description: "Progressed from Software Engineer to Senior Technical Lead"
    },
    {
      icon: <Award className="text-purple-600" size={24} />,
      title: "Cloud Certified",
      description: "Multiple certifications in Azure, AWS, and emerging technologies"
    },
    {
      icon: <User className="text-orange-600" size={24} />,
      title: "Technical Leadership",
      description: "Leading teams and architectural decisions in banking domain"
    }
  ];

  if (loading) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading about information...</p>
        </div>
      </section>
    );
  }

  if (error || !profileData) {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">{error || 'Failed to load about information'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About Me
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Passionate about leveraging emerging technologies to solve complex business challenges
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Profile Content */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Summary</h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {profileData.summary}
              </p>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-xl">
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Current Role</h4>
              <p className="text-gray-700">
                <span className="font-semibold text-blue-600">{profileData.title}</span> at {profileData.company}, 
                where I lead technical initiatives for banking solutions in Japan, focusing on system architecture, 
                team leadership, and innovative technology adoption.
              </p>
            </div>

            {/* Consulting Availability */}
            {profileData.consulting?.available && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h4 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                  Available for Consulting
                </h4>
                <p className="text-gray-700 mb-3">
                  {profileData.consulting.visaStatus}
                </p>
                <div className="text-sm text-gray-600">
                  <strong>Target Markets:</strong> {profileData.consulting.targetMarkets?.join(', ')}
                </div>
              </div>
            )}
          </div>

          {/* Highlights Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {highlights.map((item, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gray-50 rounded-lg">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Why I Love Technology</h3>
            <p className="text-lg leading-relaxed max-w-4xl mx-auto">
              Technology has the power to transform businesses and improve lives. With over 16 years of experience, 
              I've witnessed the evolution from traditional systems to cloud-native architectures. My passion lies in 
              bridging the gap between emerging technologies and practical business solutions, particularly in the 
              financial services domain.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;