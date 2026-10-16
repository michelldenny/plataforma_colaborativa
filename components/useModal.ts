import { useEffect, useRef, RefObject } from 'react';
const stack: symbol[] = [];
let originalOverflow = '';
export function useModal(open: boolean, panel: RefObject<HTMLDivElement | null>, onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const token = Symbol();
    const previous = document.activeElement as HTMLElement | null;
    if (!stack.length) { originalOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
    stack.push(token);
    const focusable = () => Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"], [contenteditable="true"]') || []).filter(el => el.getClientRects().length);
    (focusable()[0] || panel.current)?.focus();
    const handle = (event: KeyboardEvent) => {
      if (stack[stack.length - 1] !== token) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close.current(); }
      if (event.key === 'Tab') {
        const items = focusable();
        const index = items.indexOf(document.activeElement as HTMLElement);
        if (!items.length) { event.preventDefault(); panel.current?.focus(); }
        else if (event.shiftKey ? index <= 0 : index === items.length - 1 || index < 0) { event.preventDefault(); items[event.shiftKey ? items.length - 1 : 0].focus(); }
      }
    };
    document.addEventListener('keydown', handle);
    return () => {
      document.removeEventListener('keydown', handle);
      stack.splice(stack.indexOf(token), 1);
      if (!stack.length) document.body.style.overflow = originalOverflow;
      if (previous?.isConnected) previous.focus();
    };
  }, [open, panel]);
}
