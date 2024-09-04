import React from 'react';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      {/* Header Section with Background Image */}
      <header className="about-us-header">
        <h1 className="about-us-title">Our Story</h1>
        <p className="about-us-subtitle">Express Yourself with Dgen</p>
      </header>

      {/* Section 1: The Birth of Your Brand */}
      <section className="about-us-section">
        <h2 className="section-title">The Birth of Dgen</h2>
        <p className="section-text">
          We started Dgen with one simple idea: to give people the power to express themselves through their clothing. In a world that often follows the trends, we wanted to stand out, offering something unique, bold, and unapologetically personal.
        </p>
        <img 
          src="/img/story1.jpg" 
          alt="Creative designs showcase"
          className="about-us-image"
        />
      </section>

      {/* Section 2: Embracing Uniqueness */}
      <section className="about-us-section alt-background">
        <h2 className="section-title">Embracing Uniqueness</h2>
        <p className="section-text">
          Being different isn't always easy. It takes courage to stray from the path, to experiment with ideas that others might dismiss, and to create without the guarantee of success. But that's what we're all about.
        </p>
        <img 
          src="/img/story2.jpg" 
          alt="Unique fashion concept"
          className="about-us-image"
        />
      </section>

      {/* Section 3: Design Your Own Path */}
      <section className="about-us-section">
        <h2 className="section-title">Design Your Own Path</h2>
        <p className="section-text">
          With our print-on-demand model, we empower you to become the designer. Every design tells a story, and we believe those stories deserve to be worn, shared, and celebrated.
        </p>
        <img 
          src="/img/story3.jpg" 
          alt="Custom design example"
          className="about-us-image"
        />
      </section>

      {/* Section 4: Commitment to Quality and Responsibility */}
      <section className="about-us-section alt-background">
        <h2 className="section-title">Our Commitment to Quality and Responsibility</h2>
        <p className="section-text">
          We’re committed to quality and responsibility in every aspect of our business—from innovative technology to sustainable choices.
        </p>
        <img 
          src="/img/story4.jpeg" 
          alt="Quality and sustainable practices"
          className="about-us-image"
        />
      </section>

      {/* Closing Section */}
      <section className="about-us-closing">
        <h2 className="closing-title">Join Us on This Journey</h2>
        <p className="closing-text">
          We’re excited to have you with us on this journey of creativity and self-expression. Welcome to Dgen. Welcome to a world of your own making.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
