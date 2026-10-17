import { useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Overlay, Content, Title } from '../ui/DialogStyles';
import { FormActions, FormError, SecondaryButton } from '../ui/FormStyles';
import Loader from '../ui/Loader';
import styled from 'styled-components';
import { HandPeaceIcon } from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LinkButton = styled.button`
  && {
    display: flex;
    gap: 8px;
    align-items: center;
    min-height: 44px;
    padding: 8px 12px;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 12px;
    font-size: 0.95rem;
    color: var(--offWhite);
    font-weight: 400;

    &:hover {
      background: rgba(249, 244, 218, 0.07);
      color: var(--pink);
    }

    @media (max-width: 576px) {
      gap: 5px;
      padding: 8px;
      font-size: 0.8rem;
      svg {
        width: 19px;
        height: 19px;
      }
    }
  }
`;

function Logout() {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { signOut } = useAuth();
  const { showToast } = useToast();

  const handleConfirm = async () => {
    if (isLoggingOut) return;
    setLoggingOut(true);
    setErrorMessage(null);
    const { success, error } = await signOut();
    if (!success) {
      setErrorMessage(error || 'Unable to log out. Please try again.');
      setLoggingOut(false);
      return;
    }
    showToast('Logged out!', true);
    setOpen(false);
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={nextOpen => {
        if (isLoggingOut) return;
        setErrorMessage(null);
        setOpen(nextOpen);
      }}
    >
      <Dialog.Trigger asChild>
        <LinkButton type="button">
          Logout <HandPeaceIcon size={24} />
        </LinkButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content
          aria-busy={isLoggingOut}
          onOpenAutoFocus={event => {
            event.preventDefault();
            cancelRef.current?.focus();
          }}
        >
          <Title>Log out?</Title>
          <Dialog.Description style={{ margin: 0, textAlign: 'center', lineHeight: 1.6 }}>
            Are you sure you want to log out of Missed Movies?
          </Dialog.Description>
          {errorMessage && <FormError>{errorMessage}</FormError>}
          <FormActions>
            <Dialog.Close asChild>
              <SecondaryButton ref={cancelRef} type="button" disabled={isLoggingOut}>
                Cancel
              </SecondaryButton>
            </Dialog.Close>
            <button type="button" disabled={isLoggingOut} onClick={handleConfirm}>
              {isLoggingOut ? 'Logging out' : 'Log out'}
              {isLoggingOut ? <Loader size="small" /> : <HandPeaceIcon size={20} />}
            </button>
          </FormActions>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Logout;
