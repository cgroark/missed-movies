import { useState } from "react";
import styled from "styled-components";
import {HandPeaceIcon} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
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
  font-size: clamp(.75rem, 3vw + .25rem, 1);
  color: var(--offWhite);
  cursor: pointer;

  &:hover {
    color: var(--offWhite);
    border-bottom: 4px solid var(--teal);
  }
`;

const ErrorField = styled.div`
  background-color: var(--teal);
  border-radius: 10px;
  width: 75%;
  margin: 15px auto;
  padding: 10px;

  p {
    margin: 0;
  }
`

function Logout() {
  const { isLoading, authError, signOut } = useAuth();
  const [error, setError] = useState<string>('');

  const handleClick = async () => {
    const { success, error: loginError } = await signOut();
    if(!success) {
      setError(loginError ?? 'unknown error');
      return;
    }
  }
  return (
    <>
      <LinkButton onClick={handleClick}>
        Logout <HandPeaceIcon size={24} />
      </LinkButton>
      {(authError || error) && (
        <ErrorField>
            <p>{authError || error }</p>
        </ErrorField>
      )}
    </>
  )
}

export default Logout;