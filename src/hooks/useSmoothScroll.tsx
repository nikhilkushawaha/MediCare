
import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    // Save the original scroll behavior
    const originalStyle = window.getComputedStyle(document.documentElement).scrollBehavior;
    
    // Apply smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add click event listeners to all anchor links
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      const element = document.getElementById(href.substring(1));
      if (!element) return;
      
      e.preventDefault();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    
    document.addEventListener('click', handleLinkClick);
    
    // Cleanup function
    return () => {
      document.documentElement.style.scrollBehavior = originalStyle;
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);
}
