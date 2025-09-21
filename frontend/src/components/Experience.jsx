import React, { useState, useEffect } from 'react';
import { Building2, Calendar, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { apiService } from '../services/api';

const Experience = () => {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await apiService.getExperience();
        setExperience(data);
      } catch (err) {
        setError('Failed to load experience data');
        console.error('Error loading experience:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading experience...</p>
        </div>
      </section>
    );
  }

  if (error || !experience.length) {
    return (
      <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">{error || 'Failed to load experience'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional Experience
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A journey of continuous growth and technical excellence across diverse domains
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200 hidden md:block"></div>
          
          <div className="space-y-12">
            {experience.map((exp, index) => (
              <div key={exp.id} className="relative">
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg hidden md:block"></div>
                
                <Card className="md:ml-20 p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 bg-white">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-grow">
                      {/* Company and Role */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <Building2 className="text-blue-600" size={24} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {exp.position}
                          </h3>
                          <p className="text-lg text-blue-600 font-semibold mb-2">
                            {exp.company}
                          </p>
                          
                          <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar size={16} />
                              <span className="text-sm">{exp.duration}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {exp.period}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 leading-relaxed mb-6">
                        {exp.description}
                      </p>

                      {/* Technologies */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Key Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.technologies.map((tech, techIndex) => (
                            <Badge 
                              key={techIndex}
                              variant="secondary" 
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Company Growth Indicator for Nucleus Software */}
                    {exp.company === "Nucleus Software Japan K.K." && (
                      <div className="lg:w-48 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 mb-1">16+</div>
                          <div className="text-sm text-green-700 font-medium">Years</div>
                          <div className="text-xs text-green-600 mt-2">Career Growth</div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Career Summary */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Career Highlights</h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              From Software Engineer to Senior Technical Lead - a journey of continuous learning and leadership growth
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{experience.length}</div>
              <div className="text-gray-600">Different Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">16+</div>
              <div className="text-gray-600">Years at Nucleus</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-gray-600">Role Promotions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">Banking</div>
              <div className="text-gray-600">Domain Expertise</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;