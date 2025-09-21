import React from 'react';
import { Code, Database, Cloud, Settings, BarChart3, Workflow } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { skills } from '../data/mock';

const Skills = () => {
  const skillCategories = {
    "Backend": { icon: <Code className="text-blue-600" size={24} />, color: "blue" },
    "Framework": { icon: <Settings className="text-green-600" size={24} />, color: "green" },
    "Database": { icon: <Database className="text-purple-600" size={24} />, color: "purple" },
    "Cloud": { icon: <Cloud className="text-cyan-600" size={24} />, color: "cyan" },
    "Process": { icon: <Workflow className="text-orange-600" size={24} />, color: "orange" },
    "Analysis": { icon: <BarChart3 className="text-red-600" size={24} />, color: "red" },
    "Data": { icon: <Database className="text-indigo-600" size={24} />, color: "indigo" },
    "Emerging Tech": { icon: <Settings className="text-pink-600" size={24} />, color: "pink" }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Technical Skills
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A comprehensive skill set built over 16+ years of hands-on experience in enterprise software development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <Card key={category} className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gray-50 rounded-lg mr-4">
                  {skillCategories[category]?.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{category}</h3>
              </div>
              
              <div className="space-y-4">
                {categorySkills.map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">{skill.name}</span>
                      <span className="text-sm text-gray-500">{skill.level}%</span>
                    </div>
                    <Progress 
                      value={skill.level} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Skill Summary */}
        <div className="mt-16 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Core Competencies</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">16+</div>
              <div className="text-gray-600">Years of Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4</div>
              <div className="text-gray-600">Cloud Certifications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">5+</div>
              <div className="text-gray-600">Technology Domains</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;