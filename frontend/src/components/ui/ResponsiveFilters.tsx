import { useRef, useState, useSyncExternalStore } from 'react';
import type { ReactElement, ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import styled, { css, keyframes } from 'styled-components';

const query = '(max-width: 576px)';
const subscribe = (callback: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
};
const panel = css`
  box-sizing: border-box;
  overflow-y: auto;
  background: var(--offWhite);
  border: 1px solid rgba(123, 94, 166, 0.2);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
  padding: 22px;
  color: var(--lightBlack);
  text-align: left;
  label {
    font-size: 0.8rem;
    color: var(--darkGray);
  }
  select {
    margin: 8px 0 20px;
  }
`;
const Popup = styled(Popover.Content)`
  ${panel}
  width: 320px;
  max-width: calc(100vw - 24px);
  max-height: var(--radix-popover-content-available-height);
  border-radius: 18px;
  z-index: 300;
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const fadeOut = keyframes`from { opacity: 1; } to { opacity: 0; }`;
const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background: rgba(12, 12, 18, 0.65);
  z-index: 999;
  &[data-state='open'] {
    animation: ${fadeIn} 200ms ease-out;
  }
  &[data-state='closed'] {
    animation: ${fadeOut} 200ms ease-in;
  }
`;
const slideUp = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`;
const slideDown = keyframes`from { transform: translateY(0); } to { transform: translateY(100%); }`;
const Sheet = styled(Dialog.Content)`
  ${panel}
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: calc(100dvh - 24px);
  border-radius: 22px 22px 0 0;
  padding-bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  overscroll-behavior: contain;
  z-index: 1000;
  &[data-state='open'] {
    animation: ${slideUp} 200ms ease-out;
  }
  &[data-state='closed'] {
    animation: ${slideDown} 200ms ease-in;
  }
`;

export default function ResponsiveFilters({
  trigger,
  children,
}: {
  trigger: ReactElement;
  children: (close: () => void) => ReactNode;
}) {
  const mobile = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusPanel = (event: Event) => {
    // Native mobile selects should receive focus only when tapped.
    event.preventDefault();
    panelRef.current?.focus({ preventScroll: true });
  };
  const content = children(() => setOpen(false));
  return mobile ? (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Sheet
          ref={panelRef}
          tabIndex={-1}
          aria-label="Movie filters"
          aria-describedby={undefined}
          onOpenAutoFocus={focusPanel}
        >
          <Dialog.Title
            style={{
              position: 'absolute',
              width: 1,
              height: 1,
              overflow: 'hidden',
              clipPath: 'inset(50%)',
            }}
          >
            Movie filters
          </Dialog.Title>
          {content}
        </Sheet>
      </Dialog.Portal>
    </Dialog.Root>
  ) : (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popup
          ref={panelRef}
          tabIndex={-1}
          aria-label="Movie filters"
          align="end"
          side="top"
          collisionPadding={12}
          sideOffset={12}
          onOpenAutoFocus={focusPanel}
        >
          {content}
        </Popup>
      </Popover.Portal>
    </Popover.Root>
  );
}
