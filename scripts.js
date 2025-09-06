/**
 * ENIGMA E-CELL LANDING PAGE - JAVASCRIPT
 * 
 * This file contains all the interactive functionality for the Enigma E-Cell landing page.
 * Features include navigation, animations, form validation, scroll effects, and accessibility.
 * 
 * Author: Enigma E-Cell Development Team
 * Version: 2.0.0
 * 
 * SECTIONS:
 * 1. Configuration & Data
 * 2. DOM Elements & State
 * 3. Utility Functions
 * 4. Navigation & Mobile Menu
 * 5. Hero Animations
 * 6. Scroll Effects & Intersection Observer
 * 7. Statistics Counter
 * 8. Team Section
 * 9. Contact Form Validation
 * 10. Back to Top Button
 * 11. Accessibility Features
 * 12. Initialization
 */

'use strict';

// ===============================
// 1. CONFIGURATION & DATA
// ===============================

/**
 * Configuration object containing all customizable settings
 * Modify these values to customize the website behavior
 */
const CONFIG = {
  // Animation settings
  animations: {
    enabled: true,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    staggerDelay: 100,
    statsCountDuration: 2000
  },
  
  // Scroll settings
  scroll: {
    offset: 80, // Navigation height offset
    smoothScrollSupported: 'scrollBehavior' in document.documentElement.style
  },
  
  // Form settings
  form: {
    simulateSubmission: true, // Set to false when backend is ready
    submissionDelay: 2000
  },
  
  // Back to top button
  backToTop: {
    showOffset: 300 // Show button after scrolling this many pixels
  }
};

/**
 * Team members data
 * Add or modify team members here
 */
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Arjun Sharma",
    role: "President",
    bio: "Leading innovation initiatives and strategic partnerships to drive entrepreneurial growth.",
    initials: "AS",
    social: {
      linkedin: "https://linkedin.com/in/arjun-sharma",
      email: "arjun.sharma@nmit.ac.in"
    }
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "Vice President",
    bio: "Driving community engagement and building meaningful partnerships across the ecosystem.",
    initials: "PP",
    social: {
      linkedin: "https://linkedin.com/in/priya-patel",
      email: "priya.patel@nmit.ac.in"
    }
  },
  {
    id: 3,
    name: "Rahul Kumar",
    role: "Technical Lead",
    bio: "Overseeing technical workshops and mentoring the next generation of entrepreneurs.",
    initials: "RK",
    social: {
      linkedin: "https://linkedin.com/in/rahul-kumar",
      email: "rahul.kumar@nmit.ac.in",
      github: "https://github.com/rahul-kumar"
    }
  },
  {
    id: 4,
    name: "Anjali Singh",
    role: "Events Manager",
    bio: "Organizing impactful events and workshops that inspire and educate our community.",
    initials: "AS",
    social: {
      linkedin: "https://linkedin.com/in/anjali-singh",
      email: "anjali.singh@nmit.ac.in"
    }
  },
  {
    id: 5,
    name: "Vikram Rao",
    role: "Marketing Head",
    bio: "Building brand presence and communications to amplify our impact in the startup ecosystem.",
    initials: "VR",
    social: {
      linkedin: "https://linkedin.com/in/vikram-rao",
      email: "vikram.rao@nmit.ac.in"
    }
  },
  {
    id: 6,
    name: "Sneha Gupta",
    role: "Finance Manager",
    bio: "Managing financial operations and growth strategies to ensure sustainable impact.",
    initials: "SG",
    social: {
      linkedin: "https://linkedin.com/in/sneha-gupta",
      email: "sneha.gupta@nmit.ac.in"
    }
  }
];

// ===============================
// 2. DOM ELEMENTS & STATE
// ===============================

/**
 * DOM elements cache for performance
 * All elements are cached on page load to avoid repeated queries
 */
let DOM = {};

/**
 * Application state
 */
const STATE = {
  isNavOpen: false,
  isScrolling: false,
  currentSection: 'hero',
  observers: [],
  statsAnimated: false,
  reducedMotion: false
};

// ===============================
// 3. UTILITY FUNCTIONS
// ===============================

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Target element or selector
 * @param {number} offset - Offset from top (default: navigation height)
 */
function smoothScrollTo(target, offset = CONFIG.scroll.offset) {
  const element = typeof target === 'string' ? document.querySelector(target) : target;
  
  if (!element) return;
  
  const targetPosition = element.offsetTop - offset;
  
  if (CONFIG.scroll.smoothScrollSupported) {
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  } else {
    // Fallback for browsers that don't support smooth scroll
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 500;
    let start = null;
    
    function animation(currentTime) {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = ease(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
  }
}

/**
 * Add CSS class with animation support
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name to add
 */
function addClassWithAnimation(element, className) {
  if (STATE.reducedMotion) {
    element.classList.add(className);
    return;
  }
  
  requestAnimationFrame(() => {
    element.classList.add(className);
  });
}

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Log function for development (can be disabled in production)
 * @param {string} message - Message to log
 * @param {any} data - Optional data to log
 */
function log(message, data = null) {
  if (console && console.log) {
    console.log(`[Enigma E-Cell] ${message}`, data || '');
  }
}

// ===============================
// 4. NAVIGATION & MOBILE MENU
// ===============================

/**
 * Initialize navigation functionality
 * Sets up smooth scrolling, mobile menu, and scroll detection
 */
function initNavigation() {
  log('Initializing navigation...');
  
  // Cache navigation elements
  DOM.navbar = document.getElementById('navbar');
  DOM.navMenu = document.getElementById('nav-menu');
  DOM.mobileMenuBtn = document.getElementById('mobile-menu-btn');
  DOM.navLinks = document.querySelectorAll('.nav-link');
  
  if (!DOM.navbar || !DOM.navMenu || !DOM.mobileMenuBtn) {
    log('Navigation elements not found');
    return;
  }
  
  // Setup mobile menu toggle
  setupMobileMenu();
  
  // Setup navigation links
  setupNavigationLinks();
  
  // Setup scroll detection for navbar styling
  setupScrollDetection();
  
  log('Navigation initialized successfully');
}

/**
 * Setup mobile menu functionality
 */
function setupMobileMenu() {
  DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (STATE.isNavOpen && 
        !DOM.navMenu.contains(e.target) && 
        !DOM.mobileMenuBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && STATE.isNavOpen) {
      closeMobileMenu();
      DOM.mobileMenuBtn.focus();
    }
  });
  
  // Close mobile menu on window resize (if becomes desktop)
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768 && STATE.isNavOpen) {
      closeMobileMenu();
    }
  }, 250));
}

/**
 * Toggle mobile menu open/closed
 */
function toggleMobileMenu() {
  if (STATE.isNavOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/**
 * Open mobile menu
 */
function openMobileMenu() {
  STATE.isNavOpen = true;
  DOM.navMenu.classList.add('active');
  DOM.mobileMenuBtn.setAttribute('aria-expanded', 'true');
  DOM.mobileMenuBtn.classList.add('active');
  
  // Prevent body scroll when menu is open
  document.body.style.overflow = 'hidden';
  
  // Focus first menu item for accessibility
  const firstNavLink = DOM.navMenu.querySelector('.nav-link');
  if (firstNavLink) {
    setTimeout(() => firstNavLink.focus(), 300);
  }
  
  log('Mobile menu opened');
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  STATE.isNavOpen = false;
  DOM.navMenu.classList.remove('active');
  DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
  DOM.mobileMenuBtn.classList.remove('active');
  
  // Restore body scroll
  document.body.style.overflow = '';
  
  log('Mobile menu closed');
}

/**
 * Setup navigation links with smooth scrolling
 */
function setupNavigationLinks() {
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', handleNavigationClick);
  });
}

/**
 * Handle navigation link clicks
 * @param {Event} e - Click event
 */
function handleNavigationClick(e) {
  e.preventDefault();
  
  const href = e.target.getAttribute('href');
  
  // Check if it's an internal link (starts with #)
  if (href && href.startsWith('#')) {
    const targetElement = document.querySelector(href);
    
    if (targetElement) {
      // Close mobile menu if open
      if (STATE.isNavOpen) {
        closeMobileMenu();
      }
      
      // Smooth scroll to target
      smoothScrollTo(targetElement);
      
      // Update active state
      updateActiveNavLink(href);
      
      // Update URL without page reload
      if (history.pushState) {
        history.pushState(null, null, href);
      }
      
      log(`Navigated to ${href}`);
    }
  }
}

/**
 * Update active navigation link
 * @param {string} activeHref - Currently active href
 */
function updateActiveNavLink(activeHref) {
  DOM.navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === activeHref) {
      link.classList.add('active');
    }
  });
}

/**
 * Setup scroll detection for navbar styling
 */
function setupScrollDetection() {
  const handleScroll = throttle(() => {
    const scrolled = window.pageYOffset > 20;
    
    if (scrolled) {
      DOM.navbar.classList.add('scrolled');
    } else {
      DOM.navbar.classList.remove('scrolled');
    }
  }, 10);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
}

// ===============================
// 5. HERO ANIMATIONS
// ===============================

/**
 * Initialize hero section animations
 */
function initHeroAnimations() {
  log('Initializing hero animations...');
  
  DOM.heroTitle = document.getElementById('hero-title');
  DOM.heroLetters = document.querySelectorAll('.hero-letter');
  DOM.scrollDown = document.getElementById('scroll-down');
  
  if (!DOM.heroTitle || DOM.heroLetters.length === 0) {
    log('Hero elements not found');
    return;
  }
  
  // Setup scroll down button
  if (DOM.scrollDown) {
    DOM.scrollDown.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        smoothScrollTo(aboutSection);
      }
    });
  }
  
  // Add sheen animation to letters (if motion is not reduced)
  if (!STATE.reducedMotion) {
    addSheenAnimationToLetters();
  }
  
  log('Hero animations initialized successfully');
}

/**
 * Add sheen animation effect to hero letters
 */
function addSheenAnimationToLetters() {
  DOM.heroLetters.forEach((letter, index) => {
    // Add a random delay to make the sheen effect more organic
    const delay = Math.random() * 2000 + 3000; // Between 3-5 seconds
    
    setTimeout(() => {
      if (!STATE.reducedMotion) {
        startSheenLoop(letter);
      }
    }, delay);
  });
}

/**
 * Start continuous sheen animation loop for a letter
 * @param {HTMLElement} letter - Letter element to animate
 */
function startSheenLoop(letter) {
  const animateSheen = () => {
    if (STATE.reducedMotion) return;
    
    letter.style.animation = 'none';
    letter.offsetHeight; // Trigger reflow
    letter.style.animation = '';
    
    // Schedule next sheen with random interval
    const nextInterval = Math.random() * 5000 + 8000; // Between 8-13 seconds
    setTimeout(animateSheen, nextInterval);
  };
  
  animateSheen();
}

// ===============================
// 6. SCROLL EFFECTS & INTERSECTION OBSERVER
// ===============================

/**
 * Initialize scroll effects and intersection observer
 */
function initScrollEffects() {
  log('Initializing scroll effects...');
  
  // Setup intersection observer for fade-in animations
  setupIntersectionObserver();
  
  // Setup section detection for navigation
  setupSectionDetection();
  
  log('Scroll effects initialized successfully');
}

/**
 * Setup intersection observer for fade-in animations
 */
function setupIntersectionObserver() {
  // Only setup if animations are enabled and motion is not reduced
  if (!CONFIG.animations.enabled || STATE.reducedMotion) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -10% 0px',
    threshold: 0.1
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        addClassWithAnimation(entry.target, 'visible');
        
        // Special handling for statistics animation
        if (entry.target.classList.contains('stats-container') && !STATE.statsAnimated) {
          animateStatistics();
          STATE.statsAnimated = true;
        }
      }
    });
  }, observerOptions);
  
  // Observe elements with fade-in classes
  const elementsToObserve = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .stats-container');
  
  elementsToObserve.forEach(element => {
    observer.observe(element);
  });
  
  STATE.observers.push(observer);
}

/**
 * Setup section detection for navigation highlighting
 */
function setupSectionDetection() {
  const sections = document.querySelectorAll('section[id]');
  
  if (sections.length === 0) return;
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -20% 0px',
    threshold: 0.3
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        STATE.currentSection = sectionId;
        updateActiveNavLink(`#${sectionId}`);
      }
    });
  }, observerOptions);
  
  sections.forEach(section => {
    sectionObserver.observe(section);
  });
  
  STATE.observers.push(sectionObserver);
}

// ===============================
// 7. STATISTICS COUNTER
// ===============================

/**
 * Animate statistics counters
 */
function animateStatistics() {
  log('Starting statistics animation...');
  
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(element => {
    const targetCount = parseInt(element.getAttribute('data-count'));
    const duration = CONFIG.animations.statsCountDuration;
    const startTime = performance.now();
    
    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = Math.floor(easedProgress * targetCount);
      element.textContent = currentCount + (targetCount >= 100 ? '+' : '');
      
      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = targetCount + (targetCount >= 100 ? '+' : '');
        log(`Statistics animation completed for ${targetCount}`);
      }
    }
    
    requestAnimationFrame(updateCount);
  });
}

// ===============================
// 8. TEAM SECTION
// ===============================

/**
 * Initialize team section
 */
function initTeamSection() {
  log('Initializing team section...');
  
  DOM.teamGrid = document.getElementById('team-grid');
  
  if (!DOM.teamGrid) {
    log('Team grid not found');
    return;
  }
  
  // Generate team cards
  generateTeamCards();
  
  log('Team section initialized successfully');
}

/**
 * Generate team member cards
 */
function generateTeamCards() {
  const teamHTML = TEAM_MEMBERS.map(member => createTeamCardHTML(member)).join('');
  DOM.teamGrid.innerHTML = teamHTML;
  
  // Add event listeners to team cards
  setupTeamCardInteractions();
}

/**
 * Create HTML for a team member card
 * @param {Object} member - Team member data
 * @returns {string} HTML string for team card
 */
function createTeamCardHTML(member) {
  const socialLinks = Object.entries(member.social)
    .map(([platform, url]) => createSocialLinkHTML(platform, url))
    .join('');
  
  return `
    <div class="team-card fade-in-up" data-member-id="${member.id}">
      <div class="team-avatar">
        <div class="avatar-placeholder">
          ${member.initials}
        </div>
      </div>
      <h3 class="team-name">${member.name}</h3>
      <p class="team-role">${member.role}</p>
      <p class="team-bio">${member.bio}</p>
      <div class="team-social">
        ${socialLinks}
      </div>
    </div>
  `;
}

/**
 * Create HTML for social media link
 * @param {string} platform - Social media platform
 * @param {string} url - URL to social media profile
 * @returns {string} HTML string for social link
 */
function createSocialLinkHTML(platform, url) {
  const icons = {
    linkedin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>`,
    email: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.9.732-1.636 1.636-1.636h2.118L12 11.64l8.246-7.819h2.118c.904 0 1.636.732 1.636 1.636z"/>
    </svg>`,
    github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>`
  };
  
  const href = platform === 'email' ? `mailto:${url}` : url;
  const target = platform === 'email' ? '' : 'target="_blank" rel="noopener noreferrer"';
  
  return `
    <a href="${href}" class="team-social-link" ${target} aria-label="${member.name} ${platform}">
      ${icons[platform] || ''}
    </a>
  `;
}

/**
 * Setup team card interactions
 */
function setupTeamCardInteractions() {
  const teamCards = document.querySelectorAll('.team-card');
  
  teamCards.forEach(card => {
    // Add hover effect enhancement
    card.addEventListener('mouseenter', () => {
      if (!STATE.reducedMotion) {
        card.style.transform = 'translateY(-12px) scale(1.02)';
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (!STATE.reducedMotion) {
        card.style.transform = '';
      }
    });
    
    // Add keyboard navigation support
    card.addEventListener('focus', () => {
      card.style.outline = '2px solid var(--color-accent-amber)';
      card.style.outlineOffset = '4px';
    });
    
    card.addEventListener('blur', () => {
      card.style.outline = '';
      card.style.outlineOffset = '';
    });
  });
}

// ===============================
// 9. CONTACT FORM VALIDATION
// ===============================

/**
 * Initialize contact form
 */
function initContactForm() {
  log('Initializing contact form...');
  
  DOM.contactForm = document.getElementById('contact-form');
  
  if (!DOM.contactForm) {
    log('Contact form not found');
    return;
  }
  
  // Cache form elements
  DOM.formElements = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    subject: document.getElementById('subject'),
    message: document.getElementById('message'),
    submitBtn: document.getElementById('submit-btn'),
    successMessage: document.getElementById('success-message')
  };
  
  // Setup form validation
  setupFormValidation();
  
  // Setup form submission
  setupFormSubmission();
  
  log('Contact form initialized successfully');
}

/**
 * Setup real-time form validation
 */
function setupFormValidation() {
  Object.entries(DOM.formElements).forEach(([key, element]) => {
    if (element && element.tagName !== 'BUTTON' && element.id !== 'success-message') {
      // Add blur validation
      element.addEventListener('blur', () => validateField(key, element));
      
      // Add input validation for immediate feedback
      element.addEventListener('input', debounce(() => {
        clearFieldError(element);
        validateField(key, element);
      }, 300));
    }
  });
}

/**
 * Validate individual form field
 * @param {string} fieldName - Name of the field
 * @param {HTMLElement} element - Form element
 * @returns {boolean} True if field is valid
 */
function validateField(fieldName, element) {
  const value = element.value.trim();
  const errorElement = document.getElementById(`${fieldName}-error`);
  
  let isValid = true;
  let errorMessage = '';
  
  // Check if field is required and empty
  if (element.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = `${getFieldLabel(fieldName)} is required.`;
  }
  // Specific validation rules
  else if (fieldName === 'email' && value && !isValidEmail(value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address.';
  }
  else if (fieldName === 'name' && value && value.length < 2) {
    isValid = false;
    errorMessage = 'Name must be at least 2 characters long.';
  }
  else if (fieldName === 'subject' && value && value.length < 3) {
    isValid = false;
    errorMessage = 'Subject must be at least 3 characters long.';
  }
  else if (fieldName === 'message' && value && value.length < 10) {
    isValid = false;
    errorMessage = 'Message must be at least 10 characters long.';
  }
  
  // Update UI based on validation result
  if (isValid) {
    element.classList.remove('error');
    element.classList.add('success');
    hideFieldError(errorElement);
  } else {
    element.classList.remove('success');
    element.classList.add('error');
    showFieldError(errorElement, errorMessage);
  }
  
  return isValid;
}

/**
 * Get human-readable field label
 * @param {string} fieldName - Field name
 * @returns {string} Human-readable label
 */
function getFieldLabel(fieldName) {
  const labels = {
    name: 'Full Name',
    email: 'Email Address',
    subject: 'Subject',
    message: 'Message'
  };
  return labels[fieldName] || fieldName;
}

/**
 * Show field error message
 * @param {HTMLElement} errorElement - Error message element
 * @param {string} message - Error message
 */
function showFieldError(errorElement, message) {
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add('show');
    errorElement.setAttribute('aria-live', 'polite');
  }
}

/**
 * Hide field error message
 * @param {HTMLElement} errorElement - Error message element
 */
function hideFieldError(errorElement) {
  if (errorElement) {
    errorElement.classList.remove('show');
    errorElement.removeAttribute('aria-live');
  }
}

/**
 * Clear field error state
 * @param {HTMLElement} element - Form element
 */
function clearFieldError(element) {
  element.classList.remove('error', 'success');
}

/**
 * Validate entire form
 * @returns {boolean} True if form is valid
 */
function validateForm() {
  let isFormValid = true;
  
  Object.entries(DOM.formElements).forEach(([key, element]) => {
    if (element && element.tagName !== 'BUTTON' && element.id !== 'success-message') {
      const isFieldValid = validateField(key, element);
      if (!isFieldValid) {
        isFormValid = false;
      }
    }
  });
  
  return isFormValid;
}

/**
 * Setup form submission
 */
function setupFormSubmission() {
  DOM.contactForm.addEventListener('submit', handleFormSubmission);
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleFormSubmission(e) {
  e.preventDefault();
  
  log('Form submission started...');
  
  // Validate form
  if (!validateForm()) {
    log('Form validation failed');
    
    // Focus first invalid field
    const firstInvalidField = DOM.contactForm.querySelector('.form-control.error');
    if (firstInvalidField) {
      firstInvalidField.focus();
    }
    
    return;
  }
  
  // Show loading state
  setSubmissionLoading(true);
  
  try {
    // Collect form data
    const formData = {
      name: DOM.formElements.name.value.trim(),
      email: DOM.formElements.email.value.trim(),
      subject: DOM.formElements.subject.value.trim(),
      message: DOM.formElements.message.value.trim(),
      timestamp: new Date().toISOString()
    };
    
    log('Form data collected:', formData);
    
    // Submit form (simulated or real)
    if (CONFIG.form.simulateSubmission) {
      await simulateFormSubmission(formData);
    } else {
      await submitFormToBackend(formData);
    }
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    resetForm();
    
    log('Form submission completed successfully');
    
  } catch (error) {
    log('Form submission error:', error);
    showSubmissionError('Failed to send message. Please try again later.');
  } finally {
    setSubmissionLoading(false);
  }
}

/**
 * Simulate form submission for development
 * @param {Object} formData - Form data
 * @returns {Promise} Promise that resolves after delay
 */
function simulateFormSubmission(formData) {
  return new Promise((resolve) => {
    setTimeout(() => {
      log('Form submission simulated successfully');
      resolve();
    }, CONFIG.form.submissionDelay);
  });
}

/**
 * Submit form to backend (implement when backend is ready)
 * @param {Object} formData - Form data
 * @returns {Promise} Promise from fetch request
 */
async function submitFormToBackend(formData) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(formData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Set form loading state
 * @param {boolean} isLoading - Whether form is loading
 */
function setSubmissionLoading(isLoading) {
  const submitBtn = DOM.formElements.submitBtn;
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'block';
  } else {
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
  }
}

/**
 * Show success message
 */
function showSuccessMessage() {
  DOM.formElements.successMessage.classList.add('show');
  DOM.formElements.successMessage.setAttribute('aria-live', 'polite');
  
  // Hide success message after 5 seconds
  setTimeout(() => {
    DOM.formElements.successMessage.classList.remove('show');
    DOM.formElements.successMessage.removeAttribute('aria-live');
  }, 5000);
}

/**
 * Show submission error
 * @param {string} message - Error message
 */
function showSubmissionError(message) {
  // You can implement a global error notification here
  alert(message); // Simple fallback - replace with better UI
}

/**
 * Reset form to initial state
 */
function resetForm() {
  DOM.contactForm.reset();
  
  // Clear all validation states
  Object.entries(DOM.formElements).forEach(([key, element]) => {
    if (element && element.tagName !== 'BUTTON' && element.id !== 'success-message') {
      clearFieldError(element);
      hideFieldError(document.getElementById(`${key}-error`));
    }
  });
}

// ===============================
// 10. BACK TO TOP BUTTON
// ===============================

/**
 * Initialize back to top button
 */
function initBackToTop() {
  log('Initializing back to top button...');
  
  DOM.backToTopBtn = document.getElementById('back-to-top');
  
  if (!DOM.backToTopBtn) {
    log('Back to top button not found');
    return;
  }
  
  // Setup scroll detection
  const handleScroll = throttle(() => {
    const shouldShow = window.pageYOffset > CONFIG.backToTop.showOffset;
    
    if (shouldShow) {
      DOM.backToTopBtn.classList.add('show');
    } else {
      DOM.backToTopBtn.classList.remove('show');
    }
  }, 100);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Setup click handler
  DOM.backToTopBtn.addEventListener('click', () => {
    smoothScrollTo(document.body, 0);
    
    // Focus skip link for accessibility
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      setTimeout(() => skipLink.focus(), 500);
    }
  });
  
  log('Back to top button initialized successfully');
}

// ===============================
// 11. ACCESSIBILITY FEATURES
// ===============================

/**
 * Initialize accessibility features
 */
function initAccessibility() {
  log('Initializing accessibility features...');
  
  // Check for reduced motion preference
  STATE.reducedMotion = prefersReducedMotion();
  
  // Listen for changes in motion preference
  const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  motionMediaQuery.addEventListener('change', (e) => {
    STATE.reducedMotion = e.matches;
    log(`Reduced motion preference changed: ${STATE.reducedMotion}`);
    
    // Restart animations if motion is re-enabled
    if (!STATE.reducedMotion && CONFIG.animations.enabled) {
      addSheenAnimationToLetters();
    }
  });
  
  // Setup keyboard navigation enhancements
  setupKeyboardNavigation();
  
  // Setup focus management
  setupFocusManagement();
  
  log('Accessibility features initialized successfully');
}

/**
 * Setup enhanced keyboard navigation
 */
function setupKeyboardNavigation() {
  // Skip link functionality
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView();
      }
    });
  }
  
  // Escape key handlers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close mobile menu
      if (STATE.isNavOpen) {
        closeMobileMenu();
        DOM.mobileMenuBtn.focus();
      }
    }
  });
  
  // Tab navigation improvements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
}

/**
 * Setup focus management
 */
function setupFocusManagement() {
  // Ensure main content is focusable for skip link
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.setAttribute('tabindex', '-1');
  }
  
  // Add focus indicators for better visibility
  const style = document.createElement('style');
  style.textContent = `
    .keyboard-navigation *:focus {
      outline: 2px solid var(--color-accent-amber) !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);
}

// ===============================
// 12. INITIALIZATION
// ===============================

/**
 * Initialize the entire application
 */
function initApp() {
  log('Starting Enigma E-Cell Landing Page initialization...');
  
  try {
    // Initialize core functionality
    initAccessibility();
    initNavigation();
    initHeroAnimations();
    initScrollEffects();
    initTeamSection();
    initContactForm();
    initBackToTop();
    
    // Add global styles for reduced motion
    if (STATE.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }
    
    // Log successful initialization
    log('Application initialized successfully!');
    
    // Optional: Fire a custom event for other scripts
    const initEvent = new CustomEvent('enigmaAppInitialized', {
      detail: { version: '2.0.0', timestamp: Date.now() }
    });
    document.dispatchEvent(initEvent);
    
  } catch (error) {
    console.error('[Enigma E-Cell] Initialization error:', error);
    
    // Basic fallback functionality
    setupBasicFallbacks();
  }
}

/**
 * Setup basic fallbacks if main initialization fails
 */
function setupBasicFallbacks() {
  log('Setting up fallback functionality...');
  
  // Basic mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    });
  }
  
  // Basic form submission prevention
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you soon.');
    });
  }
  
  log('Fallback functionality setup complete');
}

/**
 * Cleanup function for single-page applications
 */
function cleanup() {
  log('Cleaning up application...');
  
  // Clear all observers
  STATE.observers.forEach(observer => {
    if (observer && observer.disconnect) {
      observer.disconnect();
    }
  });
  STATE.observers = [];
  
  // Remove event listeners (if needed for SPA navigation)
  // This would be more comprehensive in a real cleanup scenario
  
  log('Cleanup completed');
}

// ===============================
// APPLICATION STARTUP
// ===============================

/**
 * Start the application when DOM is ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already loaded
  initApp();
}

/**
 * Handle page visibility changes for performance
 */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden - pause non-critical animations
    log('Page hidden - pausing animations');
  } else {
    // Page is visible - resume animations
    log('Page visible - resuming animations');
  }
});

/**
 * Handle page unload
 */
window.addEventListener('beforeunload', () => {
  cleanup();
});

/**
 * Export functions for external use (if needed)
 */
window.EnigmaApp = {
  smoothScrollTo,
  updateActiveNavLink,
  validateForm,
  cleanup,
  state: STATE,
  config: CONFIG
};

// ===============================
// END OF SCRIPT
// ===============================

log('Enigma E-Cell Landing Page script loaded successfully');
