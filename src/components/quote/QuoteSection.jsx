import { forwardRef } from 'react';

const QuoteSection = forwardRef(({ quoteRow1Ref, quoteRow2Ref, quoteRow3Ref, quoteRow4Ref }, ref) => {
  return (
    <div className="quote-section" ref={ref}>
      <div className="quote-row" ref={quoteRow1Ref}>
        <div className="quote-row-content">
          <span className="message-text">TO GET SOMETHING YOU,</span>
        </div>
        <div className="block-revealer" style={{ backgroundColor: 'var(--color-white)' }} />
      </div>
      <div className="quote-row" ref={quoteRow2Ref}>
        <div className="quote-row-content">
          <span className="message-text">NEVER</span>
          <span className="quote-text">HAD</span>
        </div>
        <div className="block-revealer" style={{ backgroundColor: 'var(--color-lime)' }} />
      </div>
      <div className="quote-row" ref={quoteRow3Ref}>
        <div className="quote-row-content">
          <span className="message-text">YOU HAD TO DO SOMETHING YOU,</span>
        </div>
        <div className="block-revealer" style={{ backgroundColor: 'var(--color-white)' }} />
      </div>
      <div className="quote-row" ref={quoteRow4Ref}>
        <div className="quote-row-content">
          <span className="message-text">NEVER</span>
          <span className="quote-text">DID</span>
        </div>
        <div className="block-revealer" style={{ backgroundColor: 'var(--color-lime)' }} />
      </div>
    </div>
  );
});

QuoteSection.displayName = 'QuoteSection';

export default QuoteSection;
