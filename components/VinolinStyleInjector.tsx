'use client'
import { useEffect } from 'react'

/**
 * Component to inject custom styles into the Vinolin chat widget
 * to match the Kirsten-Liebieg website branding
 */
export default function VinolinStyleInjector() {
  useEffect(() => {
    // Set Vinolin configuration before the script loads
    if (typeof window !== 'undefined') {
      // Set primary brand color (gold/amber) - this replaces the default #ff0040 purple
      window.color = '#C9A961'

      // Set widget position
      window.vinolinPosition = 'BOTTOM_RIGHT'

      // Custom CSS styles using Vinolin's configuration system
      const customStyles = {
        'VINOLIN_INPUT': {
          'default': {
            'background': 'linear-gradient(to right, #C9A961, #C9A940)',
            'border-radius': '0.625rem',
            'font-family': 'var(--font-avenir), sans-serif',
            'box-shadow': '0 10px 25px rgba(201, 169, 97, 0.3)',
          },
          'mobile': {
            'background': 'linear-gradient(to right, #C9A961, #C9A940)',
            'border-radius': '0.625rem',
            'font-family': 'var(--font-avenir), sans-serif',
          }
        },
        'VINOLIN_CONTAINER': {
          'default': {
            'border-radius': '1rem',
            'font-family': 'var(--font-avenir), sans-serif',
          }
        }
      }

      // Convert styles object to JSON string for Vinolin
      window.vinolinCustomStyles = JSON.stringify(customStyles)

      // Additional style injection via CSS for deeper customization
      const styleElement = document.createElement('style')
      styleElement.id = 'vinolin-custom-styles'
      styleElement.innerHTML = `
        /* Vinolin Widget Custom Styles for Kirsten-Liebieg */
        /* Replace purple (#ff0040) with gold (#C9A961) throughout */

        /* Main button styling - vinolin-input */
        #vinolin-input,
        #vinolin-input button {
          background: linear-gradient(to right, #C9A961, #C9A940) !important;
          border-radius: 0.625rem !important;
          font-family: var(--font-avenir), sans-serif !important;
          box-shadow: 0 10px 25px rgba(201, 169, 97, 0.3) !important;
          transition: all 0.2s ease !important;
          color: white !important;
        }

        /* White text/label inside button */
        #vinolin-input *,
        #vinolin-input span,
        #vinolin-input p,
        #vinolin-input div {
          color: white !important;
        }

        /* White SVG icons */
        #vinolin-input svg,
        #vinolin-input svg path,
        #vinolin-input svg circle,
        #vinolin-input svg rect {
          fill: white !important;
          stroke: white !important;
        }

        #vinolin-input:hover {
          background: linear-gradient(to right, #B89951, #B89930) !important;
          box-shadow: 0 15px 35px rgba(201, 169, 97, 0.4) !important;
          transform: translateY(-2px) !important;
        }

        /* Replace ALL purple colors with gold */
        [style*="#ff0040"],
        [style*="rgb(255, 0, 64)"],
        [style*="rgb(255,0,64)"] {
          background: #C9A961 !important;
        }

        /* Modal container - vinolin-modal */
        #vinolin-modal,
        #vinolin-container {
          border-radius: 1rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
          overflow: hidden !important;
        }

        /* Backdrop */
        #vinolin-backdrop {
          backdrop-filter: blur(4px) !important;
        }

        /* Close button */
        #vinolin-close-button,
        #vinolin-close-button:hover {
          background: rgba(201, 169, 97, 0.1) !important;
          color: #C9A961 !important;
        }

        /* Iframe - try to style it */
        #vinolin-iframe {
          border-radius: 1rem !important;
          border: none !important;
        }

        /* Target any buttons or elements with background colors */
        #vinolin-modal button[style*="background"],
        #vinolin-modal [style*="background-color"],
        #vinolin-container button[style*="background"],
        #vinolin-container [style*="background-color"] {
          background: linear-gradient(to right, #C9A961, #C9A940) !important;
        }

        /* Target SVG elements that might use purple */
        #vinolin-modal svg [fill="#ff0040"],
        #vinolin-modal svg [fill="rgb(255, 0, 64)"],
        #vinolin-modal svg [stroke="#ff0040"],
        #vinolin-input svg [fill="#ff0040"],
        #vinolin-input svg [fill="rgb(255, 0, 64)"] {
          fill: #C9A961 !important;
          stroke: #C9A961 !important;
        }

        /* Typography */
        #vinolin-modal *,
        #vinolin-container * {
          font-family: var(--font-avenir), sans-serif !important;
        }

        /* Links and accent colors */
        #vinolin-modal a,
        #vinolin-container a {
          color: #C9A961 !important;
        }

        #vinolin-modal a:hover,
        #vinolin-container a:hover {
          color: #B89951 !important;
        }

        /* Any element with text color purple */
        [style*="color: rgb(255, 0, 64)"],
        [style*="color:#ff0040"],
        [style*="color: #ff0040"] {
          color: #C9A961 !important;
        }

        /* Scrollbar */
        #vinolin-modal ::-webkit-scrollbar {
          width: 8px;
        }

        #vinolin-modal ::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        #vinolin-modal ::-webkit-scrollbar-thumb {
          background: #C9A961;
          border-radius: 4px;
        }

        #vinolin-modal ::-webkit-scrollbar-thumb:hover {
          background: #B89951;
        }
      `

      // Only add if not already added
      if (!document.getElementById('vinolin-custom-styles')) {
        document.head.appendChild(styleElement)
      }

      // Monitor for Vinolin modal and iframe creation
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              // Check for vinolin modal
              if (node.id === 'vinolin-modal' || node.id === 'vinolin-container') {
                console.log('✅ Vinolin modal detected, applying styles...')

                // Force apply styles to modal
                node.style.borderRadius = '1rem'
                node.style.overflow = 'hidden'

                // Find and style the iframe
                const iframe = node.querySelector('#vinolin-iframe') as HTMLIFrameElement
                if (iframe) {
                  iframe.style.borderRadius = '1rem'
                  console.log('✅ Vinolin iframe styled')
                }

                // Find and style close button
                const closeBtn = node.querySelector('#vinolin-close-button') as HTMLElement
                if (closeBtn) {
                  closeBtn.style.color = '#C9A961'
                }

                // Find all inline styled elements and replace purple
                const allElements = node.querySelectorAll('[style*="rgb(255, 0, 64)"], [style*="#ff0040"]')
                allElements.forEach((el: Element) => {
                  const htmlEl = el as HTMLElement
                  if (htmlEl.style.backgroundColor?.includes('255, 0, 64') || htmlEl.style.backgroundColor === '#ff0040') {
                    htmlEl.style.background = 'linear-gradient(to right, #C9A961, #C9A940)'
                  }
                  if (htmlEl.style.color?.includes('255, 0, 64') || htmlEl.style.color === '#ff0040') {
                    htmlEl.style.color = '#C9A961'
                  }
                })
              }

              // Check for vinolin input button
              if (node.id === 'vinolin-input') {
                console.log('✅ Vinolin input button detected, applying styles...')
                node.style.background = 'linear-gradient(to right, #C9A961, #C9A940)'
                node.style.borderRadius = '0.625rem'
                node.style.boxShadow = '0 10px 25px rgba(201, 169, 97, 0.3)'
                node.style.color = 'white'

                // Make all text elements white
                const textElements = node.querySelectorAll('span, p, div, button')
                textElements.forEach((el: Element) => {
                  (el as HTMLElement).style.color = 'white'
                })

                // Style SVG inside button to white
                const svg = node.querySelector('svg')
                if (svg) {
                  const svgElements = svg.querySelectorAll('path, circle, rect, polygon, line')
                  svgElements.forEach((el: Element) => {
                    const svgEl = el as SVGElement
                    svgEl.style.fill = 'white'
                    svgEl.style.stroke = 'white'
                    svgEl.setAttribute('fill', 'white')
                    svgEl.setAttribute('stroke', 'white')
                  })
                }

                console.log('✅ Vinolin button styled with white text and icons')
              }
            }
          })
        })
      })

      // Start observing the document body for changes
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      console.log('✅ Vinolin custom styling initialized with MutationObserver')

      // Cleanup function
      return () => {
        observer.disconnect()
      }
    }

    return () => {
      // Cleanup if needed
      const styleElement = document.getElementById('vinolin-custom-styles')
      if (styleElement) {
        styleElement.remove()
      }
    }
  }, [])

  return null // This component doesn't render anything
}

// Type declarations for window object
declare global {
  interface Window {
    color?: string
    vinolinPosition?: string
    vinolinCustomStyles?: string
  }
}
