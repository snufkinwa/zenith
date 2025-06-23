'use client';

import React from 'react';
import { ArrowRight, Play, Sparkles, Zap, Target } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CodeEditorSVG from './CodeEditorSVG';

// AnimationContainer Component
const AnimationContainer = ({
  children,
  className,
  reverse,
  delay,
}: {
  children: React.ReactNode;
  delay?: number;
  reverse?: boolean;
  className?: string;
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reverse ? -20 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{
        duration: 0.2,
        delay: delay,
        ease: 'easeInOut',
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden text-white">
      {/* Gradient Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/50" />

      {/* Floating Accent Elements */}
      <div className="absolute left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-gradient-to-r from-[#33cc99]/20 to-[#124dff]/20 blur-3xl filter" />
      <div
        className="absolute bottom-80 right-10 h-96 w-96 animate-pulse rounded-full bg-gradient-to-l from-[#124dff]/20 to-[#33cc99]/20 blur-3xl filter"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center py-20">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          {/* Badge */}
          <AnimationContainer delay={0.1}>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900/80 px-6 py-3 text-sm font-medium text-gray-300 backdrop-blur-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-[#33cc99]" />
              <span>AI-Powered Coding Platform</span>
            </div>
          </AnimationContainer>

          {/* Main Heading */}
          <AnimationContainer delay={0.2}>
            <h1 className="mb-8 text-6xl font-bold leading-tight lg:text-8xl">
              Master Coding with
              <br />
              <span className="animate-pulse bg-gradient-to-r from-[#33cc99] via-[#124dff] to-[#33cc99] bg-clip-text text-transparent">
                AI Guidance
              </span>
            </h1>
          </AnimationContainer>

          {/* Subheading */}
          <AnimationContainer delay={0.3}>
            <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-gray-400 lg:text-2xl">
              Level up your programming skills with intelligent hints, real
              company interview questions, and advanced analytics. Practice like
              the pros do.
            </p>
          </AnimationContainer>

          {/* CTA Buttons */}
          <AnimationContainer delay={0.4}>
            <div className="mb-20 flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Link
                href="/login"
                className="group inline-flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-[#33cc99] to-[#124dff] px-10 py-5 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:from-[#2db88a] hover:to-[#0f3de6] hover:shadow-[#33cc99]/25"
              >
                Start Coding Free
                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>

              <button className="group inline-flex items-center gap-3 rounded-xl border border-gray-700 bg-gray-900/50 px-10 py-5 text-lg font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-[#33cc99] hover:bg-gray-800/50">
                <Play className="h-6 w-6 text-[#33cc99] transition-transform group-hover:scale-110" />
                Watch Demo
              </button>
            </div>
          </AnimationContainer>

          {/* Code Environment Preview */}
          <AnimationContainer
            delay={0.5}
            className="relative mx-auto mb-20 max-w-7xl"
          >
            <div className="gradient absolute inset-0 left-1/2 h-1/2 w-3/4 -translate-x-1/2 animate-pulse bg-gradient-to-r from-[#33cc99]/30 to-[#124dff]/30 blur-[5rem]"></div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-700/50 bg-gray-900/90 shadow-2xl backdrop-blur-xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#33cc99]/20 to-[#124dff]/20 opacity-75 blur"></div>

              <div className="relative">
                <CodeEditorSVG />
              </div>
            </div>
            {/* Darker Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-60 bg-gradient-to-t from-black via-black/80 to-transparent" />
          </AnimationContainer>

          {/* Stats */}
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-12 sm:grid-cols-3">
            {[
              { value: '175+', label: 'Problems', delay: 0.6 },
              { value: '50+', label: 'Companies', delay: 0.7 },
              { value: 'AI', label: 'Powered', delay: 0.8 },
            ].map((stat, index) => (
              <AnimationContainer key={index} delay={stat.delay}>
                <div className="group text-center">
                  <div className="mb-2 text-4xl font-bold text-white transition-colors group-hover:text-[#33cc99]">
                    {stat.value}
                  </div>
                  <div className="text-sm uppercase tracking-wider text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </AnimationContainer>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
