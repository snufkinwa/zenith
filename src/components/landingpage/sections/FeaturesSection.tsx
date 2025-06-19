'use client';

import React, { useState } from 'react';
import { Brain, Code, TrendingUp, Building2, Lightbulb, BookOpen, Timer, PenTool, ArrowRight, Play } from 'lucide-react';

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      category: "AI-Powered Learning",
      title: "Get hints that actually help you learn",
      description: "Our AI doesn't just give you answers—it guides your thinking process, helping you discover solutions naturally while building lasting problem-solving skills.",
      benefits: [
        "Contextual hints that don't spoil the solution",
        "Learns your coding style and adapts suggestions",
        "Explains the 'why' behind algorithmic choices"
      ],
      mockup: "ai-hints", // placeholder for your graphics
      accent: "#33cc99"
    },
    {
      category: "Visual Problem Solving",
      title: "Think visually, code better",
      description: "Built-in drawing tools and whiteboard functionality let you sketch out algorithms, visualize data structures, and plan your approach before writing a single line of code.",
      benefits: [
        "Integrated whiteboard with algorithm templates",
        "Save and sync your visual notes with solutions",
        "Share visual explanations with the community"
      ],
      mockup: "visual-tools",
      accent: "#124dff"
    },
    {
      category: "Smart Analytics",
      title: "Track progress that matters",
      description: "Understand your coding patterns, identify improvement areas, and see which companies are asking questions that match your skillset—all with detailed, actionable insights.",
      benefits: [
        "Company-specific problem frequency tracking",
        "Personal coding pattern analysis",
        "Skill gap identification and recommendations"
      ],
      mockup: "analytics-dashboard",
      accent: "#33cc99"
    }
  ];

  const ProductMockup = ({ type }: { type: string }) => {
    switch (type) {
      case 'ai-hints':
        return (
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-400 ml-2">Zenith AI Assistant</span>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-[#33cc99] mt-1" />
                  <div>
                    <p className="text-white text-sm mb-2">💡 Think about the relationship between the indices...</p>
                    <p className="text-gray-400 text-xs">This problem involves tracking positions. What data structure excels at quick lookups?</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-3">
                <code className="text-green-400 text-sm">
                  {`def two_sum(nums, target):`}<br/>
                  <span className="text-gray-500">{`    # Your solution here`}</span>
                </code>
              </div>
            </div>
          </div>
        );
      
      case 'visual-tools':
        return (
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Algorithm Visualizer</span>
              <div className="flex gap-2">
                <PenTool className="w-4 h-4 text-[#124dff]" />
                <span className="text-xs text-gray-400">Drawing mode</span>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg h-40 relative overflow-hidden">
              {/* Simulated drawing canvas */}
              <svg className="absolute inset-0 w-full h-full">
                <path d="M20,60 Q60,20 100,60 T180,60" stroke="#124dff" strokeWidth="2" fill="none" />
                <circle cx="20" cy="60" r="8" fill="#33cc99" />
                <circle cx="100" cy="60" r="8" fill="#33cc99" />
                <circle cx="180" cy="60" r="8" fill="#33cc99" />
                <text x="25" y="85" className="text-xs fill-white">1</text>
                <text x="105" y="85" className="text-xs fill-white">2</text>
                <text x="185" y="85" className="text-xs fill-white">3</text>
              </svg>
              <div className="absolute bottom-2 left-2 text-xs text-gray-400">Binary Tree Traversal</div>
            </div>
          </div>
        );
      
      case 'analytics-dashboard':
        return (
          <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white font-medium">Progress Analytics</span>
              <TrendingUp className="w-4 h-4 text-[#33cc99]" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Google Questions</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full">
                    <div className="w-12 h-2 bg-[#33cc99] rounded-full"></div>
                  </div>
                  <span className="text-white text-sm">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Meta Questions</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full">
                    <div className="w-8 h-2 bg-[#124dff] rounded-full"></div>
                  </div>
                  <span className="text-white text-sm">50%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Apple Questions</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-700 rounded-full">
                    <div className="w-4 h-2 bg-[#33cc99] rounded-full"></div>
                  </div>
                  <span className="text-white text-sm">25%</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className="bg-gray-800/50 rounded-2xl h-64 border border-gray-700"></div>;
    }
  };

  return (
    <section 
  className="relative py-32 text-white overflow-hidden"
  style={{
    background: `
      radial-gradient(circle at 50% 25%, 
        rgba(51, 204, 153, 0.3) 0%, 
        rgba(18, 77, 255, 0.2) 30%, 
        rgba(30, 27, 75, 0.4) 60%, 
        rgba(0, 0, 0, 1) 100%
      )
    `
  }}
>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header - More natural, less "AI template" */}
        <div className="max-w-4xl mb-20">
          <div className="inline-block bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-700 mb-6">
            <span className="text-[#33cc99] text-sm font-medium">FEATURES</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            The building blocks of a 
            <br />
            <span className="text-[#33cc99]">powerful platform</span>
          </h2>
          <p className="text-xl text-gray-400 leading-relaxed">
            Our development team will get in touch to better understand your needs, 
            and either help you with the sign-up process or provide a custom solution.
          </p>
        </div>

        {/* Main Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <div>
              <div className="inline-block bg-[#33cc99]/10 px-3 py-1 rounded-full border border-[#33cc99]/20 mb-4">
                <span className="text-[#33cc99] text-sm font-medium">{features[activeFeature].category}</span>
              </div>
              <h3 className="text-4xl font-bold mb-6 leading-tight">
                {features[activeFeature].title}
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                {features[activeFeature].description}
              </p>
              
              <div className="space-y-3 mb-8">
                {features[activeFeature].benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#33cc99]/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#33cc99]"></div>
                    </div>
                    <span className="text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>

              <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#33cc99] to-[#124dff] text-black px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300">
                Try it free
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="relative">
            <ProductMockup type={features[activeFeature].mockup} />
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#33cc99]/20 to-[#124dff]/20 rounded-2xl backdrop-blur-sm border border-white/10"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#124dff]/20 to-[#33cc99]/20 rounded-xl backdrop-blur-sm border border-white/10"></div>
          </div>
        </div>

        {/* Feature Navigation */}
        <div className="flex justify-center mb-20">
          <div className="flex gap-4">
            {features.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeFeature === index
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {feature.category}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Features Grid - More organic layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Timer,
              title: "Pomodoro Integration",
              description: "Built-in focus timer to maintain peak concentration during coding sessions."
            },
            {
              icon: BookOpen,
              title: "Smart Notes",
              description: "Contextual note-taking that syncs with your problem-solving progress."
            },
            {
              icon: Building2,
              title: "Company Insights",
              description: "Track which companies ask specific questions most frequently."
            },
            {
              icon: Code,
                title: "Python Execution",
              description: "Built-in Python interpreter with instant code execution and testing."
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#33cc99]/20 to-[#124dff]/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-[#33cc99]" />
                </div>
                <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center gap-3 bg-gray-900/50 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-800">
            <Play className="w-4 h-4 text-[#33cc99]" />
            <span className="text-gray-300">Watch how it works</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;