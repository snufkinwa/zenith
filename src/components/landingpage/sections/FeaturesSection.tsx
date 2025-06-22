'use client';

import React, { useState, useEffect } from 'react';
import {
  Brain,
  Code,
  TrendingUp,
  Building2,
  Lightbulb,
  BookOpen,
  Timer,
  PenTool,
  ArrowRight,
  Play,
} from 'lucide-react';
import Link from 'next/link';

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      category: 'AI-Powered Learning',
      title: 'Get hints that actually help you learn',
      description:
        "Our AI doesn't just give you answers—it guides your thinking process, helping you discover solutions naturally while building lasting problem-solving skills.",
      benefits: [
        "Contextual hints that don't spoil the solution",
        'Learns your coding style and adapts suggestions',
        "Explains the 'why' behind algorithmic choices",
      ],
      mockup: 'ai-hints',
      accent: '#33cc99',
    },
    {
      category: 'Visual Problem Solving',
      title: 'Think visually, code better',
      description:
        'Built-in drawing tools and whiteboard functionality let you sketch out algorithms, visualize data structures, and plan your approach before writing a single line of code.',
      benefits: [
        'Integrated whiteboard with algorithm templates',
        'Save and sync your visual notes with solutions',
        'Share visual explanations with the community',
      ],
      mockup: 'visual-tools',
      accent: '#124dff',
    },
    {
      category: 'Smart Analytics',
      title: 'Track progress that matters',
      description:
        'Understand your coding patterns, identify improvement areas, and see which companies are asking questions that match your skillset—all with detailed, actionable insights.',
      benefits: [
        'Company-specific problem frequency tracking',
        'Personal coding pattern analysis',
        'Skill gap identification and recommendations',
      ],
      mockup: 'analytics-dashboard',
      accent: '#33cc99',
    },
  ];

  const ProductMockup = ({ type }: { type: string }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsLoaded(true), 300);
      return () => clearTimeout(timer);
    }, [type]);

    switch (type) {
      case 'ai-hints':
        return (
          <div
            className={`transform rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-1000 ${
              isLoaded
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-4 scale-95 opacity-0'
            }`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-sm text-gray-400">
                Zenith AI Assistant
              </span>
            </div>
            <div className="space-y-4">
              <div
                className={`rounded-lg bg-gray-700/50 p-4 transition-all delay-500 duration-700 ${
                  isLoaded
                    ? 'translate-x-0 transform opacity-100'
                    : '-translate-x-4 transform opacity-0'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Brain
                    className={`mt-1 h-5 w-5 text-[#33cc99] transition-all delay-700 duration-500 ${
                      isLoaded ? 'rotate-0 scale-100' : 'rotate-45 scale-0'
                    }`}
                  />
                  <div>
                    <p
                      className={`delay-800 mb-2 text-sm text-white transition-all duration-500 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      💡 Think about the relationship between the indices...
                    </p>
                    <p
                      className={`text-xs text-gray-400 transition-all delay-1000 duration-500 ${
                        isLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      This problem involves tracking positions. What data
                      structure excels at quick lookups?
                    </p>
                  </div>
                </div>
              </div>
              <div
                className={`rounded-lg bg-gray-900/50 p-3 transition-all delay-700 duration-700 ${
                  isLoaded
                    ? 'translate-x-0 transform opacity-100'
                    : '-translate-x-4 transform opacity-0'
                }`}
              >
                <code className="text-sm text-green-400">
                  <span
                    className={`delay-1200 transition-all duration-300 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {`def two_sum(nums, target):`}
                  </span>
                  <br />
                  <span
                    className={`delay-1400 text-gray-500 transition-all duration-300 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {`    # Your solution here`}
                  </span>
                </code>
              </div>
            </div>
          </div>
        );

      case 'visual-tools':
        return (
          <div
            className={`transform rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-1000 ${
              isLoaded
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-4 scale-95 opacity-0'
            }`}
          >
            <div
              className={`mb-4 flex items-center justify-between transition-all delay-300 duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="font-medium text-white">
                Algorithm Visualizer
              </span>
              <div className="flex gap-2">
                <PenTool
                  className={`h-4 w-4 text-[#124dff] transition-all delay-500 duration-500 ${
                    isLoaded ? 'rotate-0 scale-100' : 'rotate-45 scale-0'
                  }`}
                />
                <span className="text-xs text-gray-400">Drawing mode</span>
              </div>
            </div>
            <div
              className={`delay-400 relative h-40 overflow-hidden rounded-lg bg-white/5 transition-all duration-700 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* Simulated drawing canvas with animations */}
              <svg className="absolute inset-0 h-full w-full">
                <path
                  d="M20,60 Q60,20 100,60 T180,60"
                  stroke="#124dff"
                  strokeWidth="2"
                  fill="none"
                  className={`delay-800 transition-all duration-1000`}
                  style={{
                    strokeDasharray: '200',
                    strokeDashoffset: isLoaded ? '0' : '200',
                  }}
                />
                <circle
                  cx="20"
                  cy="60"
                  r="8"
                  fill="#33cc99"
                  className={`transition-all delay-1000 duration-500 ${
                    isLoaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
                <circle
                  cx="100"
                  cy="60"
                  r="8"
                  fill="#33cc99"
                  className={`delay-1200 transition-all duration-500 ${
                    isLoaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
                <circle
                  cx="180"
                  cy="60"
                  r="8"
                  fill="#33cc99"
                  className={`delay-1400 transition-all duration-500 ${
                    isLoaded ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                />
                <text
                  x="25"
                  y="85"
                  className={`delay-1600 fill-white text-xs transition-all duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  1
                </text>
                <text
                  x="105"
                  y="85"
                  className={`delay-1800 fill-white text-xs transition-all duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  2
                </text>
                <text
                  x="185"
                  y="85"
                  className={`delay-2000 fill-white text-xs transition-all duration-300 ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  3
                </text>
              </svg>
              <div
                className={`delay-1200 absolute bottom-2 left-2 text-xs text-gray-400 transition-all duration-500 ${
                  isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Binary Tree Traversal
              </div>
            </div>
          </div>
        );

      case 'analytics-dashboard':
        return (
          <div
            className={`transform rounded-2xl border border-gray-700 bg-gray-800/50 p-6 transition-all duration-1000 ${
              isLoaded
                ? 'translate-y-0 scale-100 opacity-100'
                : 'translate-y-4 scale-95 opacity-0'
            }`}
          >
            <div
              className={`mb-4 flex items-center justify-between transition-all delay-300 duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="font-medium text-white">Progress Analytics</span>
              <TrendingUp
                className={`h-4 w-4 text-[#33cc99] transition-all delay-500 duration-500 ${
                  isLoaded ? 'rotate-0 scale-100' : 'rotate-45 scale-0'
                }`}
              />
            </div>
            <div className="space-y-4">
              <div
                className={`delay-600 flex items-center justify-between transition-all duration-500 ${
                  isLoaded
                    ? 'translate-x-0 transform opacity-100'
                    : '-translate-x-4 transform opacity-0'
                }`}
              >
                <span className="text-sm text-gray-400">Google Questions</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="delay-800 h-2 rounded-full bg-[#33cc99] transition-all duration-1000"
                      style={{ width: isLoaded ? '75%' : '0%' }}
                    ></div>
                  </div>
                  <span
                    className={`delay-1300 text-sm text-white transition-all duration-300 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    75%
                  </span>
                </div>
              </div>
              <div
                className={`flex items-center justify-between transition-all delay-700 duration-500 ${
                  isLoaded
                    ? 'translate-x-0 transform opacity-100'
                    : '-translate-x-4 transform opacity-0'
                }`}
              >
                <span className="text-sm text-gray-400">Meta Questions</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-[#124dff] transition-all delay-1000 duration-1000"
                      style={{ width: isLoaded ? '50%' : '0%' }}
                    ></div>
                  </div>
                  <span
                    className={`delay-1500 text-sm text-white transition-all duration-300 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    50%
                  </span>
                </div>
              </div>
              <div
                className={`delay-800 flex items-center justify-between transition-all duration-500 ${
                  isLoaded
                    ? 'translate-x-0 transform opacity-100'
                    : '-translate-x-4 transform opacity-0'
                }`}
              >
                <span className="text-sm text-gray-400">Apple Questions</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-16 overflow-hidden rounded-full bg-gray-700">
                    <div
                      className="delay-1200 h-2 rounded-full bg-[#33cc99] transition-all duration-1000"
                      style={{ width: isLoaded ? '25%' : '0%' }}
                    ></div>
                  </div>
                  <span
                    className={`delay-1700 text-sm text-white transition-all duration-300 ${
                      isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    25%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-64 rounded-2xl border border-gray-700 bg-gray-800/50"></div>
        );
    }
  };

  return (
    <section
      className="relative overflow-hidden py-32 text-white"
      style={{
        background: `
          radial-gradient(circle at 50% 25%, 
            rgba(51, 204, 153, 0.3) 0%, 
            rgba(18, 77, 255, 0.2) 30%, 
            rgba(30, 27, 75, 0.4) 60%, 
            rgba(0, 0, 0, 1) 100%
          )
        `,
      }}
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header with entrance animation */}
        <div
          className={`mb-20 max-w-4xl transition-all duration-1000 ${
            isVisible
              ? 'translate-y-0 transform opacity-100'
              : 'translate-y-8 transform opacity-0'
          }`}
        >
          <div className="mb-6 inline-block rounded-full border border-gray-700 bg-gray-800/50 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm font-medium text-[#33cc99]">FEATURES</span>
          </div>
          <h2 className="mb-8 text-5xl font-bold leading-tight lg:text-6xl">
            The building blocks of a
            <br />
            <span className="text-[#33cc99]">powerful platform</span>
          </h2>
          <p className="text-xl leading-relaxed text-gray-400">
            Experience the next generation of coding education with intelligent
            features that adapt to your learning style.
          </p>
        </div>

        {/* Main Feature Showcase with animation */}
        <div
          className={`mb-20 grid items-center gap-12 transition-all delay-300 duration-1000 lg:grid-cols-2 ${
            isVisible
              ? 'translate-y-0 transform opacity-100'
              : 'translate-y-8 transform opacity-0'
          }`}
        >
          <div className="space-y-8">
            <div>
              <div className="mb-4 inline-block rounded-full border border-[#33cc99]/20 bg-[#33cc99]/10 px-3 py-1">
                <span className="text-sm font-medium text-[#33cc99]">
                  {features[activeFeature].category}
                </span>
              </div>
              <h3 className="mb-6 text-4xl font-bold leading-tight">
                {features[activeFeature].title}
              </h3>
              <p className="mb-8 text-lg leading-relaxed text-gray-400">
                {features[activeFeature].description}
              </p>

              <div className="mb-8 space-y-3">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 transition-all duration-500 ${
                      isVisible
                        ? 'translate-x-0 transform opacity-100'
                        : '-translate-x-4 transform opacity-0'
                    }`}
                    style={{ transitionDelay: `${600 + index * 100}ms` }}
                  >
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#33cc99]/20">
                      <div className="h-2 w-2 rounded-full bg-[#33cc99]"></div>
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <div
                className={`mb-10 flex flex-col items-center justify-start gap-6 transition-all delay-1000 duration-700 sm:flex-row ${
                  isVisible
                    ? 'translate-y-0 transform opacity-100'
                    : 'translate-y-4 transform opacity-0'
                }`}
              >
                <Link
                  href="/beta"
                  className="text-md group inline-flex transform items-center gap-3 rounded-xl bg-gradient-to-r from-[#33cc99] to-[#124dff] px-6 py-3 font-bold text-black shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:from-[#2db88a] hover:to-[#0f3de6] hover:shadow-[#33cc99]/25"
                >
                  Try it free
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="relative">
            <ProductMockup type={features[activeFeature].mockup} />

            {/* Floating elements with animation */}
            <div
              className={`absolute -right-4 -top-4 h-24 w-24 rounded-2xl border border-white/10 bg-gradient-to-br from-[#33cc99]/20 to-[#124dff]/20 backdrop-blur-sm transition-all delay-500 duration-1000 ${
                isVisible
                  ? 'translate-y-0 scale-100 opacity-100'
                  : 'translate-y-4 scale-0 opacity-0'
              }`}
            ></div>
            <div
              className={`absolute -bottom-4 -left-4 h-16 w-16 rounded-xl border border-white/10 bg-gradient-to-br from-[#124dff]/20 to-[#33cc99]/20 backdrop-blur-sm transition-all delay-700 duration-1000 ${
                isVisible
                  ? 'translate-y-0 scale-100 opacity-100'
                  : 'translate-y-4 scale-0 opacity-0'
              }`}
            ></div>
          </div>
        </div>

        {/* Feature Navigation with animation */}
        <div
          className={`mb-20 flex justify-center transition-all delay-500 duration-1000 ${
            isVisible
              ? 'translate-y-0 transform opacity-100'
              : 'translate-y-8 transform opacity-0'
          }`}
        >
          <div className="flex gap-4">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`transform rounded-xl px-6 py-3 font-medium transition-all duration-300 hover:scale-105 ${
                  activeFeature === index
                    ? 'border border-white/20 bg-white/10 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {feature.category}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Features Grid with staggered animation */}
        <div
          className={`grid gap-6 transition-all delay-700 duration-1000 md:grid-cols-2 lg:grid-cols-4 ${
            isVisible
              ? 'translate-y-0 transform opacity-100'
              : 'translate-y-8 transform opacity-0'
          }`}
        >
          {[
            {
              icon: Timer,
              title: 'Pomodoro Integration',
              description:
                'Built-in focus timer to maintain peak concentration during coding sessions.',
            },
            {
              icon: BookOpen,
              title: 'Smart Notes',
              description:
                'Contextual note-taking that syncs with your problem-solving progress.',
            },
            {
              icon: Building2,
              title: 'Company Insights',
              description:
                'Track which companies ask specific questions most frequently.',
            },
            {
              icon: Code,
              title: 'Python Execution',
              description:
                'Built-in Python interpreter with instant code execution and testing.',
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`group transform rounded-2xl border border-gray-800 bg-gray-900/30 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:border-gray-600 ${
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#33cc99]/20 to-[#124dff]/20 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6 text-[#33cc99]" />
                </div>
                <h4 className="mb-2 font-semibold text-white">{item.title}</h4>
                <p className="text-sm leading-relaxed text-gray-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call to Action with animation */}
        <div
          className={`mt-20 text-center transition-all delay-1000 duration-1000 ${
            isVisible
              ? 'translate-y-0 transform opacity-100'
              : 'translate-y-8 transform opacity-0'
          }`}
        >
          <div className="inline-flex transform cursor-pointer items-center gap-3 rounded-full border border-gray-800 bg-gray-900/50 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-[#33cc99]">
            <Play className="h-4 w-4 text-[#33cc99]" />
            <span className="text-gray-300">Watch how it works</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
