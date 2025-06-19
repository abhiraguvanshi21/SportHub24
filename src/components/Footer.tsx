import { Play, Mail, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-red-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-red-500 to-red-700 p-2 rounded-lg">
                <Play className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">SportHub24</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your ultimate destination for live cricket scoring, match updates, and comprehensive cricket news. 
              Experience the thrill of cricket with real-time updates and professional commentary.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="h-4 w-4" />
                <span>info@sporthub24.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-red-400 transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-red-400 transition-colors">About Us</a></li>
              <li><a href="/news" className="text-gray-300 hover:text-red-400 transition-colors">Cricket News</a></li>
              <li><a href="/live-scoring" className="text-gray-300 hover:text-red-400 transition-colors">Live Scoring</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-red-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Live Cricket Scoring</li>
              <li>Video Commentary</li>
              <li>Match Analytics</li>
              <li>News Updates</li>
              <li>Custom Scoring</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SportHub24. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;