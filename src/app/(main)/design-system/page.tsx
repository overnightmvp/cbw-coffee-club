'use client'

import React, { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '@/components/ui'
import { designTokens } from '@/lib/design-tokens'

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState('documentation')

  const sections = [
    { id: 'documentation', label: 'Documentation' },
    { id: 'prd', label: 'Product Requirements' },
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'components', label: 'Components' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'usage', label: 'Usage Guidelines' }
  ]

  const ColorPalette = ({ colors, title }: { colors: Record<string, string>, title: string }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(colors).map(([shade, color]) => (
          <div key={shade} className="text-center">
            <div 
              className="h-16 w-full rounded-lg mb-2 border"
              style={{ backgroundColor: color as string }}
            />
            <div className="text-xs">
              <div className="font-medium">{shade}</div>
              <div className="text-neutral-500 font-mono">{color}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-neutral-900">The Bean Route Design System</h1>
            <p className="text-neutral-600 mt-2">
              Complete component library, design guidelines, and product requirements for The Bean Route — Melbourne coffee cart marketplace
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-500'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="space-y-8">
              
              {/* Documentation */}
              {activeSection === 'documentation' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Component Documentation</h2>
                  
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          📚 Interactive Component Library
                          <Badge variant="default">New</Badge>
                        </CardTitle>
                        <CardDescription>Explore all components with live examples and code snippets</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <a 
                          href="/storybook/index.html" 
                          target="_blank"
                          className="block p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-blue-900">Storybook Documentation</div>
                              <div className="text-sm text-blue-700">Interactive component playground with Australian corporate examples</div>
                            </div>
                            <div className="text-blue-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          🛠️ Admin Panel
                          <Badge variant="success" size="sm">Live</Badge>
                        </CardTitle>
                        <CardDescription>Lead management dashboard for booking inquiries</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <a 
                          href="/admin" 
                          target="_blank"
                          className="block p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 border border-green-200"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-green-900">Lead Management Dashboard</div>
                              <div className="text-sm text-green-700">View booking inquiries, update status, manage leads</div>
                            </div>
                            <div className="text-green-600">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>UI Components</CardTitle>
                        <CardDescription>Complete component documentation with examples</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <a 
                            href="/design-system/docs/button.md" 
                            target="_blank"
                            className="block p-3 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors"
                          >
                            <div className="font-medium">Button</div>
                            <div className="text-sm text-neutral-600">Variants, sizes, states, icons</div>
                          </a>
                          <a 
                            href="/design-system/docs/input.md" 
                            target="_blank"
                            className="block p-3 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors"
                          >
                            <div className="font-medium">Input</div>
                            <div className="text-sm text-neutral-600">Forms, validation, labels, icons</div>
                          </a>
                          <a 
                            href="/design-system/docs/card.md" 
                            target="_blank"
                            className="block p-3 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors"
                          >
                            <div className="font-medium">Card</div>
                            <div className="text-sm text-neutral-600">Containers, headers, content, footers</div>
                          </a>
                          <a 
                            href="/design-system/docs/badge.md" 
                            target="_blank"
                            className="block p-3 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors"
                          >
                            <div className="font-medium">Badge</div>
                            <div className="text-sm text-neutral-600">Status indicators, labels, icons</div>
                          </a>
                          <a 
                            href="/design-system/docs/admin-panel.md" 
                            target="_blank"
                            className="block p-3 bg-neutral-50 rounded hover:bg-neutral-100 transition-colors"
                          >
                            <div className="font-medium">Admin Panel</div>
                            <div className="text-sm text-neutral-600">Lead management, security setup, workflow</div>
                          </a>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Start</CardTitle>
                        <CardDescription>Get started with the design system</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-neutral-100 p-4 rounded font-mono text-sm space-y-2">
                          <div className="text-green-600">{`// Import any component`}</div>
                          <div>{`import { Button, Input, Card, Badge } from '@/components/ui'`}</div>
                          <br />
                          <div className="text-green-600">{`// Use immediately`}</div>
                          <div>{`<Button variant="primary">Get Started</Button>`}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Product Documentation</CardTitle>
                      <CardDescription>Business requirements and development history</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <a 
                          href="/design-system/docs/production-status.md" 
                          target="_blank"
                          className="block p-4 bg-green-50 rounded hover:bg-green-100 transition-colors"
                        >
                          <div className="font-medium text-green-900">Production Status</div>
                          <div className="text-sm text-green-700">Live system deployment</div>
                        </a>
                        <a 
                          href="/design-system/docs/deployment-guide.md" 
                          target="_blank"
                          className="block p-4 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                        >
                          <div className="font-medium text-blue-900">Deployment Guide</div>
                          <div className="text-sm text-blue-700">Complete setup instructions</div>
                        </a>
                        <a 
                          href="https://g.co/gemini/share/8f3b8b3e6f66" 
                          target="_blank"
                          className="block p-4 bg-purple-50 rounded hover:bg-purple-100 transition-colors"
                        >
                          <div className="font-medium text-purple-900">Gemini Chat</div>
                          <div className="text-sm text-purple-700">Original development collaboration</div>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Product Requirements */}
              {activeSection === 'prd' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Product Requirements Documentation</h2>
                  
                  <div className="mb-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Foundation Documents</CardTitle>
                        <CardDescription>
                          Original product requirements that guided early development from concept to production (archived for reference)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-neutral-600 mb-4">
                          These PRD documents capture the original prompts and vision from an earlier product iteration (archived for reference). Created in collaboration with 
                          <a 
                            href="https://g.co/gemini/share/8f3b8b3e6f66" 
                            target="_blank" 
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            Gemini AI
                          </a>.
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">PRD-001</CardTitle>
                        <CardDescription>Product Assessment Interview</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="text-neutral-600">
                            Two-sided marketplace specifications, business model, target market analysis, 
                            and competitive positioning for Australian SMB market.
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-neutral-800">Key Topics:</div>
                            <ul className="text-neutral-600 space-y-1 pl-4">
                              <li>• SaaS subscription model ($50-200/month)</li>
                              <li>• Australian SMB target (50-500 employees)</li>
                              <li>• Premium experience curation</li>
                              <li>• Mobile-first architecture</li>
                            </ul>
                          </div>
                          <a 
                            href="/design-system/docs/prd-001-product-assessment.md" 
                            target="_blank"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Document →
                          </a>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">PRD-002</CardTitle>
                        <CardDescription>Technical Architecture</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="text-neutral-600">
                            Current system implementation, target architecture, database evolution, 
                            and migration path from inquiry system to full marketplace.
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-neutral-800">Key Topics:</div>
                            <ul className="text-neutral-600 space-y-1 pl-4">
                              <li>• Next.js + Supabase foundation</li>
                              <li>• Authentication & payment integration</li>
                              <li>• Real-time booking system</li>
                              <li>• Mobile PWA implementation</li>
                            </ul>
                          </div>
                          <a 
                            href="/design-system/docs/prd-002-technical-architecture.md" 
                            target="_blank"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Document →
                          </a>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">PRD-003</CardTitle>
                        <CardDescription>User Research & Market Validation</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm">
                          <div className="text-neutral-600">
                            Primary personas (Sarah Chen - HR Manager), Australian market analysis, 
                            customer validation framework, and success metrics.
                          </div>
                          <div className="space-y-2">
                            <div className="font-medium text-neutral-800">Key Topics:</div>
                            <ul className="text-neutral-600 space-y-1 pl-4">
                              <li>• User personas and pain points</li>
                              <li>• Market size analysis ($2.1B TAM)</li>
                              <li>• Customer acquisition strategy</li>
                              <li>• A/B testing framework</li>
                            </ul>
                          </div>
                          <a 
                            href="/design-system/docs/prd-003-user-research-validation.md" 
                            target="_blank"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Document →
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Implementation Gap Analysis</CardTitle>
                        <CardDescription>Current state vs original PRD vision</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-3">✅ Successfully Implemented</h4>
                            <ul className="space-y-2 text-sm">
                              <li>• Australian market localization (AUD, venues, business context)</li>
                              <li>• Mobile-first responsive design with touch optimization</li>
                              <li>• Company assessment quiz with venue matching</li>
                              <li>• Clean Next.js + Supabase + TypeScript architecture</li>
                              <li>• Live production deployment on Vercel</li>
                              <li>• Curated premium venue selection (6 experiences)</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-orange-700 mb-3">🔄 Development Required</h4>
                            <ul className="space-y-2 text-sm">
                              <li>• Subscription billing system (currently inquiry-based)</li>
                              <li>• Real-time booking with instant confirmation</li>
                              <li>• Venue partner onboarding and management portal</li>
                              <li>• Production-ready authentication system</li>
                              <li>• Payment processing (Stripe Australia integration)</li>
                              <li>• Two-sided marketplace vs current lead generation</li>
                            </ul>
                          </div>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                          <div className="font-medium text-blue-900 mb-2">Complexity Assessment</div>
                          <div className="text-sm text-blue-800">
                            <strong>Current System:</strong> Solid foundation achieving core user value (95% time savings for HR managers)<br/>
                            <strong>Full Marketplace:</strong> Medium-high complexity requiring 8-12 weeks additional development<br/>
                            <strong>Recommendation:</strong> Validate current inquiry model, then evolve to full self-service platform
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Colors */}
              {activeSection === 'colors' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Color System</h2>
                  
                  <ColorPalette colors={designTokens.colors.primary} title="Primary Brand" />
                  <ColorPalette colors={designTokens.colors.neutral} title="Neutral Grays" />
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">Success</h3>
                      <div className="space-y-2">
                        {Object.entries(designTokens.colors.success).map(([shade, color]) => (
                          <div key={shade} className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded border"
                              style={{ backgroundColor: color as string }}
                            />
                            <div className="text-xs">
                              <div>{shade}</div>
                              <div className="font-mono text-neutral-500">{color}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Warning</h3>
                      <div className="space-y-2">
                        {Object.entries(designTokens.colors.warning).map(([shade, color]) => (
                          <div key={shade} className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded border"
                              style={{ backgroundColor: color as string }}
                            />
                            <div className="text-xs">
                              <div>{shade}</div>
                              <div className="font-mono text-neutral-500">{color}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Danger</h3>
                      <div className="space-y-2">
                        {Object.entries(designTokens.colors.danger).map(([shade, color]) => (
                          <div key={shade} className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded border"
                              style={{ backgroundColor: color as string }}
                            />
                            <div className="text-xs">
                              <div>{shade}</div>
                              <div className="font-mono text-neutral-500">{color}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">Info</h3>
                      <div className="space-y-2">
                        {Object.entries(designTokens.colors.info).map(([shade, color]) => (
                          <div key={shade} className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded border"
                              style={{ backgroundColor: color as string }}
                            />
                            <div className="text-xs">
                              <div>{shade}</div>
                              <div className="font-mono text-neutral-500">{color}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Typography */}
              {activeSection === 'typography' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Typography Scale</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Font Sizes</h3>
                      <div className="space-y-4">
                        {Object.entries(designTokens.typography.fontSize).map(([size, [fontSize, { lineHeight }]]) => (
                          <div key={size} className="flex items-baseline gap-4 p-4 bg-white rounded border">
                            <div className="w-12 text-xs text-neutral-500 font-mono">{size}</div>
                            <div 
                              className="font-medium"
                              style={{ fontSize, lineHeight }}
                            >
                              The quick brown fox jumps over the lazy dog
                            </div>
                            <div className="text-xs text-neutral-500 font-mono ml-auto">
                              {fontSize} / {lineHeight}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Font Weights</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {Object.entries(designTokens.typography.fontWeight).map(([weight, value]) => (
                          <div key={weight} className="p-4 bg-white rounded border">
                            <div 
                              className="text-lg mb-2"
                              style={{ fontWeight: value }}
                            >
                              {weight} ({value})
                            </div>
                            <div 
                              className="text-sm text-neutral-600"
                              style={{ fontWeight: value }}
                            >
                              Sample text with {weight} font weight
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Components */}
              {activeSection === 'components' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">UI Components</h2>
                  
                  <div className="space-y-8">
                    {/* Buttons */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Buttons</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium mb-3">Variants</h4>
                          <div className="flex flex-wrap gap-3">
                            <Button variant="primary">Primary</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="danger">Danger</Button>
                            <Button variant="success">Success</Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Sizes</h4>
                          <div className="flex flex-wrap items-center gap-3">
                            <Button size="xs">Extra Small</Button>
                            <Button size="sm">Small</Button>
                            <Button size="base">Base</Button>
                            <Button size="lg">Large</Button>
                            <Button size="xl">Extra Large</Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">States</h4>
                          <div className="flex flex-wrap gap-3">
                            <Button>Normal</Button>
                            <Button disabled>Disabled</Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Inputs</h3>
                      <div className="space-y-4 max-w-md">
                        <Input placeholder="Default input" />
                        <Input
                          type="email"
                          placeholder="john@example.com"
                        />
                        <Input
                          type="password"
                          placeholder="Enter password"
                        />
                        <Input placeholder="Text input" className="h-8 text-sm" />
                        <Input placeholder="Large input" className="h-12 text-base" />
                      </div>
                    </div>

                    {/* Badges */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Badges</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">Variants</h4>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="default">Default</Badge>
                            <Badge variant="primary">Primary</Badge>
                            <Badge variant="success">Success</Badge>
                            <Badge variant="warning">Warning</Badge>
                            <Badge variant="danger">Danger</Badge>
                            <Badge variant="info">Info</Badge>
                            <Badge variant="outline">Outline</Badge>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Sizes</h4>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge>Default Size</Badge>
                            <p className="text-sm text-gray-600">Badge component has fixed size. Use className for custom sizing.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cards */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Cards</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Default Card</CardTitle>
                            <CardDescription>This is a standard card with header and content</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-neutral-600">
                              Cards are flexible containers for grouping related content and actions.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="shadow-lg">
                          <CardHeader>
                            <CardTitle>Elevated Card</CardTitle>
                            <CardDescription>Enhanced shadow for emphasis</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-neutral-600">
                              Use elevated cards to create hierarchy and draw attention.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Spacing */}
              {activeSection === 'spacing' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Spacing System</h2>
                  
                  <div className="mb-6">
                    <p className="text-neutral-600 mb-4">
                      Our spacing system is based on an 8px grid for consistent, harmonious layouts.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(designTokens.spacing).slice(0, 20).map(([size, value]) => (
                      <div key={size} className="flex items-center gap-4 p-3 bg-white rounded border">
                        <div className="w-12 text-sm font-mono text-neutral-500">{size}</div>
                        <div 
                          className="bg-blue-200 h-6"
                          style={{ width: value }}
                        />
                        <div className="text-sm text-neutral-600 font-mono">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage Guidelines */}
              {activeSection === 'usage' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Usage Guidelines</h2>
                  
                  <div className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Do's and Don'ts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h4 className="font-semibold text-green-700 mb-3">✅ Do</h4>
                            <ul className="space-y-2 text-sm">
                              <li>• Use consistent spacing from our 8px grid</li>
                              <li>• Follow established color semantics</li>
                              <li>• Maintain proper contrast ratios</li>
                              <li>• Use appropriate button variants for actions</li>
                              <li>• Include proper labels and hints for inputs</li>
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-red-700 mb-3">❌ Don't</h4>
                            <ul className="space-y-2 text-sm">
                              <li>• Use arbitrary spacing values</li>
                              <li>• Mix different design patterns</li>
                              <li>• Ignore accessibility requirements</li>
                              <li>• Use primary buttons for destructive actions</li>
                              <li>• Leave form inputs without proper labels</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Implementation</CardTitle>
                        <CardDescription>How to use components in your code</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-neutral-100 p-4 rounded-lg font-mono text-sm">
                          <div className="text-green-600">{`// Import components`}</div>
                          <div>{`import { Button, Input, Card } from '@/components/ui'`}</div>
                          <br />
                          <div className="text-green-600">{`// Use with proper variants`}</div>
                          <div>{`<Button variant="primary" size="lg">Get Started</Button>`}</div>
                          <div>{`<Input label="Email" type="email" />`}</div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Accessibility</CardTitle>
                        <CardDescription>WCAG 2.1 AA compliance features</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li>• All interactive elements have focus indicators</li>
                          <li>• Color contrast ratios meet AA standards</li>
                          <li>• Form inputs include proper labels and error states</li>
                          <li>• Components support keyboard navigation</li>
                          <li>• Screen reader friendly markup and ARIA attributes</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}