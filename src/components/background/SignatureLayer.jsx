import { forwardRef } from 'react';
import { SIG_PATHS } from '../../utils/signatureParsing';

const SignatureLayer = forwardRef(({ signatureRef }, ref) => {
  return (
    <div className="signature-layer" ref={ref}>
      <svg
        ref={signatureRef}
        className="signature-overlay"
        viewBox="0 0 841.9 595.3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="sig-main-clip">
            <rect className="sig-main-rect" x="0" y="0" width="0" height="600" />
          </clipPath>
          <clipPath id="sig-underline-clip">
            <rect className="sig-underline-rect" x="0" y="0" width="0" height="600" />
          </clipPath>
          <clipPath id="sig-six-clip">
            <rect className="sig-six-rect" x="0" y="0" width="0" height="600" />
          </clipPath>
        </defs>

        {/* Stage 1 — name body + dots + highlights */}
        <g className="sig-main" clipPath="url(#sig-main-clip)">
          {SIG_PATHS.main.map((d, i) => (
            <path key={`sig-main-${i}`} d={d} fill="#CDB8FF" />
          ))}
          {SIG_PATHS.dots.map((d, i) => (
            <path key={`sig-dot-${i}`} d={d} fill="#CDB8FF" />
          ))}
        </g>

        {/* Stage 2 — underline stroke */}
        <g className="sig-underline" clipPath="url(#sig-underline-clip)">
          {SIG_PATHS.underline.map((d, i) => (
            <path key={`sig-underline-${i}`} d={d} fill="#CDB8FF" />
          ))}
        </g>

        {/* Stage 3 — number 6 */}
        <g className="sig-six" clipPath="url(#sig-six-clip)">
          <path d={SIG_PATHS.six} fill="#CDB8FF" />

        </g>
      </svg>
    </div>
  );
});

SignatureLayer.displayName = 'SignatureLayer';

export default SignatureLayer;
