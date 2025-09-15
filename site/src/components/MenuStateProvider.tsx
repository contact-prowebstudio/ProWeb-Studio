'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo, useRef } from 'react';

interface MenuStateContextType {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

const MenuStateContext = createContext<MenuStateContextType | undefined>(undefined);

interface MenuStateProviderProps {
  children: ReactNode;
}

export function MenuStateProvider({ children }: MenuStateProviderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Refs for scroll lock management (StrictMode safe)
  const originalScrollTopRef = useRef<number>(0);
  const scrollLockAppliedRef = useRef<boolean>(false);
  
  // Runtime assertion for excessive setter calls
  const setterCallCountRef = useRef<number>(0);
  const lastResetTimeRef = useRef<number>(0);
  
  // Wrap setState with assertion
  const setIsMenuOpenWithAssertion = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    const now = performance.now();
    
    // Reset counter every 100ms
    if (now - lastResetTimeRef.current > 100) {
      setterCallCountRef.current = 0;
      lastResetTimeRef.current = now;
    }
    
    setterCallCountRef.current++;
    
    // Warn if called more than 10 times in the same tick
    if (setterCallCountRef.current > 10) {
      console.warn('MenuStateProvider: setIsMenuOpen called more than 10 times within 100ms - potential infinite loop');
    }
    
    setIsMenuOpen(value);
  }, []);

  // Memoized callbacks
  const openMenu = useCallback(() => setIsMenuOpenWithAssertion(true), [setIsMenuOpenWithAssertion]);
  const closeMenu = useCallback(() => setIsMenuOpenWithAssertion(false), [setIsMenuOpenWithAssertion]);
  const toggleMenu = useCallback(() => setIsMenuOpenWithAssertion(prev => !prev), [setIsMenuOpenWithAssertion]);

  // Global scroll lock effect - only depends on isMenuOpen
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const scrollElement = document.scrollingElement || document.documentElement;

    if (isMenuOpen && !scrollLockAppliedRef.current) {
      // Store current scroll position in ref (not state)
      originalScrollTopRef.current = scrollElement.scrollTop;
      
      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Apply scroll lock
      html.style.overflow = 'hidden';
      html.style.overscrollBehavior = 'none';
      html.style.touchAction = 'none';
      
      body.style.overflow = 'hidden';
      body.style.overscrollBehavior = 'none';
      body.style.touchAction = 'none';
      
      // Compensate for scrollbar width to prevent layout shift
      if (scrollbarWidth > 0) {
        html.style.paddingRight = `${scrollbarWidth}px`;
        body.style.paddingRight = `${scrollbarWidth}px`;
      }

      // Set inert on main content
      const main = document.getElementById('main');
      if (main) {
        main.setAttribute('inert', '');
        main.setAttribute('aria-hidden', 'true');
      }
      
      scrollLockAppliedRef.current = true;
    } else if (!isMenuOpen && scrollLockAppliedRef.current) {
      // Restore styles
      html.style.overflow = '';
      html.style.overscrollBehavior = '';
      html.style.touchAction = '';
      html.style.paddingRight = '';

      body.style.overflow = '';
      body.style.overscrollBehavior = '';
      body.style.touchAction = '';
      body.style.paddingRight = '';

      // Restore scroll position
      scrollElement.scrollTop = originalScrollTopRef.current;

      // Remove inert from main content
      const main = document.getElementById('main');
      if (main) {
        main.removeAttribute('inert');
        main.removeAttribute('aria-hidden');
      }
      
      scrollLockAppliedRef.current = false;
    }
  }, [isMenuOpen]);

  // Stable route change handler - defined at component level
  const handleRouteChange = useCallback(() => {
    // Only close if menu is currently open (check DOM or use a ref)
    setIsMenuOpenWithAssertion(false);
  }, [setIsMenuOpenWithAssertion]);

  // Close menu on route changes - stable handler with [] deps
  useEffect(() => {
    // Listen for popstate (back/forward navigation)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [handleRouteChange]); // Include the stable handler in deps

  // Memoized context value
  const value = useMemo(() => ({
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  }), [isMenuOpen, openMenu, closeMenu, toggleMenu]);

  return (
    <MenuStateContext.Provider value={value}>
      {children}
    </MenuStateContext.Provider>
  );
}

export function useMenuState() {
  const context = useContext(MenuStateContext);
  if (context === undefined) {
    throw new Error('useMenuState must be used within a MenuStateProvider');
  }
  return context;
}

export default MenuStateProvider;