import signatureRaw from "../assets/signature.svg?raw";

const _sigParser = typeof DOMParser !== 'undefined' ? new DOMParser() : null;
const _sigDoc = _sigParser ? _sigParser.parseFromString(signatureRaw, 'image/svg+xml') : null;
const _sigAllPaths = _sigDoc ? Array.from(_sigDoc.querySelectorAll('path')) : [];

const _sigSt0 = _sigAllPaths.filter(p => p.classList.contains('st0'));
const _sigSt1 = _sigAllPaths.filter(p => p.classList.contains('st1'));

export const SIG_PATHS = {
  main: [_sigSt0[0]].map(p => p?.getAttribute('d')).filter(Boolean),
  underline: [_sigSt0[1]].map(p => p?.getAttribute('d')).filter(Boolean),
  six: _sigSt0[2]?.getAttribute('d') || '',
  dots: [_sigSt0[3], _sigSt0[4]].map(p => p?.getAttribute('d')).filter(Boolean),
  highlights: _sigSt1.map(p => p?.getAttribute('d')).filter(Boolean),
};
