import React, { useState, useEffect } from 'react';
import { ExternalLink, Code, CheckCircle, Clock, TrendingUp, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { apiService } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await apiService.getProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects data');
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const statusIcons = {
    "Production": <CheckCircle className="text-green-600" size={20} />,
    "Completed": <CheckCircle className="text-blue-600" size={20} />,
    "In Progress": <Clock className="text-orange-600" size={20} />
  };

  const statusColors = {
    "Production": "bg-green-100 text-green-800 border-green-200",
    "Completed": "bg-blue-100 text-blue-800 border-blue-200",
    "In Progress": "bg-orange-100 text-orange-800 border-orange-200"
  };

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error || !projects.length) {
    return (
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600">{error || 'Failed to load projects'}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Key Projects
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Impactful projects that demonstrate technical expertise and business value delivery
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {projects.map((project) => (
            <Card 
              key={project.id} 
              className="p-8 hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100"
            >
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Code className="text-blue-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {statusIcons[project.status]}
                    <Badge className={`${statusColors[project.status]} text-xs font-medium`}>
                      {project.status}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Impact */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="text-green-600" size={18} />
                    <h4 className="text-sm font-semibold text-green-800">Business Impact</h4>
                  </div>
                  <p className="text-sm text-green-700 font-medium">
                    {project.impact}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Technologies Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge 
                        key={index}
                        variant="outline" 
                        className="bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                  >
                    View Details
                    <ExternalLink size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Project Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6">Project Portfolio Impact</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto mb-8">
              Each project represents a strategic solution to complex business challenges, 
              combining technical excellence with measurable business outcomes.
            </p>
            
            <div className="grid md:grid-cols-4 gap-8">
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">{projects.length}</div>
                <div className="text-blue-100">Major Projects</div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">75K+</div>
                <div className="text-blue-100">Schools Impacted</div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">Millions</div>
                <div className="text-blue-100">Transactions Daily</div>
              </div>
              <div className="bg-white/10 p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">60%</div>
                <div className="text-blue-100">Efficiency Gain</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;