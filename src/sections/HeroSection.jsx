import { motion } from 'framer-motion';
import DeveloperBadge from '../components/badges/DeveloperBadge';


export default function HeroSection({ setIsRobotActive }) {
  return (
    <main
      id="hero-section"
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(100vh - 8rem)', // fill screen minus hero-inner padding
        display: 'flex',
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >

      {/* Left Card: Next Project */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="next-project-card absolute left-4 lg:left-12 bottom-4 lg:bottom-12 hidden md:flex flex-col w-[140px]"
        style={{ zIndex: 20 }}
        onMouseEnter={() => {
          setIsRobotActive(true);
        }}
        onMouseLeave={() => {
          setIsRobotActive(false);
        }}
      >
        <div style={{ position: 'relative', width: '100%', padding: '1.25rem 0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Card Background and Border SVG */}
          <svg 
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path 
              d="M0,4 Q0,0 4,0 L75,0 L100,15 L100,96 Q100,100 96,100 L4,100 Q0,100 0,96 Z" 
              fill="rgba(250, 250, 245, 0.7)" 
              stroke="rgba(45,49,38,0.15)" 
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div
            style={{
              fontSize: '0.55rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '0.75rem',
              textAlign: 'center',
              color: '#888',
            }}
          >
            Next Project
          </div>
          <div
            style={{
              borderBottom: '1px solid rgba(45,49,38,0.15)',
              paddingBottom: '0.75rem',
              marginBottom: '0.75rem',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <svg viewBox="0 0 100 20" className="w-10 h-3 mb-2 text-gray-400">
              <path d="M0 10 Q 25 0, 50 10 T 100 10" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div
              style={{
                fontSize: '0.65rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                textAlign: 'center',
                color: '#2d3126',
              }}
            >
              LDI SYSTEM
            </div>
          </div>
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="next-project-badge">
              <DeveloperBadge />
            </div>
            <div
              style={{
                fontSize: '0.45rem',
                fontWeight: 700,
                marginTop: '0.5rem',
                textTransform: 'uppercase',
                color: '#888',
                lineHeight: 1.2
              }}
            >
              DEVELOPER<br />Since 2024
            </div>
          </div>
        </div>
      </motion.div>

    </main>
  );
}
