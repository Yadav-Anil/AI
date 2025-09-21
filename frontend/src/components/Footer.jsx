import React from 'react';
import { Heart, Code, Coffee } from 'lucide-react';
import { profileData } from '../data/mock';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{profileData.name}</h3>
            <p className="text-gray-300 leading-relaxed">
              {profileData.title} passionate about leveraging technology to solve complex business challenges.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'About', href: '#about' },
                { name: 'Skills', href: '#skills' },
                { name: 'Experience', href: '#experience' },
                { name: 'Projects', href: '#projects' },
                { name: 'Contact', href: '#contact' }
              ].map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="space-y-3">
              <div>
                <a
                  href={`mailto:${profileData.contact.email}`}
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  {profileData.contact.email}
                </a>
              </div>
              <div>
                <a
                  href={`https://${profileData.contact.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200"
                >
                  LinkedIn Profile
                </a>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Technical Blogs:</p>
                {profileData.contact.blogs.map((blog, index) => (
                  <div key={index}>
                    <a
                      href={`https://${blog.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-purple-400 transition-colors duration-200 text-sm"
                    >
                      {blog.name}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-300 mb-4 md:mb-0">
              <span>© {currentYear} {profileData.name}. Made with</span>
              <Heart size={16} className="text-red-500" />
              <span>and</span>
              <Code size={16} className="text-blue-400" />
              <span>over</span>
              <Coffee size={16} className="text-yellow-600" />
            </div>
            
            <div className="text-gray-400 text-sm">
              <p>Senior Technical Lead • Tokyo, Japan</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;