import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';

export const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background-color: rgba(12, 12, 18, 0.7);
  backdrop-filter: blur(4px);
  z-index: 999;
`;

export const Content = styled(Dialog.Content)`
  background: var(--offWhite);
  color: var(--lightBlack);
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 18px;
  padding: 1.5rem;
  width: calc(100% - 32px - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px));
  max-width: 440px;
  max-height: calc(100dvh - 32px - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  overscroll-behavior: contain;
  margin: auto;
  position: fixed;
  top: calc(50% + (env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px)) / 2);
  left: calc(50% + (env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px)) / 2);
  transform: translate(-50%, -50%);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);
  z-index: 1000;
`;

export const Title = styled(Dialog.Title)`
  font-size: 1.5rem;
  margin: 0 0 24px;
  line-height: 1.3;
  overflow-wrap: anywhere;
  text-align: center;
`;

export const CloseButton = styled(Dialog.Close)`
  padding: 0;
  display: flex;
  width: 44px;
  min-height: 44px;
  margin: -10px -10px 4px auto;
  background: transparent;
  color: var(--purple);
  border: none;
  cursor: pointer;
`;
