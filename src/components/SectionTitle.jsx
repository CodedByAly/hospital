import Reveal from './Reveal.jsx';

// Section heading whose text slides up from behind a mask when it scrolls into view.
export default function SectionTitle({ as = 'h2', id, className = '', children }) {
  return (
    <Reveal as={as} id={id} className={`section-title title-mask ${className}`}>
      <span>{children}</span>
    </Reveal>
  );
}
