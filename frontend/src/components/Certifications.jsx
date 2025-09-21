import React from 'react';
import { Award, Calendar, Shield, Trophy } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { certifications } from '../data/mock';

const Certifications = () => {
  const certificationIcons = {
    "Cloud Architecture": <Shield className="text-blue-600" size={28} />,
    "Cloud Development": <Trophy className="text-green-600" size={28} />,
    "Blockchain Technology": <Award className="text-purple-600" size={28} />
  };

  const certificationColors = {
    "Cloud Architecture": "bg-blue-100 text-blue-800 border-blue-200",
    "Cloud Development": "bg-green-100 text-green-800 border-green-200",
    "Blockchain Technology": "bg-purple-100 text-purple-800 border-purple-200"
  };

  return (
    <section id="certifications" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Certifications
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Committed to continuous learning and staying current with emerging technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {certifications.map((cert) => (
            <Card 
              key={cert.id} 
              className="p-8 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 bg-gradient-to-br from-white to-gray-50"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 p-4 bg-gray-50 rounded-xl">
                  {certificationIcons[cert.type]}
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {cert.name}
                    </h3>
                    <div className="flex items-center text-gray-500 ml-4">
                      <Calendar size={16} className="mr-1" />
                      <span className="text-sm font-medium">{cert.year}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-3">
                    Issued by: <span className="text-blue-600 font-semibold">{cert.issuer}</span>
                  </p>
                  
                  <Badge 
                    className={`${certificationColors[cert.type]} font-medium px-3 py-1`}
                  >
                    {cert.type}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Certification Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/20 rounded-full">
                <Trophy size={48} className="text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4">Cloud & Technology Excellence</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
              These certifications represent my commitment to mastering cloud technologies and emerging tech trends. 
              Each certification was earned through rigorous study and hands-on experience, ensuring I can deliver 
              cutting-edge solutions to complex business challenges.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold mb-2">Multi-Cloud</div>
                <div className="text-blue-100">Azure & AWS Certified</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Future-Ready</div>
                <div className="text-blue-100">Blockchain Technology</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">Continuous</div>
                <div className="text-blue-100">Learning & Growth</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;