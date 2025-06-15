
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900/50 border-t border-gray-800/50 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <span>© 2025 DevForum. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>by</span>
            <a 
              href="mailto:pranaydodiya2005@gmail.com"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Pranay Dodiya
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
