import React from 'react';

export const WelcomeCard: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center p-8">
      <div className="card-glass p-12 max-w-2xl text-center">
        <h1 className="heading-main mb-8">Welcome to my Portfolio</h1>
        <p className="text-xl text-[var(--brand-accent)] mb-8">
          Behind each window is a project
        </p>
        <div className="text-[var(--brand-fg)] opacity-70">
          Scroll or use arrow keys to navigate
        </div>
      </div>
    </div>
  );
};
