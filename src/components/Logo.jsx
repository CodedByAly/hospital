import { LEAVES_PATH, TREE_VIEWBOX, TRUNK_PATH, WORDMARK_PATH, WORDMARK_VIEWBOX } from '../assets/logoPaths';
import './Logo.css';

export function TreeMark({ className = '', tone = 'color' }) {
  return (
    <svg className={`tree-mark tree-mark--${tone} ${className}`} viewBox={TREE_VIEWBOX} aria-hidden="true" focusable="false">
      <path className="tree-mark__leaves" fillRule="evenodd" d={LEAVES_PATH} />
      <path className="tree-mark__trunk" fillRule="evenodd" d={TRUNK_PATH} />
    </svg>
  );
}

export function Wordmark({ className = '' }) {
  return (
    <svg className={`wordmark ${className}`} viewBox={WORDMARK_VIEWBOX} aria-hidden="true" focusable="false">
      <path fillRule="evenodd" d={WORDMARK_PATH} />
    </svg>
  );
}

/**
 * layout: 'inline' (mark beside the name, for the header) or 'stacked' (as on the menu cover)
 * tone:   'color' on light backgrounds, 'light' on green
 */
export default function Logo({ layout = 'inline', tone = 'color', tagline, className = '' }) {
  return (
    <span className={`logo logo--${layout} logo--${tone} ${className}`}>
      <TreeMark tone={tone} className="logo__mark" />
      <span className="logo__text">
        <Wordmark className="logo__word" />
        {tagline && <span className="logo__tagline">{tagline}</span>}
      </span>
      <span className="sr-only">Life Kitchen</span>
    </span>
  );
}
