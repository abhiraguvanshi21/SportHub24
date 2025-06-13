import React from 'react';
import { Users, Target, Award, Globe, Clock, Shield } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: <Users className="h-8 w-8" />, number: "50K+", label: "Active Users" },
    { icon: <Globe className="h-8 w-8" />, number: "100+", label: "Countries Served" },
    { icon: <Clock className="h-8 w-8" />, number: "24/7", label: "Live Coverage" },
    { icon: <Award className="h-8 w-8" />, number: "1000+", label: "Matches Covered" },
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      description: "Former cricket analyst with 15+ years in sports broadcasting"
    },
    {
      name: "Sarah Johnson",
      role: "Head of Technology",
      description: "Expert in live streaming and real-time data processing"
    },
    {
      name: "Mike Thompson",
      role: "Lead Commentator",
      description: "Professional cricket commentator and former player"
    },
    {
      name: "Priya Sharma",
      role: "Content Director",
      description: "Sports journalist specializing in cricket coverage"
    }
  ];

  return (
    <div className="py-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About SportHub24</h1>
          <p className="text-xl md:text-2xl text-green-100 max-w-3xl mx-auto">
            Revolutionizing cricket coverage with cutting-edge technology and passionate expertise
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At SportHub24, we're passionate about bringing cricket fans closer to the action. 
                Our mission is to provide the most comprehensive, accurate, and engaging cricket 
                coverage through innovative technology and expert commentary.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe every cricket match deserves professional-grade coverage, whether it's 
                an international tournament or a local club game. Our platform combines real-time 
                scoring, live video commentary, and in-depth analysis to create an unmatched 
                cricket viewing experience.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-green-600">
                  <Target className="h-6 w-6 mr-2" />
                  <span className="font-semibold">Precision</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <Shield className="h-6 w-6 mr-2" />
                  <span className="font-semibold">Reliability</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-green-600 mb-2 flex justify-center">
                      {stat.icon}
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gradient-to-r from-slate-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <p className="text-xl text-gray-600">Comprehensive cricket coverage services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-green-600 mb-4">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Scoring</h3>
              <p className="text-gray-600">
                Real-time ball-by-ball updates with comprehensive match statistics and player performance data.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-blue-600 mb-4">
                <Globe className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Live Video Commentary</h3>
              <p className="text-gray-600">
                Professional video commentary with expert analysis and insights from experienced cricket commentators.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-orange-600 mb-4">
                <Users className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Custom Scoring Services</h3>
              <p className="text-gray-600">
                Professional scoring services for your tournaments and matches with dedicated commentary teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Passionate cricket experts dedicated to excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-green-100 to-blue-100 w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="h-16 w-16 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;