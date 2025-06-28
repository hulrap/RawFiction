import React, { useCallback } from 'react';
import { ContentWrapper } from './Wrapper';
import type { ProjectProps, TabItem } from '../../shared/types';

export const SocialMediaCard: React.FC<ProjectProps> = ({ isActive: _isActive = true }) => {
  const handleError = useCallback((error: string, context: string) => {
    console.error(`Social Media Consulting error [${context}]: ${error}`);
  }, []);

  const handleSuccess = useCallback((action: string) => {
    console.warn(`Social Media Consulting success: ${action}`);
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">
              <h1 className="heading-main mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Social Media Consulting
              </h1>
              <p className="text-xl opacity-90 leading-relaxed max-w-3xl mx-auto">
                Strategic social media consulting and traffic generation services for businesses
                looking to amplify their digital presence and reach.
              </p>
              <div className="inline-block mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full text-sm font-medium">
                📱 Digital Growth • Analytics • ROI Optimization
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-glass p-8 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 hover:from-blue-800/30 hover:to-cyan-800/30 transition-colors">
                <h3 className="heading-card mb-4 text-blue-300">📈 Traffic Generation</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Proven strategies to drive high-quality traffic to your website and convert
                  visitors into customers through targeted campaigns and data-driven optimization.
                </p>
              </div>

              <div className="card-glass p-8 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 hover:from-cyan-800/30 hover:to-blue-800/30 transition-colors">
                <h3 className="heading-card mb-4 text-cyan-300">🎯 Strategy Consulting</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Comprehensive social media strategies tailored to your brand&apos;s unique voice
                  and business objectives across all major platforms and emerging channels.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div className="card-glass p-6 text-center hover:bg-blue-900/20 transition-colors group">
                <div className="text-2xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  500%
                </div>
                <div className="text-xs opacity-75">Avg. Traffic Increase</div>
              </div>
              <div className="card-glass p-6 text-center hover:bg-cyan-900/20 transition-colors group">
                <div className="text-2xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                  50+
                </div>
                <div className="text-xs opacity-75">Satisfied Clients</div>
              </div>
              <div className="card-glass p-6 text-center hover:bg-blue-900/20 transition-colors group">
                <div className="text-2xl font-bold text-blue-400 mb-2 group-hover:scale-110 transition-transform">
                  24/7
                </div>
                <div className="text-xs opacity-75">Campaign Monitoring</div>
              </div>
              <div className="card-glass p-6 text-center hover:bg-cyan-900/20 transition-colors group">
                <div className="text-2xl font-bold text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                  3-5x
                </div>
                <div className="text-xs opacity-75">ROI Average</div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'services',
      title: 'Services',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="heading-section text-blue-300">Professional Services</h2>
              <p className="text-lg opacity-90 mb-8">Comprehensive digital marketing solutions</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-anthracite p-6 text-center">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Content Strategy</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Creating engaging content that resonates with your audience and drives meaningful
                  engagement across all platforms.
                </p>
              </div>

              <div className="card-anthracite p-6 text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-blue-300 mb-3">Paid Advertising</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  ROI-focused ad campaigns across multiple platforms with advanced targeting and
                  conversion optimization.
                </p>
              </div>

              <div className="card-anthracite p-6 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold text-cyan-300 mb-3">Analytics & Growth</h3>
                <p className="text-sm opacity-75 leading-relaxed">
                  Data-driven insights and performance optimization to maximize your social media
                  ROI and growth metrics.
                </p>
              </div>
            </div>

            <div className="card-glass p-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Platform Expertise</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl mb-2">📘</div>
                  <div className="font-medium text-blue-300">Facebook</div>
                  <div className="text-xs opacity-75">Ads & Organic</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📸</div>
                  <div className="font-medium text-cyan-300">Instagram</div>
                  <div className="text-xs opacity-75">Visual Content</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">💼</div>
                  <div className="font-medium text-blue-300">LinkedIn</div>
                  <div className="text-xs opacity-75">B2B Growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎵</div>
                  <div className="font-medium text-cyan-300">TikTok</div>
                  <div className="text-xs opacity-75">Viral Marketing</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'process',
      title: 'Process',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="heading-section text-cyan-300">Our Process</h2>
              <p className="text-lg opacity-90 mb-8">Strategic approach to digital growth</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: '01',
                  title: 'Discovery & Audit',
                  description:
                    'Comprehensive analysis of your current digital presence, competitor landscape, and growth opportunities.',
                  icon: '🔍',
                  color: 'blue',
                },
                {
                  step: '02',
                  title: 'Strategy Development',
                  description:
                    'Custom strategy creation based on your business goals, target audience, and market positioning.',
                  icon: '📋',
                  color: 'cyan',
                },
                {
                  step: '03',
                  title: 'Implementation',
                  description:
                    'Execute campaigns across selected platforms with optimized content and targeting strategies.',
                  icon: '🚀',
                  color: 'blue',
                },
                {
                  step: '04',
                  title: 'Optimization',
                  description:
                    'Continuous monitoring, testing, and refinement based on performance data and market changes.',
                  icon: '⚡',
                  color: 'cyan',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="card-glass p-6 hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-cyan-900/20 transition-all duration-300"
                >
                  <div className="flex items-start space-x-6">
                    <div
                      className={`flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r ${item.color === 'blue' ? 'from-blue-600 to-blue-500' : 'from-cyan-600 to-cyan-500'} flex items-center justify-center text-white font-bold text-lg`}
                    >
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{item.icon}</span>
                        <h3
                          className={`text-xl font-bold ${item.color === 'blue' ? 'text-blue-300' : 'text-cyan-300'}`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-sm opacity-75 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'results',
      title: 'Results',
      content: (
        <div className="h-full w-full p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="heading-section text-blue-300">Proven Results</h2>
              <p className="text-lg opacity-90 mb-8">Real outcomes for real businesses</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-anthracite p-8">
                <h3 className="text-xl font-bold text-cyan-300 mb-6">Client Success Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-sm opacity-75">Average Traffic Growth</span>
                    <span className="text-lg font-bold text-blue-400">+487%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-sm opacity-75">Conversion Rate Improvement</span>
                    <span className="text-lg font-bold text-cyan-400">+234%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-700">
                    <span className="text-sm opacity-75">Social Engagement Boost</span>
                    <span className="text-lg font-bold text-blue-400">+612%</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm opacity-75">Return on Ad Spend</span>
                    <span className="text-lg font-bold text-cyan-400">4.8x</span>
                  </div>
                </div>
              </div>

              <div className="card-anthracite p-8">
                <h3 className="text-xl font-bold text-blue-300 mb-6">Service Highlights</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">24/7 campaign monitoring</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Weekly performance reports</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Dedicated account management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Custom analytics dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">A/B testing & optimization</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">ROI-focused strategies</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-glass p-8 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Ready to Grow Your Business?</h3>
              <p className="text-lg opacity-90 mb-6">
                Join 50+ successful clients who have transformed their digital presence
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-6 py-2 bg-blue-600 rounded-full text-sm font-medium">
                  📞 Free Consultation
                </div>
                <div className="px-6 py-2 bg-cyan-600 rounded-full text-sm font-medium">
                  📊 Strategy Audit
                </div>
                <div className="px-6 py-2 bg-blue-600 rounded-full text-sm font-medium">
                  🚀 Growth Plan
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  // Lightweight loading configuration for static content
  const loadingConfig = {
    tabs: [
      { id: 'overview', title: 'Overview', priority: 'immediate' as const },
      { id: 'services', title: 'Services', priority: 'preload' as const },
      { id: 'process', title: 'Process', priority: 'preload' as const },
      { id: 'results', title: 'Results', priority: 'lazy' as const },
    ],
    images: [], // No images for static content
  };

  return (
    <ContentWrapper
      id="social-media-consulting"
      tabs={tabs}
      className="h-full w-full"
      onError={handleError}
      onSuccess={handleSuccess}
      loadingConfig={loadingConfig}
    />
  );
};
