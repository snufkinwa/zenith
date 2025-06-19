'use client';

import React from 'react';
import { ArrowRight, Play, Sparkles, Zap, Target } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen text-white overflow-hidden">
      
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/50" />
      

      
      {/* Floating Accent Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-[#33cc99]/20 to-[#124dff]/20 rounded-full filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-l from-[#124dff]/20 to-[#33cc99]/20 rounded-full filter blur-3xl animate-pulse animation-delay-2000" />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-full text-sm font-medium text-gray-300 mb-8">
            <div className="w-2 h-2 bg-[#33cc99] rounded-full animate-pulse" />
            <span>AI-Powered Coding Platform</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-tight">
            Master Coding with
            <br />
            <span className="bg-gradient-to-r from-[#33cc99] via-[#124dff] to-[#33cc99] bg-clip-text text-transparent animate-pulse">
              AI Guidance
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl lg:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Level up your programming skills with intelligent hints, real company interview questions, 
            and advanced analytics. Practice like the pros do.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <Link
              href="/beta"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#33cc99] to-[#124dff] text-black font-bold rounded-xl hover:from-[#2db88a] hover:to-[#0f3de6] transition-all duration-300 shadow-2xl hover:shadow-[#33cc99]/25 transform hover:-translate-y-1 text-lg"
            >
              Start Coding Free
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <button className="group inline-flex items-center gap-3 px-10 py-5 bg-gray-900/50 backdrop-blur-sm text-white font-semibold rounded-xl border border-gray-700 hover:border-[#33cc99] hover:bg-gray-800/50 transition-all duration-300 shadow-lg text-lg">
              <Play className="w-6 h-6 text-[#33cc99] group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-3xl mx-auto">
            <div className="text-center group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:text-[#33cc99] transition-colors">175+</div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">Problems</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:text-[#124dff] transition-colors">50+</div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">Companies</div>
            </div>
            <div className="text-center group">
              <div className="text-4xl font-bold text-white mb-2 group-hover:text-[#33cc99] transition-colors">AI</div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;