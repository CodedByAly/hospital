import { useEffect, useRef } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

let openCount = 0;

// Focus trap, Escape to close, scroll lock and focus restore for modal surfaces.
export function useDialog(open, onClose, panelRef) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    const panel = panelRef.current;

    openCount += 1;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.classList.add('is-locked');
    document.documentElement.style.setProperty('--scrollbar-gap', `${scrollbar}px`);

    const focusFirst = () => {
      const auto = panel?.querySelector('[data-autofocus]');
      (auto || panel)?.focus({ preventScroll: true });
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const nodes = [...panel.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel?.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      panel?.removeEventListener('keydown', onKey);
      openCount -= 1;
      if (openCount === 0) document.documentElement.classList.remove('is-locked');
      if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [open, panelRef]);
}
