import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Settings, Mic } from 'lucide-react';
import { clsx } from 'clsx';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Plantillas', path: '/templates', icon: FileText },
    { label: 'Configuración', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Mic className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-slate-800">ClinicalDictate</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-100 text-xs text-slate-400">
          v1.0.0 (Offline Mode)
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        {/* Mobile Header */}
        <div className="md:hidden bg-white p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
          <span className="font-bold text-lg text-slate-800">ClinicalDictate</span>
          <div className="flex gap-4">
             {navItems.map(item => (
                 <Link key={item.path} to={item.path} className={clsx(location.pathname === item.path ? "text-primary" : "text-slate-500")}>
                    <item.icon size={24} />
                 </Link>
             ))}
          </div>
        </div>
        <div className="p-6 max-w-7xl mx-auto h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;