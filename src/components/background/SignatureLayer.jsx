import { Signature } from '../ui/signature';

export const SIGNATURE_TEXT = 'Eyadmoneim';
export const SIGNATURE_DRAW_DURATION = 1.0;
export const SIGNATURE_DRAW_STAGGER = 0.12;
export const SIGNATURE_DRAW_TOTAL = SIGNATURE_DRAW_DURATION + (SIGNATURE_TEXT.length - 1) * SIGNATURE_DRAW_STAGGER;

const SignatureLayer = ({ progress }) => (
  <div className="signature-layer" role="img" aria-label="Eyad Moneim signature">
    <Signature
      text={SIGNATURE_TEXT}
      color="#CDB8FF"
      fontSize={240}
      strokeWidth={1.5}
      letterSpacing={5}
      duration={SIGNATURE_DRAW_DURATION}
      stagger={SIGNATURE_DRAW_STAGGER}
      progress={progress}
      fontUrl="/fonts/bastliga-one.regular.otf"
      className="signature-overlay"
    />
  </div>
);

export default SignatureLayer;
