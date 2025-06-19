'use client';

import React from 'react';
import { Building2, TrendingUp, Star, ArrowRight } from 'lucide-react';

const CompanySection = () => {
  const companies = [
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com', problems: 45, frequency: 237 },
    { name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', problems: 38, frequency: 201 },
    { name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', problems: 32, frequency: 175 },
    { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', problems: 29, frequency: 157 },
    { name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', problems: 24, frequency: 142 },
    { name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com', problems: 18, frequency: 98 },
  ];

  const stats = [
    { label: 'Companies Tracked', value: '50+', icon: Building2, color: '#33cc99' },
    { label: 'Interview Questions', value: '175+', icon: Star, color: '#124dff' },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: '#33cc99' },
  ];

  return (
    <section className="relative py-32 text-white overflow-hidden">

      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-[#33cc99] rounded-full animate-pulse" />
            <span className="text-gray-300">Real Company Data</span>
            <div className="w-2 h-2 bg-[#124dff] rounded-full animate-pulse animation-delay-1000" />
          </div>
          
          <h2 className="text-5xl lg:text-6xl font-bold mb-8">
            Practice with
            <br />
            <span className="bg-gradient-to-r from-[#124dff] via-[#33cc99] to-[#124dff] bg-clip-text text-transparent">
              Real Interview Questions
            </span>
          </h2>
          
          <p className="text-xl text-gray-400 max-w-4xl mx-auto mb-16 leading-relaxed">
            Our database contains actual interview questions from top tech companies, updated with frequency data from recent interviews.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div 
                  className="inline-flex p-6 rounded-2xl mb-6 border transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    borderColor: `${stat.color}30`
                  }}
                >
                  <Icon 
                    className="w-10 h-10" 
                    style={{ color: stat.color }}
                  />
                </div>
                <div className="text-4xl font-bold text-white mb-3 group-hover:text-gray-200 transition-colors">
                  {stat.value}
                </div>
                <div className="text-gray-400 uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {companies.map((company, index) => (
            <div
              key={index}
              className="group bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-[#33cc99]/50 hover:bg-gray-900/50 transition-all duration-300"
            >
              {/* Company Logo */}
              <div className="w-16 h-16 mx-auto mb-6 rounded-xl overflow-hidden bg-gray-800 flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-10 h-10 object-contain filter brightness-90 group-hover:brightness-100 transition-all"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'flex';
                  }}
                />
                <div className="w-10 h-10 bg-[#33cc99]/20 rounded-lg items-center justify-center text-sm font-bold text-[#33cc99] hidden">
                  {company.name.substring(0, 2).toUpperCase()}
                </div>
              </div>

              {/* Company Info */}
              <div className="text-center">
                <h3 className="font-bold text-white mb-3 group-hover:text-[#33cc99] transition-colors text-lg">
                  {company.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="w-3 h-3" />
                    <span>{company.problems} problems</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-3 h-3 text-[#124dff]" />
                    <span>{company.frequency} frequency</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Updated Badge & CTA */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl text-gray-300 font-medium mb-12">
            <span>Updated 3 days ago</span>
            <div className="w-2 h-2 bg-[#33cc99] rounded-full animate-pulse" />
          </div>
          
          <div>
            <a
              href="/problems"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#124dff] to-[#33cc99] text-black font-bold rounded-xl hover:from-[#0f3de6] hover:to-[#2db88a] transition-all duration-300 shadow-2xl hover:shadow-[#124dff]/25 text-lg"
            >
              Explore All Companies
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;