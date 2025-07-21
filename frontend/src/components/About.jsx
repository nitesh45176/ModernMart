import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-emerald-400 mb-6 text-center">
          About ModernMart
        </h1>
        <p className="text-lg text-gray-300 mb-8 text-center">
          Your one-stop destination for modern, eco-friendly fashion.
        </p>

        <div className="space-y-6 text-gray-400">
          <p>
            At <span className="text-emerald-400 font-semibold">ModernMart</span>, we believe that style and sustainability can coexist. Our mission is to offer premium fashion products that are not only stylish but also ethically sourced and environmentally conscious.
          </p>

          <p>
            We curate collections across categories such as <span className="text-gray-200">T-shirts, Jeans, Shoes, Glasses, Jackets, Suits, and Bags</span>, ensuring each item meets our standards of quality and responsibility. Whether you're shopping for essentials or looking to elevate your wardrobe, we’ve got you covered.
          </p>

          <p>
            Built with love using the MERN stack, ModernMart delivers a seamless shopping experience powered by modern technology, user-centric design, and robust security.
          </p>

          <p>
            Our team is constantly working on improving your shopping journey. If you have any feedback or questions, feel free to <Link to="/contact" className="text-emerald-400 hover:underline">contact us</Link>.
          </p>
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-md transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
