import { useState } from 'react';
import styled from 'styled-components';
import {FinnTheHumanIcon, PasswordIcon, FilmSlateIcon, CaretDoubleRightIcon} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";
import Loader from './Loader';
import '../index.css';

const Label = styled.label`
  display: flex;
  text-align: left;
  color: var(--offWhite);
  gap: 5px;
  align-items: center;
`

const Input = styled.input`
  display: block;
  text-align: left;
  width: 100%;
  margin: 5px 0 20px 0;
  border-radius: 4px;
  border: 1px solid var(--offWhite);
  min-height: 30px;
  padding: 5px;
`

const Button = styled.button`
  background-color: var(--purple);
  display: flex;
  margin: auto;
  gap: 5px;
  align-items: center;

  &:hover {
     background-color: var(--darkPurple);
  }
`

const ToggleButton = styled.button`
  display: flex;
  margin: auto;
  gap: 15px;
  align-items: center;
  background-color: transparent;

  &:hover {
    color: var(--teal);
  }
`
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

function SignUp() {
  const { signIn, signUp, isLoading, authError } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if(!email || !password) {
      setError('Email and password required');
      return;
    } else if(!confirmPassword && mode == 'signup') {
      setError('All fields are required');
      return;
    } else if(mode == 'signup' && (confirmPassword !== password)) {
      setError('Passwords do not match');
      return;
    }
    if (mode === 'login') await signIn(email, password);
    else await signUp(email, password);
    if (!authError && mode === 'login') navigate('/');
    else if (!authError && mode === 'signup') setMessage('Success! Check for email from Supabase to confirm account')
  };

  return (
    <>
      <div>
      <form style={{maxWidth: '400px', margin: '20px auto'}} onSubmit={handleSubmit}>
          <div>
            <Label htmlFor='email'>
              <FinnTheHumanIcon size={24} />
              Email
            </Label>
            <Input
              id='email'
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            >
            </Input>
          </div>
          <div>
            <Label htmlFor='password'>
              <PasswordIcon size={24} />
              Password
            </Label>
            <Input
              id='password'
              type='password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
            </Input>
          </div>
        {mode === 'signup' && (
          <>
            <div>
              <Label htmlFor='confirmPassword'>
                <PasswordIcon size={24} />
                Confirm Password
              </Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              >
              </Input>
            </div>
          </>
        )}

        <Button type='submit'>

          {isLoading ?
            mode === 'login' ? 'Logging In' : 'Signing Up'
          :
            mode === 'login' ? 'Login' : 'Sign Up'
          }
          {isLoading ? <Loader size={'small'} /> : <FilmSlateIcon size={24} />}
        </Button>

          {(authError || error || message) && (
          <ErrorField>
              <p>{authError || error || message}</p>
          </ErrorField>
        )}
      </form>

      <ToggleButton onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Sign up for an account" : "Have an account? Sign in."}
        <CaretDoubleRightIcon size={24} />
      </ToggleButton>
    </div>
    </>
  )
}
export default SignUp;