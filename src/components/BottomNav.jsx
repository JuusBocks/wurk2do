export const BottomNav = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'week', icon: '📋', label: 'Week' },
    { id: 'calendar', icon: '📅', label: 'Calendar' },
    { id: 'summary', icon: '📊', label: 'Summary' },
  ];

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-dark-surface/80 backdrop-blur-2xl border-t border-white/10 z-50"
      style={{ 
        paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-center justify-around px-4 pt-2">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                flex flex-col items-center gap-1 py-2 px-6 rounded-xl
                transition-all duration-300 touch-manipulation relative
                ${isActive 
                  ? 'text-blue-400 scale-105' 
                  : 'text-gray-500 hover:text-gray-300 active:scale-95'
                }
              `}
            >
              {/* Glow effect for active tab */}
              {isActive && (
                <div 
                  className="absolute inset-0 bg-blue-500/10 rounded-xl blur-sm"
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                  }}
                />
              )}
              
              {/* Icon */}
              <span className={`text-2xl relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
              
              {/* Label */}
              <span className={`text-xs font-medium relative z-10 ${isActive ? 'font-semibold' : ''}`}>
                {item.label}
              </span>
              
              {/* Active indicator dot */}
              {isActive && (
                <div 
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"
                  style={{
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
