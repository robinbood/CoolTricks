import React from 'react';

const Testimonials: React.FC = () => {
  return (
    <section className="prod-testimonials">
      <div className="prod-container">
        <div className="prod-testimonials-grid">
          <div className="prod-testimonial">
            <div className="prod-testimonial-content">
              <div className="prod-testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="prod-testimonial-text">
                "Finally a place where I can share my daily wins guilt-free!
                The community here is insanely supportive."
              </p>
              <div className="prod-testimonial-author">
                <div className="prod-avatar">👩‍💻</div>
                <div>
                  <h4>Sarah Chen</h4>
                  <span>Software Developer</span>
                </div>
              </div>
            </div>
          </div>

          <div className="prod-testimonial">
            <div className="prod-testimonial-content">
              <div className="prod-testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="prod-testimonial-text">
                "The cheer system is addictive! Every morning I get excited
                to post what I accomplished."
              </p>
              <div className="prod-testimonial-author">
                <div className="prod-avatar">🏃‍♂️</div>
                <div>
                  <h4>Mike Rodriguez</h4>
                  <span>Marathon Runner</span>
                </div>
              </div>
            </div>
          </div>

          <div className="prod-testimonial">
            <div className="prod-testimonial-content">
              <div className="prod-testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="prod-testimonial-text">
                "Instead of social media doom-scrolling, now I get inspired
                by real people's progress. Game changer!"
              </p>
              <div className="prod-testimonial-author">
                <div className="prod-avatar">📚</div>
                <div>
                  <h4>Jenny Park</h4>
                  <span>Medical Student</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;