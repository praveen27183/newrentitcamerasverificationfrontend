import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Package,
  Camera,
  IndianRupee,
  Users,
  TrendingUp,
  LogOut,
  Plus,
  List,
  Tag,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const NavItem = ({ icon: Icon, text, active, onClick, isSidebarOpen, children, path }) => {
  const hasChildren = React.Children.count(children) > 0;
  const [isExpanded, setIsExpanded] = useState(active);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-expand if child is active
  useEffect(() => {
    if (hasChildren && children.some(child => 
      location.pathname === child.path || 
      (child.path && location.pathname.startsWith(child.path))
    )) {
      setIsExpanded(true);
    }
  }, [location.pathname, children, hasChildren]);

  const handleClick = (e) => {
    e.preventDefault();
    if (hasChildren) {
      setIsExpanded(!isExpanded);
      // Don't navigate if it has children
      return;
    }
    
    if (onClick) {
      onClick(e);
    } else if (path) {
      navigate(path);
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 1024) {
        document.body.classList.remove('overflow-hidden');
        const event = new CustomEvent('sidebarToggle', { detail: { isOpen: false } });
        window.dispatchEvent(event);
      }
    }
  };

  return (
    <div className="mb-1">
      <a
        href={path || '#'}
        onClick={handleClick}
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
          active ? 'bg-[#1A97A9] text-white' : 'text-gray-700 hover:bg-[#1A97A9]/10'
        }`}
      >
        <div className="flex items-center">
          <Icon className="h-5 w-5" />
          {isSidebarOpen && <span className="ml-3 text-sm font-medium">{text}</span>}
        </div>
        {hasChildren && isSidebarOpen && (
          <span className="text-sm">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </span>
        )}
      </a>
      {hasChildren && isExpanded && isSidebarOpen && (
        <div className="mt-1 ml-8 space-y-1">{children}</div>
      )}
    </div>
  );
};

const SubNavItem = ({ icon: Icon, text, active, path, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path || 
                  (path !== '/admin/inventory' && location.pathname.startsWith(path));
  
  const handleClick = (e) => {
    e.preventDefault();
    if (onClick) {
      onClick(e);
    } else if (path) {
      navigate(path);
      // Close sidebar on mobile after navigation
      if (window.innerWidth < 1024) {
        document.body.classList.remove('overflow-hidden');
        const event = new CustomEvent('sidebarToggle', { detail: { isOpen: false } });
        window.dispatchEvent(event);
      }
    }
  };

  return (
    <a
      href={path || '#'}
      onClick={handleClick}
      className={`flex items-center p-2 rounded-lg cursor-pointer text-sm ${
        isActive ? 'bg-[#1A97A9]/20 text-[#1A97A9]' : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4 mr-2" />
      <span>{text}</span>
    </a>
  );
};

const Sidebar = ({ isOpen, activeTab, onTabChange, onLogout, categories = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const sidebarRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // Auto-close sidebar when resizing to mobile
      if (mobile && isOpen) {
        const event = new CustomEvent('sidebarToggle', { detail: { isOpen: false } });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !isOpen) return;
    
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onTabChange('toggle');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, onTabChange]);

  const menuItems = [
    { 
      icon: Package, 
      text: 'Dashboard', 
      tab: 'dashboard',
      path: '/admin/dashboard'
    },
    {
      icon: Camera,
      text: 'Inventory',
      tab: 'inventory',
      path: '/admin/inventory',
      children: [
        { 
          icon: Plus, 
          text: 'Add Product', 
          tab: 'add-product',
          path: '/admin/inventory/add-product'
        },
        { 
          icon: List, 
          text: 'View Products', 
          tab: 'view-products',
          path: '/admin/inventory/view'
        },
        { 
          icon: Tag, 
          text: 'Categories', 
          tab: 'categories',
          path: '/admin/inventory/categories'
        }
      ]
    },
    { 
      icon: IndianRupee, 
      text: 'Orders', 
      tab: 'orders',
      path: '/admin/orders'
    },
    { 
      icon: Users, 
      text: 'Customers', 
      tab: 'customers',
      path: '/admin/customers'
    },
    { 
      icon: TrendingUp, 
      text: 'Analytics', 
      tab: 'analytics',
      path: '/admin/analytics'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => onTabChange('toggle')}
          aria-hidden="true"
        />
      )}
      
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white text-black transition-all duration-300 ease-in-out z-50 ${
          isMobile 
            ? `${isOpen ? 'translate-x-0' : '-translate-x-full'} w-72 shadow-2xl`
            : `${isOpen ? 'w-64' : 'w-20'} shadow-md`
        }`}
        aria-label="Sidebar"
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 h-16">
          <button
            onClick={() => onTabChange('toggle')}
            className="p-1.5 rounded-lg hover:bg-[#1A97A9]/10 flex items-center focus:outline-none focus:ring-2 focus:ring-[#1A97A9] focus:ring-offset-2 focus:ring-offset-white"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <img 
              src="/src/asset/Rentit logo (1).png" 
              alt="Rentit Logo" 
              className={`h-8 w-auto ${!isOpen && isMobile ? 'mx-auto' : ''}`}
            />
            {isOpen && (
              <h2 className="ml-3 text-lg font-bold text-gray-900">Admin Panel</h2>
            )}
          </button>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={() => onTabChange('toggle')}
              className="lg:hidden p-2 -mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav 
          className={`px-2 overflow-y-auto ${isOpen ? 'h-[calc(100%-220px)]' : 'h-[calc(100%-120px)]'} overflow-x-hidden`}
          aria-label="Main navigation"
        >
          {menuItems.map(({ icon, text, tab, path, children }) => {
            const isActive = location.pathname === path || 
                           (path !== '/' && location.pathname.startsWith(path)) ||
                           children?.some(child => location.pathname === child.path);
            
            return (
              <NavItem
                key={tab}
                icon={icon}
                text={text}
                active={isActive}
                isSidebarOpen={isOpen}
                path={path}
              >
                {children?.map((child) => (
                  <SubNavItem
                    key={child.tab}
                    icon={child.icon}
                    text={child.text}
                    active={location.pathname === child.path}
                    path={child.path}
                  />
                ))}
              </NavItem>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-white">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-[#1A97A9]/10 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
