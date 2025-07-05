import React from 'react';

export const WelcomeCard: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="card-glass p-12 max-w-2xl text-center">
        <h1 className="heading-main mb-8">WELCOME TO MY PORTFOLIO</h1>
        <p className="text-xl text-[var(--brand-accent)] mb-8">
          WINDOWS INTO MY PAST AND CURRENT PROJECTS
        </p>
        <div className="text-[var(--brand-fg)] opacity-70">
          SCROLL OR USE ARROW KEYS TO NAVIGATE
        </div>
      </div>
    </div>
  );
};
