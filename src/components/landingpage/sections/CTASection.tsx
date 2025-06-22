'use client';

import React from 'react';
import { ArrowRight, Code, Zap } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="relative overflow-hidden py-32 text-white">
      {/* Floating Elements */}
      <div className="absolute left-10 top-1/4 h-32 w-32 animate-pulse rounded-full bg-[#33cc99]/20 blur-2xl filter" />
      <div className="animation-delay-2000 absolute bottom-1/4 right-10 h-32 w-32 animate-pulse rounded-full bg-[#124dff]/20 blur-2xl filter" />

      <div className="relative mx-auto max-w-6xl px-6 text-center lg:px-8">
        {/* Main Content */}
        <div className="mb-16">
          <h2 className="mb-8 text-5xl font-bold leading-tight lg:text-6xl">
            Ready to Level Up Your
            <br />
            <span className="bg-gradient-to-r from-[#33cc99] to-[#124dff] bg-clip-text text-transparent">
              Coding Skills?
            </span>
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-400">
            Join thousands of developers who are already using Zenith to prepare
            for interviews and improve their programming skills.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <a
            href="/beta"
            className="group inline-flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-[#33cc99] to-[#124dff] px-12 py-6 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:from-[#2db88a] hover:to-[#0f3de6] hover:shadow-[#33cc99]/30"
          >
            <Code className="h-6 w-6" />
            Start Coding Now - Free
            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
          </a>

          <a
            href="/problems"
            className="group inline-flex items-center gap-3 rounded-xl border-2 border-gray-700 bg-transparent px-12 py-6 text-lg font-bold text-white transition-all duration-300 hover:border-[#33cc99] hover:bg-[#33cc99]/10"
          >
            <Zap className="h-6 w-6 text-[#124dff]" />
            Browse Problems
          </a>
        </div>

        {/* Features List */}
        <div className="mx-auto mb-12 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#33cc99]" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <div className="animation-delay-1000 h-2 w-2 animate-pulse rounded-full bg-[#124dff]" />
            <span>Start solving immediately</span>
          </div>
          <div className="flex items-center justify-center gap-3 text-gray-300">
            <div className="animation-delay-2000 h-2 w-2 animate-pulse rounded-full bg-[#33cc99]" />
            <span>AI-guided learning</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
