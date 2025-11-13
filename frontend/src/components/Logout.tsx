import { useState } from 'react';
import styled from 'styled-components';
import { HandPeaceIcon } from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../index.css';

const LinkButton = styled.a`
  display: inline-block;
  display: flex;
  gap: 4px;
  align-items: center;
  border-bottom: 4px solid transparent;
  transition: border-bottom 0.3s ease;
  padding-bottom: 3px;
  background-color: transparent;
  font-size: clamp(0.9rem, 2.5vw + 0.25rem, 1rem);
  color: var(--offWhite);
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: var(--offWhite);
    border-bottom: 4px solid var(--teal);
  }

  @media (max-width: 576px) {
    gap: 3px;
  }
`;

function Logout() {
  const { isLoading, authError, signOut } = useAuth();
  const [error, setError] = useState<string>('');
  const { showToast } = useToast();

  const handleClick = async () => {
    const { success, error: error } = await signOut();
    if (!success) {
      setError(error ?? 'unknown error');
      showToast(authError || error || 'Logout error', false);
      return;
    }
    showToast('Logged out!', true);
  };
  return (
    <>
      <LinkButton onClick={handleClick}>
        Logout <HandPeaceIcon size={24} />
      </LinkButton>
      {(authError || error) && (
        <ErrorField>
          <p>{authError || error}</p>
        </ErrorField>
      )}
    </>
  );
}

export default Logout;
