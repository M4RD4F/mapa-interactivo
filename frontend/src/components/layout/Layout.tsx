// frontend/src/components/Layout/layout.tsx
import React from 'react';
import Header from './Header';

interface LayoutProps {
  userRole: 'student' | 'professor' | null;
  onLogin: (role: 'student' | 'professor' | null) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ userRole, onLogin, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header userRole={userRole} onLogin={onLogin} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
