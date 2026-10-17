import * as Toast from '@radix-ui/react-toast';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircleIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react';
import styled, { keyframes } from 'styled-components';

interface ToastContextType {
  showToast: (message: string, success: boolean) => void;
}

const slideIn = keyframes`
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
`;

const StyledToastRoot = styled(Toast.Root)`
  box-sizing: border-box;
  background: #1c4842;
  border: 1px solid rgba(70, 213, 187, 0.4);
  color: var(--offWhite);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: start;
  text-align: left;
  gap: 10px;
  width: 100%;
  font-size: 0.9rem;
  line-height: 1.5;

  > svg {
    flex-shrink: 0;
    color: #6dd4bf;
  }
  animation: ${slideIn} 0.3s ease-out;

  &.error {
    background: #383040;
    border-color: rgba(189, 162, 227, 0.4);
    > svg {
      color: #dcc8f4;
    }
  }
`;

const StyledToastTitle = styled(Toast.Title)`
  font-weight: 500;
  overflow-wrap: anywhere;
  min-width: 0;
  flex: 1;
`;

const StyledToastViewport = styled(Toast.Viewport)`
  position: fixed;
  top: calc(12px + env(safe-area-inset-top, 0px));
  right: max(12px, env(safe-area-inset-right, 0px));
  width: min(360px, calc(100vw - 24px));
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  list-style: none;
  z-index: 9999;
  outline: none;
`;

const CloseToast = styled(Toast.Close)`
  && {
    flex-shrink: 0;
    width: 36px;
    min-height: 36px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: var(--offWhite);
    &:hover {
      background: rgba(249, 244, 218, 0.08);
    }
  }
`;

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(true);

  const showToast = useCallback((msg: string, succ: boolean) => {
    setMessage(msg);
    setSuccess(succ);
    setOpen(false);
    setTimeout(() => setOpen(true), 50);
  }, []);

  return (
    <Toast.Provider swipeDirection="right" duration={2500}>
      <ToastContext.Provider value={{ showToast }}>
        {children}
        <StyledToastRoot open={open} onOpenChange={setOpen} className={!success ? 'error' : ''}>
          {success ? (
            <CheckCircleIcon size={24} aria-label="Success" />
          ) : (
            <WarningCircleIcon size={24} aria-label="Error" />
          )}
          <StyledToastTitle>{message}</StyledToastTitle>
          <CloseToast aria-label="Dismiss notification">
            <XIcon size={18} />
          </CloseToast>
        </StyledToastRoot>
        <StyledToastViewport />
      </ToastContext.Provider>
    </Toast.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('Toast provider missing');
  return ctx;
};
