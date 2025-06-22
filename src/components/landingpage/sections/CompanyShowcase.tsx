'use client';

import React from 'react';
import { Building2, TrendingUp, Star, ArrowRight } from 'lucide-react';

const CompanySection = () => {
  const companies = [
    {
      name: 'Google',
      logo: './logos/google.svg',
      problems: 45,
      frequency: 237,
    },
    {
      name: 'Amazon',
      logo: './logos/amazon.svg',
      problems: 38,
      frequency: 201,
    },
    { name: 'Meta', logo: './logos/meta.svg', problems: 32, frequency: 175 },
    {
      name: 'Microsoft',
      logo: './logos/microsoft.svg',
      problems: 29,
      frequency: 157,
    },
    { name: 'Apple', logo: './logos/apple.svg', problems: 24, frequency: 142 },
    {
      name: 'Netflix',
      logo: './logos/netflix.svg',
      problems: 18,
      frequency: 98,
    },
  ];

  const stats = [
    {
      label: 'Companies Tracked',
      value: '50+',
      icon: Building2,
      color: '#33cc99',
    },
    {
      label: 'Interview Questions',
      value: '175+',
      icon: Star,
      color: '#124dff',
    },
    { label: 'Success Rate', value: '94%', icon: TrendingUp, color: '#33cc99' },
  ];

  return (
    <section className="relative overflow-hidden py-32 text-white">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-gray-800 bg-gray-900/50 px-6 py-3 text-sm font-medium backdrop-blur-sm">
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#33cc99]" />
            <span className="text-gray-300">Real Company Data</span>
            <div className="animation-delay-1000 h-2 w-2 animate-pulse rounded-full bg-[#124dff]" />
          </div>

          <h2 className="mb-8 text-5xl font-bold lg:text-6xl">
            Practice with
            <br />
            <span className="bg-gradient-to-r from-[#124dff] via-[#33cc99] to-[#124dff] bg-clip-text text-transparent">
              Real Interview Questions
            </span>
          </h2>

          <p className="mx-auto mb-16 max-w-4xl text-xl leading-relaxed text-gray-400">
            Our database contains actual interview questions from top tech
            companies, updated with frequency data from recent interviews.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-20 grid grid-cols-1 gap-12 sm:grid-cols-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="group text-center">
                <div
                  className="mb-6 inline-flex rounded-2xl border p-6 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    borderColor: `${stat.color}30`,
                  }}
                >
                  <Icon className="h-10 w-10" style={{ color: stat.color }} />
                </div>
                <div className="mb-3 text-4xl font-bold text-white transition-colors group-hover:text-gray-200">
                  {stat.value}
                </div>
                <div className="text-sm uppercase tracking-wider text-gray-400">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Company Grid */}
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {companies.map((company, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-gray-800 bg-gray-900/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-[#33cc99]/50 hover:bg-gray-900/50"
            >
              {/* Company Logo */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gray-800 transition-colors group-hover:bg-gray-700">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="h-12 w-12 object-contain brightness-90 filter transition-all group-hover:brightness-100"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget
                      .nextElementSibling as HTMLElement)!.style.display =
                      'flex';
                  }}
                />
                <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-[#33cc99]/20 text-sm font-bold text-[#33cc99]">
                  {company.name.substring(0, 2).toUpperCase()}
                </div>
              </div>

              {/* Company Info */}
              <div className="text-center">
                <h3 className="mb-3 text-lg font-bold text-white transition-colors group-hover:text-[#33cc99]">
                  {company.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="h-3 w-3" />
                    <span>{company.problems} problems</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-3 w-3 text-[#124dff]" />
                    <span>{company.frequency} frequency</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Updated Badge & CTA */}
        <div className="text-center">
          <div className="mb-12 inline-flex items-center gap-3 rounded-xl border border-gray-800 bg-gray-900/50 px-6 py-4 font-medium text-gray-300 backdrop-blur-sm">
            <span>Updated 3 days ago</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-[#33cc99]" />
          </div>

          <div>
            <a
              href="/problems"
              className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#124dff] to-[#33cc99] px-10 py-5 text-lg font-bold text-black shadow-2xl transition-all duration-300 hover:from-[#0f3de6] hover:to-[#2db88a] hover:shadow-[#124dff]/25"
            >
              Explore All Companies
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySection;
