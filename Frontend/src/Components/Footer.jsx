import React from 'react';

const Footer = () => {
  return (
    <footer 
      className="relative bg-black text-white py-6"
      style={{
        backgroundImage: "url('https://i.pinimg.com/736x/49/87/13/4987134beee9088a465127963979b115.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay for Text Visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-70"></div>

      <div className="relative container mx-auto text-center px-4">
        <p className="text-lg md:text-4xl mb-2">
          Advancing the way the world achieves goals.
        </p>
        <p className="text-sm">Bhopal, Madhya Pradesh, India</p>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 my-4">
          <a href="https://www.twitter.com/GoalBuddy" aria-label="Twitter">
            <img src="https://i.pinimg.com/736x/7c/4c/38/7c4c3865f0896f50fc4c39799384ae2d.jpg" 
                 alt="Twitter" className="w-8 h-8 hover:opacity-80 rounded-full" />
          </a>
          <a href="https://www.linkedin.com/company/GoalBuddy" aria-label="LinkedIn">
            <img src="https://i.pinimg.com/736x/9d/69/ac/9d69aca53672c450d71f918557240ce5.jpg" 
                 alt="LinkedIn" className="w-8 h-8 hover:opacity-80 rounded-full" />
          </a>
          <a href="https://www.facebook.com/GoalBuddy" aria-label="Facebook">
            <img src="https://i.pinimg.com/736x/45/06/21/450621a2603f62f0b4352fbcc9e845d8.jpg" 
                 alt="Facebook" className="w-8 h-8 hover:opacity-80 rounded-full" />
          </a>
        </div>

        {/* Legal Links */}
        <div className="text-sm space-x-4">
          <a href="/privacy-policy" className="hover:underline">Privacy Policy    | </a>
          <a href="/terms-of-use" className="hover:underline">Terms of Use    | </a>
          <a href="/contact-us" className="hover:underline">Contact Us</a>
        </div>

        {/* Copyright */}
        <p className="text-sm mt-4">&copy; 2025 GoalBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
