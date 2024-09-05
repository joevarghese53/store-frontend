import React from 'react';

const Hiring = () => {
  return (
    <div className="hiring-page">
      <div className="hiring-page__header">
        <h1>Join Our Team at Dgen</h1>
        <h2>Are You Ready to Shape the Future?</h2>
      </div>

      <div className="hiring-page__section">
        <h3>What We Offer</h3>
        <ul>
          <li><strong>Equity-Based Compensation</strong>: While we can't offer a salary at this stage, we provide equity in the company based on your contribution. Grow with us, and share in our success.</li>
          <li><strong>Impactful Work</strong>: Be a part of high-impact projects where your contributions directly influence the company's trajectory.</li>
          <li><strong>Collaborative Environment</strong>: Work closely with a small, dedicated team that values creativity, innovation, and getting things done.</li>
        </ul>
      </div>

      <div className="hiring-page__section">
        <h3>Who We're Looking For</h3>
        <ul>
          <li><strong>AI & ML Experts</strong>: Passionate about artificial intelligence and machine learning? We need innovators who can help drive our tech to the next level.</li>
          <li><strong>MERN Stack Developers</strong>: Skilled in MongoDB, Express, React, and Node.js? We’re looking for developers who can build and scale web applications from start to finish.</li>
          <li><strong>Creative Designers</strong>: Whether it’s UI/UX or fashion design, we need visionaries who can bring fresh, bold ideas to the table.</li>
        </ul>
      </div>

      <div className="hiring-page__section">
        <h3>Expectations</h3>
        <ul>
          <li><strong>High Skill Level</strong>: We need individuals who are highly skilled in their field and can take ownership of their projects.</li>
          <li><strong>Proactive Attitude</strong>: This is a start-up environment—things move fast, and we need people who can adapt and get things done.</li>
          <li><strong>Team Players</strong>: Collaboration is key. We’re looking for people who can communicate effectively and work well in a small team.</li>
          <li><strong>Marketing Specialists</strong>: Are you a strategic thinker with a knack for reaching audiences? We're looking for marketers who can build brand awareness and drive engagement.</li>
          <li><strong>Content Creators</strong>: Great at crafting compelling stories or creating engaging content? We need individuals who can develop content that resonates with our audience and aligns with our brand.</li>
        </ul>
      </div>

      <div className="hiring-page__section hiring-page__apply">
        <h3>How to Apply</h3>
        <p>
          If you’re excited about building something extraordinary and believe you have what it takes, we’d love to hear from you!
        </p>
        <p><strong>Please send your application and resume to</strong>: <a href="mailto:dgenhiring@gmail.com">dgenhiring@gmail.com</a></p>
      </div>
    </div>
  );
}

export default Hiring;
