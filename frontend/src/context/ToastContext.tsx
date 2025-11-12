import * as Toast from '@radix-ui/react-toast';
import React, { createContext, useContext, useState, useCallback } from 'react';
import { ConfettiIcon } from '@phosphor-icons/react';
import styled, { keyframes } from 'styled-components';
import '../index.css';

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
`

const StyledToastRoot = styled(Toast.Root)`
  background-color: var(--darkTeal);
  color: var(--offWhite);
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 280px;
  max-width: 350px;
  font-size: 1rem;
  animation: ${slideIn} 0.3s ease-out;

  &.error {
    background-color: red;
  }
`;

const StyledToastTitle = styled(Toast.Title)`
  font-weight: 600;
  flex: 1;
`;

const StyledToastViewport = styled(Toast.Viewport)`
  position: fixed;
  top: 10px;
  right: 20px;
  width: 320px;
  z-index: 9999;
  outline: none;
`;

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(true);

  const showToast = useCallback((msg: string, succ: boolean) => {
    setMessage(msg);
    setSuccess(succ)
    setOpen(false);
    setTimeout(() => setOpen(true), 50);
  }, []);

  return (
    <Toast.Provider swipeDirection="right" duration={2500}
    >
      <ToastContext.Provider value={{ showToast }}>
        {children}
        <StyledToastRoot open={open} onOpenChange={setOpen} className={!success ? 'error' : '' }>
          <ConfettiIcon size={24} />
          <StyledToastTitle>
            {message}
          </StyledToastTitle>
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
