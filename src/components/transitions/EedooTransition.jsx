import { createContext, useContext, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const EedooTransitionContext = createContext();

export const useEedooTransition = () => useContext(EedooTransitionContext);

export const EedooTransitionProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const colSlicesRef = useRef([]);
  const rowSlicesRef = useRef([]);

  const numSlices = 7; // Number of slices in both directions

  const navigateWithTransition = (to, options) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    const colSlices = colSlicesRef.current;
    const rowSlices = rowSlicesRef.current;

    // Phase 1 Setup: Prepare columns to rise from bottom, and hide rows
    gsap.set(colSlices, { scaleY: 0, scaleX: 1, transformOrigin: 'bottom' });
    gsap.set(rowSlices, { scaleX: 0, scaleY: 1 });

    // Phase 1: Cover (bottom to top using columns)
    gsap.fromTo(
      colSlices,
      { scaleY: 0 },
      {
        scaleY: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power3.inOut',
        onComplete: () => {
          // Navigate to the new page
          navigate(to, options);
          
          // Small delay before uncovering, simulating loading or giving router time
          setTimeout(() => {
            // Swap sets: Hide columns, fully show rows (ready to shrink right)
            gsap.set(colSlices, { scaleY: 0 });
            gsap.set(rowSlices, { scaleX: 1, transformOrigin: 'right' });
            
            // Phase 2: Uncover (left to right using horizontal rows)
            // By setting transformOrigin to "right", scaling X to 0 collapses them to the right.
            gsap.to(rowSlices, {
              scaleX: 0,
              duration: 0.6,
              stagger: 0.05, // staggered from top to bottom (row 0 to 6)
              ease: 'power3.inOut',
              onComplete: () => {
                setIsTransitioning(false);
              }
            });
          }, 100);
        }
      }
    );
  };

  return (
    <EedooTransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      {/* Transition Overlay */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          pointerEvents: isTransitioning ? 'auto' : 'none',
          zIndex: 99999, // Ensure it's above everything
        }}
      >
        {/* Vertical Slices (Columns) - Used for bottom-to-top cover */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'row' }}>
          {Array.from({ length: numSlices }).map((_, i) => (
            <div
              key={`col-${i}`}
              ref={(el) => (colSlicesRef.current[i] = el)}
              style={{
                flex: 1,
                height: '100%',
                backgroundColor: '#1f231f', // Match project dark theme
                transform: 'scaleY(0)' // Hidden initially
              }}
            />
          ))}
        </div>

        {/* Horizontal Slices (Rows) - Used for left-to-right uncover */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          {Array.from({ length: numSlices }).map((_, i) => (
            <div
              key={`row-${i}`}
              ref={(el) => (rowSlicesRef.current[i] = el)}
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: '#1f231f', // Match project dark theme
                transform: 'scaleX(0)' // Hidden initially
              }}
            />
          ))}
        </div>
      </div>
    </EedooTransitionContext.Provider>
  );
};
