/**
 * ENIGMA E-CELL LANDING PAGE - JAVASCRIPT
 * Enhanced with Multilingual Animation and Accessibility Features
 * 
 * This file contains all the interactive functionality for the Enigma E-Cell landing page.
 * Features include navigation, animations, form validation, scroll effects, and multilingual text switching.
 */

'use strict';

// ===============================
// MULTILINGUAL ANIMATION CONFIG
// ===============================

/* ADDED: Configuration constants for multilingual animation - easily adjustable */
const ANIMATION_INTERVAL = 3000; // Time in milliseconds between language changes (3 seconds)
const FADE_DURATION = 800; // Duration of fade animation in milliseconds
const LANGUAGES = [
  { text: 'ENIGMA', lang: 'en', label: 'English' }, // English - starting language
  { text: 'एनिग्मा', lang: 'hi', label: 'Hindi' }, // Hindi transliteration
  { text: 'ಎನಿಗ್ಮಾ', lang: 'kn', label: 'Kannada' }, // Kannada transliteration
  { text: 'एनिग्मा', lang: 'mr', label: 'Marathi' }, // Marathi transliteration
  { text: 'એનિગ્મા', lang: 'gu', label: 'Gujarati' }, // Gujarati transliteration
  { text: 'এনিগ্মা', lang: 'bn', label: 'Bengali' } // Bengali transliteration
];

// State management for multilingual animation
let currentLanguageIndex = 0;
let animationInterval = null;
let prefersReducedMotion = false;

// ===============================
// EXISTING CONFIGURATION & DATA
// ===============================

const CONFIG = {
  animations: {
    enabled: true,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    staggerDelay: 100,
    statsCountDuration: 2000
  },
  
  scroll: {
    offset: 80,
    smoothScrollSupported: 'scrollBehavior' in document.documentElement.style
  },
  
  form: {
    simulateSubmission: true,
    submissionDelay: 2000
  },
  
  backToTop: {
    showOffset: 300
  }
};

const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Ayush Sikriwal",
    role: "Strategist and Analyst",
    bio: "Leading strategic initiatives and market analysis to drive entrepreneurial growth and innovation.",
    initials: "AS",
    social: {
      linkedin: "https://linkedin.com/in/ayush-sikriwal",
      email: "ayush.sikriwal@nmit.ac.in"
    }
  },
  {
    id: 2,
    name: "Arnav Kumar",
    role: "Tech Lead",
    bio: "Overseeing technical development and digital innovation to support our entrepreneurial ecosystem.",
    initials: "AK",
    social: {
      linkedin: "https://linkedin.com/in/arnav-kumar",
      email: "arnav.kumar@nmit.ac.in"
    }
  },
  {
    id: 3,
    name: "Akshita Sohaney",
    role: "Marketing",
    bio: "Building brand presence and community engagement to amplify our impact in the startup ecosystem.",
    initials: "AS",
    social: {
      linkedin: "https://linkedin.com/in/akshita-sohaney",
      email: "akshita.sohaney@nmit.ac.in"
    }
  }
];

// DOM elements cache for performance
let DOM = {};

const STATE = {
  isNavOpen: false,
  isScrolling: false,
  currentSection: 'hero',
  observers: [],
  statsAnimated: false,
  reducedMotion: false
};

// ===============================
// MULTILINGUAL ANIMATION SYSTEM
// ===============================

/**
 * ADDED: Initialize multilingual text switching animation
 * This function sets up the hero text to cycle through different languages
 * with smooth fade transitions and accessibility support
 */
function initMultilingualAnimation() {
  // Check for reduced motion preference for accessibility
  prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Get the hero text element
  const heroTextElement = document.getElementById('hero-text');
  if (!heroTextElement) {
    console.warn('Hero text element not found for multilingual animation');
    return;
  }
  
  // Set up accessibility attributes
  heroTextElement.setAttribute('aria-live', 'polite'); // Screen reader friendly updates
  heroTextElement.setAttribute('aria-label', 'Company name in multiple languages');
  
  // If reduced motion is preferred, keep static text and exit
  if (prefersReducedMotion) {
    heroTextElement.textContent = LANGUAGES[0].text; // Keep as "ENIGMA"
    heroTextElement.setAttribute('lang', LANGUAGES[0].lang);
    console.log('Reduced motion detected - multilingual animation disabled');
    return;
  }
  
  // Start the animation cycle
  startLanguageCycle(heroTextElement);
  
  console.log('Multilingual animation initialized');
}

/**
 * ADDED: Start the language cycling animation
 * @param {HTMLElement} element - The text element to animate
 */
function startLanguageCycle(element) {
  // Set initial language
  updateLanguageText(element, currentLanguageIndex);
  
  // Create interval for language switching
  animationInterval = setInterval(() => {
    // Move to next language in cycle
    currentLanguageIndex = (currentLanguageIndex + 1) % LANGUAGES.length;
    
    // Animate the text change with smooth transition
    animateLanguageChange(element, currentLanguageIndex);
  }, ANIMATION_INTERVAL);
}

/**
 * ADDED: Animate language change with fade effect
 * @param {HTMLElement} element - The text element to animate
 * @param {number} languageIndex - Index of the new language
 */
function animateLanguageChange(element, languageIndex) {
  // Add fade-out class for smooth transition
  element.classList.add('fade-out');
  
  // After fade-out completes, change text and fade back in
  setTimeout(() => {
    updateLanguageText(element, languageIndex);
    
    // Remove fade-out and add fade-in
    element.classList.remove('fade-out');
    element.classList.add('fade-in');
    
    // Clean up fade-in class after animation
    setTimeout(() => {
      element.classList.remove('fade-in');
    }, FADE_DURATION);
    
  }, FADE_DURATION / 2); // Change text at halfway point of fade
}

/**
 * ADDED: Update the text content and language attributes
 * @param {HTMLElement} element - The text element to update
 * @param {number} languageIndex - Index of the language to display
 */
function updateLanguageText(element, languageIndex) {
  const language = LANGUAGES[languageIndex];
  
  // Update text content
  element.textContent = language.text;
  
  // Update language attribute for better accessibility and font rendering
  element.setAttribute('lang', language.lang);
  
  // Update aria-label for screen readers
  element.setAttribute('aria-label', `${language.label}: ${language.text}`);
  
  // Log for debugging
  console.log(`Language changed to: ${language.label} (${language.text})`);
}

/**
 * ADDED: Stop multilingual animation (useful for cleanup)
 */
function stopMultilingualAnimation() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
}

/**
 * ADDED: Handle reduced motion preference changes
 * Listen for changes in motion preferences and adjust animation accordingly
 */
function handleMotionPreferenceChange() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  mediaQuery.addListener((e) => {
    prefersReducedMotion = e.matches;
    
    const heroTextElement = document.getElementById('hero-text');
    if (!heroTextElement) return;
    
    if (prefersReducedMotion) {
      // Stop animation and reset to English
      stopMultilingualAnimation();
      heroTextElement.textContent = LANGUAGES[0].text;
      heroTextElement.setAttribute('lang', LANGUAGES[0].lang);
      heroTextElement.classList.remove('fade-out', 'fade-in');
    } else {
      // Restart animation if motion is now allowed
      initMultilingualAnimation();
    }
  });
}

// ===============================
// EXISTING UTILITY FUNCTIONS
// ===============================

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

function prefersReducedMotionCheck() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

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

function addClassWithAnimation(element, className) {
  if (STATE.reducedMotion) {
    element.classList.add(className);
    return;
  }
  
  requestAnimationFrame(() => {
    element.classList.add(className);
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function log(message, data = null) {
  if (console && console.log) {
    console.log(`[Enigma E-Cell] ${message}`, data || '');
  }
}

// ===============================
// NAVIGATION FUNCTIONALITY
// ===============================

function initNavigation() {
  log('Initializing navigation...');
  
  DOM.navbar = document.getElementById('navbar');
  DOM.navMenu = document.getElementById('nav-menu');
  DOM.mobileMenuBtn = document.getElementById('mobile-menu-btn');
  DOM.navLinks = document.querySelectorAll('.nav-link');
  
  if (!DOM.navbar || !DOM.navMenu || !DOM.mobileMenuBtn) {
    log('Navigation elements not found');
    return;
  }
  
  setupMobileMenu();
  setupNavigationLinks();
  setupScrollDetection();
  
  log('Navigation initialized successfully');
}

function setupMobileMenu() {
  DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  
  document.addEventListener('click', (e) => {
    if (STATE.isNavOpen && 
        !DOM.navMenu.contains(e.target) && 
        !DOM.mobileMenuBtn.contains(e.target)) {
      closeMobileMenu();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && STATE.isNavOpen) {
      closeMobileMenu();
      DOM.mobileMenuBtn.focus();
    }
  });
  
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768 && STATE.isNavOpen) {
      closeMobileMenu();
    }
  }, 250));
}

function toggleMobileMenu() {
  if (STATE.isNavOpen) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  STATE.isNavOpen = true;
  DOM.navMenu.classList.add('active');
  DOM.mobileMenuBtn.setAttribute('aria-expanded', 'true');
  DOM.mobileMenuBtn.classList.add('active');
  
  document.body.style.overflow = 'hidden';
  
  const firstNavLink = DOM.navMenu.querySelector('.nav-link');
  if (firstNavLink) {
    setTimeout(() => firstNavLink.focus(), 300);
  }
  
  log('Mobile menu opened');
}

function closeMobileMenu() {
  STATE.isNavOpen = false;
  DOM.navMenu.classList.remove('active');
  DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
  DOM.mobileMenuBtn.classList.remove('active');
  
  document.body.style.overflow = '';
  
  log('Mobile menu closed');
}

function setupNavigationLinks() {
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', handleNavigationClick);
  });
}

function handleNavigationClick(e) {
  e.preventDefault();
  
  const href = e.target.getAttribute('href');
  
  if (href && href.startsWith('#')) {
    const targetElement = document.querySelector(href);
    
    if (targetElement) {
      if (STATE.isNavOpen) {
        closeMobileMenu();
      }
      
      smoothScrollTo(targetElement);
      updateActiveNavLink(href);
      
      if (history.pushState) {
        history.pushState(null, null, href);
      }
      
      log(`Navigated to ${href}`);
    }
  }
}

function updateActiveNavLink(activeHref) {
  DOM.navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === activeHref) {
      link.classList.add('active');
    }
  });
}

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
// HERO SECTION FUNCTIONALITY
// ===============================

function initHeroAnimations() {
  log('Initializing hero animations...');
  
  DOM.scrollDown = document.getElementById('scroll-down');
  
  if (DOM.scrollDown) {
    DOM.scrollDown.addEventListener('click', () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        smoothScrollTo(aboutSection);
      }
    });
  }
  
  log('Hero animations initialized successfully');
}

// ===============================
// STATISTICS COUNTER
// ===============================

function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (statNumbers.length === 0) return;
  
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !STATE.statsAnimated) {
        STATE.statsAnimated = true;
        animateStats();
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  });
  
  statNumbers.forEach(stat => observer.observe(stat));
}

function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-count'));
    const duration = CONFIG.animations.statsCountDuration;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * easeOutCubic);
      
      stat.textContent = current;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        stat.textContent = target;
      }
    }
    
    requestAnimationFrame(updateNumber);
  });
}

// ===============================
// CONTACT FORM FUNCTIONALITY
// ===============================

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
  
  const inputs = form.querySelectorAll('.form-control');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const isValid = validateForm(form);
  
  if (!isValid) return;
  
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = submitBtn.querySelector('.btn-loading');
  
  submitBtn.disabled = true;
  submitBtn.classList.add('loading');
  btnText.style.display = 'none';
  btnLoading.style.display = 'block';
  
  setTimeout(() => {
    showSuccessMessage();
    form.reset();
    
    submitBtn.disabled = false;
    submitBtn.classList.remove('loading');
    btnText.style.display = 'block';
    btnLoading.style.display = 'none';
    
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.classList.remove('success', 'error');
    });
  }, CONFIG.form.submissionDelay);
}

function validateForm(form) {
  const inputs = form.querySelectorAll('.form-control[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(input) {
  const value = input.value.trim();
  const fieldName = input.name;
  let isValid = true;
  let errorMessage = '';
  
  if (!value) {
    errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    isValid = false;
  } else {
    switch (fieldName) {
      case 'email':
        if (!isValidEmail(value)) {
          errorMessage = 'Please enter a valid email address';
          isValid = false;
        }
        break;
      case 'name':
        if (value.length < 2) {
          errorMessage = 'Name must be at least 2 characters long';
          isValid = false;
        }
        break;
      case 'message':
        if (value.length < 10) {
          errorMessage = 'Message must be at least 10 characters long';
          isValid = false;
        }
        break;
    }
  }
  
  const errorElement = document.getElementById(`${fieldName}-error`);
  
  if (isValid) {
    input.classList.remove('error');
    input.classList.add('success');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  } else {
    input.classList.remove('success');
    input.classList.add('error');
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.add('show');
    }
  }
  
  return isValid;
}

function clearFieldError(input) {
  const fieldName = input.name;
  const errorElement = document.getElementById(`${fieldName}-error`);
  
  if (input.classList.contains('error')) {
    input.classList.remove('error');
    if (errorElement) {
      errorElement.classList.remove('show');
    }
  }
}

function showSuccessMessage() {
  const successMessage = document.getElementById('success-message');
  if (successMessage) {
    successMessage.classList.add('show');
    
    setTimeout(() => {
      successMessage.classList.remove('show');
    }, 5000);
  }
}

// ===============================
// BACK TO TOP FUNCTIONALITY
// ===============================

function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;
  
  const handleScroll = throttle(() => {
    const scrolled = window.pageYOffset;
    
    if (scrolled > CONFIG.backToTop.showOffset) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, 100);
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ===============================
// INTERSECTION OBSERVER ANIMATIONS
// ===============================

function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
  
  if (animatedElements.length === 0) return;
  
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// ===============================
// MAIN INITIALIZATION
// ===============================

/**
 * MODIFIED: Enhanced initialization to include multilingual animation
 * Main initialization function that sets up all website functionality
 */
function init() {
  log('Initializing Enigma E-Cell website...');
  
  // Check for reduced motion preference
  STATE.reducedMotion = prefersReducedMotionCheck();
  
  // Cache DOM elements
  DOM.body = document.body;
  DOM.html = document.documentElement;
  
  // ADDED: Initialize multilingual animation system
  initMultilingualAnimation();
  
  // ADDED: Set up motion preference change handler
  handleMotionPreferenceChange();
  
  // Initialize existing functionality
  initNavigation();
  initHeroAnimations();
  initStatsCounter();
  initContactForm();
  initBackToTop();
  initScrollAnimations();
  
  log('Website initialization complete');
}

// ===============================
// EVENT LISTENERS
// ===============================

/* MODIFIED: Enhanced DOMContentLoaded listener to include multilingual setup */
document.addEventListener('DOMContentLoaded', init);

// Handle page visibility changes to pause/resume animations
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Page is hidden, pause animations for performance
    stopMultilingualAnimation();
  } else {
    // Page is visible, resume animations if motion is allowed
    if (!prefersReducedMotion) {
      initMultilingualAnimation();
    }
  }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', debounce(() => {
  // Responsive adjustments if needed
  if (window.innerWidth > 768 && STATE.isNavOpen) {
    closeMobileMenu();
  }
}, 250));

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopMultilingualAnimation();
});

/* 
 * ACCESSIBILITY NOTES:
 * - Multilingual animation respects prefers-reduced-motion
 * - Screen reader friendly with aria-live="polite"
 * - Proper language attributes set for each text change
 * - Keyboard navigation preserved throughout
 * - Focus management maintained for mobile menu
 */
