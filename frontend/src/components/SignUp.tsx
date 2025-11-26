import { useState } from 'react';
import styled from 'styled-components';
import {
  FinnTheHumanIcon,
  PasswordIcon,
  FilmSlateIcon,
  CaretDoubleRightIcon,
  EyeIcon,
  EyeClosedIcon,
  ConfettiIcon,
} from '@phosphor-icons/react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import '../index.css';

const ToggleButton = styled.button`
  display: flex;
  margin: auto;
  gap: 15px;
  align-items: center;
  background-color: transparent;

  &:hover {
    color: var(--teal);
  }
`;

const RevealButton = styled.button`
  display: inline-block;
  margin-left: -65px;
  background: transparent;
  position: absolute;

  @media (max-width: 768px) {
    margin-top: 5px;
  }
`;

const MessageField = styled.div`
  display: flex;
  gap: 10px;
  background-color: var(--lightBlack);
  border: solid 2px var(--pink);
  border-radius: 10px;
  margin: 25px auto;
  padding: 10px 20px;
  width: fit-content;

  p {
    margin: 0;
  }
`;

function SignUp() {
  const { signIn, signUp, isLoading, authError, setAuthError } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAuthError('');
    setMessage('');
    if (!email || !password) {
      setError('Error: Email and password required');
      return;
    } else if (!confirmPassword && mode == 'signup') {
      setError('Error: All fields are required');
      return;
    } else if (mode == 'signup' && confirmPassword !== password) {
      setError('Error: Passwords do not match');
      return;
    }
    if (mode === 'login') {
      const { success, error: loginError } = await signIn(email, password);
      if (!success) {
        setError(loginError ?? 'unknown error');
        showToast(authError || loginError || 'Category could not be saved.', false);
        return;
      }
      showToast("You're signed in!", true);
      navigate('/');
    } else {
      const { success, error: loginError } = await signUp(email, password);
      if (!success) {
        setError(loginError ?? 'unknown error');
        showToast(authError || loginError || 'Category could not be saved.', false);
        return;
      }
      showToast('Success! Check for email from Supabase to confirm account!', true);
      setMessage('Success! Check for email from Supabase to confirm account');
      setShowForm(false);
    }
  };

  return (
    <>
      <div>
        <form
          style={{ maxWidth: '400px', margin: '20px auto', padding: '0 20px' }}
          onSubmit={handleSubmit}
        >
          {showForm && (
            <>
              <div>
                <label htmlFor="email">
                  <FinnTheHumanIcon size={24} />
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password">
                  <PasswordIcon size={24} />
                  Password
                </label>
                <input
                  id="password"
                  type={togglePassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <RevealButton
                  className="no-hover"
                  type="button"
                  onClick={() => setTogglePassword(prev => !prev)}
                >
                  {togglePassword ? <EyeClosedIcon size={24} /> : <EyeIcon size={24} />}
                </RevealButton>
              </div>
              {mode === 'signup' && (
                <>
                  <div>
                    <label htmlFor="confirmPassword">
                      <PasswordIcon size={24} />
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type={toggleConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <RevealButton
                      className="no-hover"
                      type="button"
                      onClick={() => setToggleConfirmPassword(prev => !prev)}
                    >
                      {toggleConfirmPassword ? <EyeClosedIcon size={24} /> : <EyeIcon size={24} />}
                    </RevealButton>
                  </div>
                </>
              )}
              {(authError || error) && <p className="error">{authError || error || message}</p>}
              <button style={{ margin: 'auto' }} type="submit" className="slimmer">
                {isLoading
                  ? mode === 'login'
                    ? 'Logging In'
                    : 'Signing Up'
                  : mode === 'login'
                    ? 'Login'
                    : 'Sign Up'}
                {isLoading ? <Loader size={'small'} /> : <FilmSlateIcon size={24} />}
              </button>
            </>
          )}
        </form>
        {message && (
          <MessageField>
            <>
              <ConfettiIcon size={24} />
              {message}
            </>
          </MessageField>
        )}
        {showForm && (
          <ToggleButton
            className="no-hover"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up for an account' : 'Have an account? Sign in.'}
            <CaretDoubleRightIcon size={24} />
          </ToggleButton>
        )}
      </div>
    </>
  );
}
export default SignUp;
