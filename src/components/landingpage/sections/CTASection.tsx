'use client';

import React from 'react';
import { ArrowRight, Code, Zap } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative py-32 text-white overflow-hidden">
  
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-32 h-32 bg-[#33cc99]/20 rounded-full filter blur-2xl animate-pulse" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-[#124dff]/20 rounded-full filter blur-2xl animate-pulse animation-delay-2000" />
      
      <div className="relative max-w-6xl mx-auto px-6 lg:px-8 text-center">
        {/* Main Content */}
        <div className="mb-16">
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Ready to Level Up Your
            <br />
            <span className="bg-gradient-to-r from-[#33cc99] to-[#124dff] bg-clip-text text-transparent">
              Coding Skills?
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who are already using Zenith to prepare for interviews and improve their programming skills.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <a
            href="/beta"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-[#33cc99] to-[#124dff] text-black font-bold rounded-xl hover:from-[#2db88a] hover:to-[#0f3de6] transition-all duration-300 shadow-2xl hover:shadow-[#33cc99]/30 transform hover:-translate-y-1 text-lg"
          >
            <Code className="w-6 h-6" />
            Start Coding Now - Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <a
            href="/problems"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-transparent border-2 border-gray-700 text-white font-bold rounded-xl hover:border-[#33cc99] hover:bg-[#33cc99]/10 transition-all duration-300 text-lg"
          >
            <Zap className="w-6 h-6 text-[#124dff]" />
            Browse Problems
          </a>
        </div>
        
        {/* Features List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <div className="w-2 h-2 bg-[#33cc99] rounded-full animate-pulse" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <div className="w-2 h-2 bg-[#124dff] rounded-full animate-pulse animation-delay-1000" />
            <span>Start solving immediately</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <div className="w-2 h-2 bg-[#33cc99] rounded-full animate-pulse animation-delay-2000" />
            <span>AI-guided learning</span>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default CTASection;