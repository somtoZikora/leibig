import { Variants } from 'framer-motion'

// Common transition settings for consistent timing
export const transitions = {
  smooth: {
    duration: 0.3,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
  quick: {
    duration: 0.15,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
  slow: {
    duration: 0.5,
    ease: [0.25, 0.46, 0.45, 0.94] as const,
  },
  spring: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
  },
  bounce: {
    type: "spring" as const,
    stiffness: 200,
    damping: 10,
  }
} as const

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  out: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Fade in from bottom animation
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 60,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    y: -60,
    transition: { duration: 0 }
  }
}

// Fade in from left animation
export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    x: 60,
    transition: { duration: 0 }
  }
}

// Fade in from right animation
export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 60,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    x: -60,
    transition: { duration: 0 }
  }
}

// Scale in animation
export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0 }
  }
}

// Stagger container for children animations
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
}

// Stagger item for children
export const staggerItem: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }
  }
}

// Header animation variants
export const headerVariants: Variants = {
  initial: {
    y: -100,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0 }
  },
  exit: {
    y: -100,
    opacity: 0,
    transition: { duration: 0 }
  }
}

// Product card hover animation
export const productCardHover: Variants = {
  initial: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0 }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0 }
  }
}

// Button hover animation
export const buttonHover: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0 }
  }
}

// Image hover animation
export const imageHover: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0 }
  }
}

// Modal/overlay animation
export const modalVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0 }
  }
}

// Backdrop animation
export const backdropVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0 }
  }
}

// Slide in from bottom (for mobile menus)
export const slideInBottom: Variants = {
  initial: {
    y: "100%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0 }
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0 }
  }
}

// Slide in from top
export const slideInTop: Variants = {
  initial: {
    y: "-100%",
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 0 }
  },
  exit: {
    y: "-100%",
    opacity: 0,
    transition: { duration: 0 }
  }
}

// Rotate in animation
export const rotateIn: Variants = {
  initial: {
    opacity: 0,
    rotate: -180,
  },
  animate: {
    opacity: 1,
    rotate: 0,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    rotate: 180,
    transition: { duration: 0 }
  }
}

// Bounce in animation
export const bounceIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.3,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    scale: 0.3,
    transition: { duration: 0 }
  }
}

// Hero banner animation
export const heroVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 1.1,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0 }
  }
}

// Text reveal animation
export const textReveal: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  }
}

// Scroll-triggered animation variants
export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0,
      ease: [0.25, 0.46, 0.45, 0.94],
    }
  }
}

// Cart item animation
export const cartItemVariants: Variants = {
  initial: {
    opacity: 0,
    x: -100,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.8,
    transition: { duration: 0 }
  }
}

// Loading spinner animation
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 0,
      repeat: Infinity,
      ease: "linear",
    }
  }
}

// Notification/toast animation
export const notificationVariants: Variants = {
  initial: {
    opacity: 0,
    y: -50,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.8,
    transition: { duration: 0 }
  }
}

// Search bar animation
export const searchBarVariants: Variants = {
  initial: {
    width: 0,
    opacity: 0,
  },
  animate: {
    width: "100%",
    opacity: 1,
    transition: { duration: 0 }
  },
  exit: {
    width: 0,
    opacity: 0,
    transition: { duration: 0 }
  }
}

// Mobile menu animation
export const mobileMenuVariants: Variants = {
  initial: {
    x: "-100%",
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0 }
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0 }
  }
}

// Footer animation
export const footerVariants: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: { duration: 0 }
  }
}

// Utility function to create custom stagger delays
export const createStaggerDelay = (index: number, baseDelay: number = 0) => ({
  delay: baseDelay * index,
})

// Utility function for scroll-triggered animations
export const scrollAnimationProps = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.3 },
  variants: scrollReveal,
  transition: { duration: 0 }
}

// Utility function for hover animations
export const hoverAnimationProps = {
  whileHover: "hover",
  whileTap: "tap",
  variants: productCardHover,
  transition: { duration: 0 }
}

// Utility function for button animations
export const buttonAnimationProps = {
  whileHover: "hover",
  whileTap: "tap",
  variants: buttonHover,
  transition: { duration: 0 }
}
