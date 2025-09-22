import "../CSS/Main.css";
const Main = () => {
  return (
    <div className="container">
      <div className="background-system">
        <div className="social-connections" id="socialConnections"></div>
    </div>

    
    <header className="header" id="header">
        <div className="nav-container">
            <a href="#" className="logo">
                <div className="logo-icon">N</div>
                <span>Nexus</span>
            </a>
            
            <nav className="nav-links">
                <a href="#features" className="nav-link">Features</a>
                <a href="#community" className="nav-link">Community</a>
                <a href="#pricing" className="nav-link">Pricing</a>
                <a href="#blog" className="nav-link">Blog</a>
            </nav>
            
            <div className="background-system">
                <div className="nav-container"> <a href="#" className="btn btn-primary">
                    <span>Join Now</span>
                    <span>→</span>
                </a>
            </div>
        </div>
        </div>
    </header>

    <section className="hero">
        <div className="hero-content">
            <div className="hero-text">
                <div className="hero-badge">
                    <div className="badge-icon"></div>
                    <span>Now in Beta - Join 50,000+ Early Adopters</span>
                </div>
                
                <h1 className="hero-title">Where Minds Connect & Ideas Flourish</h1>
                
                <p className="hero-subtitle">
                    Experience the future of social networking with AI-powered connections, 
                    meaningful conversations, and a community that values authentic human interaction.
                </p>
                
                <div className="hero-actions">
                    <a href="#" className="btn btn-primary">
                        <span>Start Connecting</span>
                        <span>✨</span>
                    </a>
                    <a href="#" className="btn btn-secondary">
                        <span>Watch Demo</span>
                        <span>▶</span>
                    </a>
                </div>
                
                <div className="hero-stats">
                    <div className="stat-item">
                        <span className="stat-number">50K+</span>
                        <span className="stat-label">Active Members</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">1M+</span>
                        <span className="stat-label">Connections Made</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">98%</span>
                        <span className="stat-label">Satisfaction Rate</span>
                    </div>
                </div>
            </div>
            
            <div className="hero-visual">
                <div className="platform-preview">
                    <div className="preview-header">
                        <div className="preview-dots">
                            <div className="preview-dot"></div>
                            <div className="preview-dot"></div>
                            <div className="preview-dot"></div>
                        </div>
                        <div className="preview-title">Nexus Social Platform</div>
                    </div>
                    <div className="preview-content">
                        <div className="mock-feed">
                            <div className="mock-post">
                                <div className="mock-user">
                                    <div className="mock-avatar">A</div>
                                    <div className="mock-user-info">
                                        <div className="mock-username">Alex Chen</div>
                                        <div className="mock-time">2 minutes ago</div>
                                    </div>
                                </div>
                                <div className="mock-content">
                                    Just launched my first AI art project! The intersection of creativity and technology never ceases to amaze me. 🎨✨
                                </div>
                                <div className="mock-actions">
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--like-red)' }}></div>
                                        <span>24</span>
                                    </div>
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--message-blue)' }}></div>
                                        <span>8</span>
                                    </div>
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--share-blue)' }}></div>
                                        <span>3</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mock-post">
                                <div className="mock-user">
                                    <div className="mock-avatar">M</div>
                                    <div className="mock-user-info">
                                        <div className="mock-username">Maya Patel</div>
                                        <div className="mock-time">15 minutes ago</div>
                                    </div>
                                </div>
                                <div className="mock-content">
                                    Hosting a virtual book club discussion tonight! Topic: "The future of human connection in digital spaces" 📚
                                </div>
                                <div className="mock-actions">
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--like-red)' }}></div>
                                        <span>47</span>
                                    </div>
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--message-blue)' }}></div>
                                        <span>12</span>
                                    </div>
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--share-blue)' }}></div>
                                        <span>9</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mock-post">
                                <div className="mock-user">
                                    <div className="mock-avatar">J</div>
                                    <div className="mock-user-info">
                                        <div className="mock-username">Jordan Kim</div>
                                        <div className="mock-time">1 hour ago</div>
                                    </div>
                                </div>
                                <div className="mock-content">
                                    Amazing how this community has helped me find my co-founder! Sometimes the best connections happen organically. 🚀
                                </div>
                                <div className="mock-actions">
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--like-red)' }}></div>
                                        <span>89</span>
                                    </div>
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--message-blue)' }}></div>
                                        <span>23</span>
                                    </div>
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{background: 'var(--share-blue)'}}></div>
                                        <span>15</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mock-post">
                                <div className="mock-user">
                                    <div className="mock-avatar">S</div>
                                    <div className="mock-user-info">
                                        <div className="mock-username">Sarah Johnson</div>
                                        <div className="mock-time">3 hours ago</div>
                                    </div>
                                </div>
                                <div className="mock-content">
                                    The AI-powered interest matching here is incredible. Found 3 new collaborators for my sustainability project today! 🌱
                                </div>
                                <div className="mock-actions">
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--like-red)' }}></div>
                                        <span>156</span>
                                    </div>
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--message-blue)' }}></div>
                                        <span>34</span>
                                    </div>
                                    <div className="mock-action">
                                        <div className="mock-action-icon" style={{ background: 'var(--share-blue)' }}></div>
                                        <span>28</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Features Section */}
    <section className="features" id="features">
        <div className="features-container">
            <div className="features-header reveal">
                <h2 className="features-title">Built for Meaningful Connections</h2>
                <p className="features-subtitle">
                    Advanced algorithms and thoughtful design create an environment where authentic relationships thrive and communities flourish.
                </p>
            </div>
            
            <div className="features-grid">
                <div className="feature-card reveal reveal-delay-1">
                    <div className="feature-icon">🧠</div>
                    <h3 className="feature-title">AI-Powered Matching</h3>
                    <p className="feature-description">
                        Our advanced algorithm analyzes interests, values, and communication styles to suggest meaningful connections you'll actually want to engage with.
                    </p>
                    <a href="#" className="feature-link">
                        <span>Learn More</span>
                        <span>→</span>
                    </a>
                </div>
                
                <div className="feature-card reveal reveal-delay-2">
                    <div className="feature-icon">🛡️</div>
                    <h3 className="feature-title">Privacy First</h3>
                    <p className="feature-description">
                        End-to-end encryption, granular privacy controls, and zero data selling. Your personal information belongs to you, not advertisers.
                    </p>
                    <a href="#" className="feature-link">
                        <span>Privacy Policy</span>
                        <span>→</span>
                    </a>
                </div>
                
                <div className="feature-card reveal reveal-delay-3">
                    <div className="feature-icon">💬</div>
                    <h3 className="feature-title">Quality Conversations</h3>
                    <p className="feature-description">
                        Tools and prompts designed to encourage deeper discussions, meaningful exchanges, and genuine human connection beyond surface-level interactions.
                    </p>
                    <a href="#" className="feature-link">
                        <span>Explore Features</span>
                        <span>→</span>
                    </a>
                </div>
                
                <div className="feature-card reveal reveal-delay-1">
                    <div className="feature-icon">🌍</div>
                    <h3 className="feature-title">Global Communities</h3>
                    <p className="feature-description">
                        Join interest-based communities spanning the globe, participate in local events, and connect with people who share your passions and values.
                    </p>
                    <a href="#" className="feature-link">
                        <span>Browse Communities</span>
                        <span>→</span>
                    </a>
                </div>
                
                <div className="feature-card reveal reveal-delay-2">
                    <div className="feature-icon">📊</div>
                    <h3 className="feature-title">Wellness Analytics</h3>
                    <p className="feature-description">
                        Track your digital wellness with insights into your social interactions, helping you maintain healthy online relationships and boundaries.
                    </p>
                    <a href="#" className="feature-link">
                        <span>View Dashboard</span>
                        <span>→</span>
                    </a>
                </div>
                
                <div className="feature-card reveal reveal-delay-3">
                    <div className="feature-icon">⚡</div>
                    <h3 className="feature-title">Real-Time Collaboration</h3>
                    <p className="feature-description">
                        Seamlessly work together on projects, share ideas, and create together with integrated collaboration tools and workspaces.
                    </p>
                    <a href="#" className="feature-link">
                        <span>Start Collaborating</span>
                        <span>→</span>
                    </a>
                </div>
            </div>
        </div>
    </section>

    {/* CTA Section */}
    <section className="cta">
        <div className="cta-container">
            <h2 className="cta-title">Ready to Connect Authentically?</h2>
            <p className="cta-subtitle">
                Join thousands of people building meaningful relationships and communities. 
                Start your journey toward more intentional social networking today.
            </p>
            <div className="cta-actions">
                <a href="#" className="btn btn-white">
                    <span>Create Your Profile</span>
                    <span>🚀</span>
                </a>
                <a href="#" className="btn btn-outline">
                    <span>Explore Communities</span>
                    <span>👥</span>
                </a>
            </div>
        </div>
    </section>

    {/* Footer */}
    <footer className="footer">
        <div className="footer-container">
            <div className="footer-content">
                <div>
                    <div className="footer-brand">
                        <div className="footer-logo">N</div>
                        <div className="footer-brand-name">Nexus</div>
                    </div>
                    <p className="footer-description">
                        Building the future of authentic social networking, one meaningful connection at a time.
                    </p>
                    <div className="footer-social">
                        <a href="#" className="social-link">𝕏</a>
                        <a href="#" className="social-link">📘</a>
                        <a href="#" className="social-link">📷</a>
                        <a href="#" className="social-link">💼</a>
                    </div>
                </div>
                
                <div className="footer-links">
                    <div className="footer-section">
                        <h3>Product</h3>
                        <ul>
                            <li><a href="#">Features</a></li>
                            <li><a href="#">Communities</a></li>
                            <li><a href="#">Mobile App</a></li>
                            <li><a href="#">API</a></li>
                            <li><a href="#">Integrations</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Company</h3>
                        <ul>
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Careers</a></li>
                            <li><a href="#">Press</a></li>
                            <li><a href="#">Contact</a></li>
                        </ul>
                    </div>
                    
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Terms of Service</a></li>
                            <li><a href="#">Community Guidelines</a></li>
                            <li><a href="#">Status Page</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; 2025 Nexus. Connecting minds, building futures.</p>
            </div>
        </div>
    </footer>
    </div>
  );
};

export default Main;
