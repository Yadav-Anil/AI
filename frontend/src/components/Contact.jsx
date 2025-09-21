import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, ExternalLink, Send, MapPin, User, MessageSquare, Loader2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { apiService } from '../services/api';

const Contact = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfileData(data);
      } catch (err) {
        console.error('Error loading profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await apiService.submitContactForm(formData);
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error('Error submitting contact form:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading contact information...</p>
        </div>
      </section>
    );
  }

  // Use fallback data if profile fails to load
  const contactData = profileData || {
    name: "Anil Yadav",
    title: "Senior Technical Lead",
    company: "Nucleus Software Japan K.K.",
    location: "Tokyo, Japan",
    contact: {
      email: "anilyadav83@gmail.com",
      linkedin: "www.linkedin.com/in/anil-yadav-a1223211",
      blogs: [
        { name: "SQL Server Team Blog", url: "sqlserverteam.blogspot.com/" },
        { name: "Personal Tech Blog", url: "anil83.blogspot.com/" }
      ]
    }
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Let's discuss opportunities, collaborations, or just connect over technology trends
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Profile Card */}
            <Card className="p-8 bg-white border border-gray-200">
              <div className="text-center mb-6">
                {contactData.profileImage ? (
                  <img
                    src={contactData.profileImage}
                    alt={contactData.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 shadow-lg border-2 border-blue-100"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={40} className="text-white" />
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{contactData.name}</h3>
                <p className="text-lg text-blue-600 font-semibold">{contactData.title}</p>
                <p className="text-gray-600">{contactData.company}</p>
                
                <div className="flex items-center justify-center gap-2 mt-3 text-gray-600">
                  <MapPin size={16} />
                  <span>{contactData.location}</span>
                </div>
                
                {contactData.consulting?.available && (
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      🟢 Available for Consulting
                    </span>
                  </div>
                )}
              </div>
            </Card>

            {/* Contact Methods */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Connect With Me</h3>
              
              {/* Email */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Mail className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900">Email</h4>
                    <a 
                      href={`mailto:${contactData.contact.email}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {contactData.contact.email}
                    </a>
                  </div>
                  <ExternalLink size={20} className="text-gray-400" />
                </div>
              </Card>

              {/* LinkedIn */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <Linkedin className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-lg font-semibold text-gray-900">LinkedIn</h4>
                    <a 
                      href={`https://${contactData.contact.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Professional Profile
                    </a>
                  </div>
                  <ExternalLink size={20} className="text-gray-400" />
                </div>
              </Card>

              {/* Blogs */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-gray-900">Technical Blogs</h4>
                {contactData.contact.blogs?.map((blog, index) => (
                  <Card key={index} className="p-4 hover:shadow-md transition-all duration-300 border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-50 rounded-lg">
                        <ExternalLink className="text-purple-600" size={20} />
                      </div>
                      <div className="flex-grow">
                        <a 
                          href={`https://${blog.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 transition-colors font-medium"
                        >
                          {blog.name}
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="p-8 bg-white border border-gray-200">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <MessageSquare className="text-green-600" size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Send a Message</h3>
              </div>
              <p className="text-gray-600">
                I'd love to hear from you. Send me a message and I'll respond as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="w-full"
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your project, question, or just say hello..."
                  rows={6}
                  className="w-full"
                  disabled={submitting}
                />
              </div>

              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={20} />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={20} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-10 rounded-2xl shadow-xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Collaborate?</h3>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto mb-8">
              Whether you're looking for technical leadership, system architecture consultation, 
              or innovative solutions for your next project, I'm here to help turn your ideas into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open(`mailto:${contactData.contact.email}`, '_blank')}
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
              >
                <Mail className="mr-2" size={20} />
                Email Me Directly
              </Button>
              <Button 
                onClick={() => window.open(`https://${contactData.contact.linkedin}`, '_blank')}
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 font-semibold px-8 py-3"
              >
                <Linkedin className="mr-2" size={20} />
                Connect on LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;