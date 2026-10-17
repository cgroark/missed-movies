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
  KeyIcon,
} from '@phosphor-icons/react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../ui/Loader';
import { FormError, FormHint } from '../ui/FormStyles';
import { actionButtonStyles } from '../ui/ButtonStyles';

const SubmitButton = styled.button`
  && {
    ${actionButtonStyles} width: 100%;
  }
`;

const ToggleButton = styled.button.attrs({ type: 'button' })`
  && {
    ${actionButtonStyles}
    width: fit-content;
    max-width: calc(100% - 32px);
    margin: 16px auto;
    background: transparent;
    border: none;
    padding: 6px 0;
    text-decoration: none;
    box-shadow: none;
    color: #dcc8f4;
    text-align: center;
    line-height: 1.5;
    &:hover:not(:disabled) {
      background: transparent;
      color: var(--offWhite);
    }
    svg {
      flex-shrink: 0;
    }
  }
`;

const AuthForm = styled.form`
  box-sizing: border-box;
  width: calc(100% - 32px);
  max-width: 440px;
  margin: 24px auto 12px;
  padding: clamp(20px, 5vw, 32px);
  background: #2c2c33;
  border: 1px solid rgba(249, 244, 218, 0.12);
  border-radius: 18px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.15);

  [role='alert'] {
    color: #ffb2c0;
  }

  h2 {
    font-family: inherit;
    font-size: 1.5rem;
    margin: 0 0 10px;
    text-align: left;
    font-weight: 600;
  }

  input[type='password'],
  input[type='text'] {
    padding-right: 52px;
  }
`;

const PasswordField = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px;

  label {
    grid-column: 1 / -1;
  }
  input {
    grid-column: 1 / -1;
    grid-row: 2;
  }
`;

const RevealButton = styled.button`
  grid-column: 2;
  grid-row: 2;
  align-self: start;
  margin-top: 9px;
  z-index: 1;
  width: 44px;
  min-height: 44px;
  padding: 0;
  background: transparent;
  color: var(--offWhite);
  && {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0;
    &:hover,
    &[aria-pressed='true'] {
      background: rgba(123, 94, 166, 0.18);
      border-color: rgba(189, 162, 227, 0.3);
    }
  }
`;

const MessageField = styled.div`
  display: flex;

  gap: 10px;
  background-color: var(--lightBlack);
  border: 1px solid rgba(21, 170, 147, 0.35);
  border-radius: 10px;
  margin: 25px auto;
  padding: 10px 20px;
  box-sizing: border-box;
  width: calc(100% - 32px);
  max-width: 440px;
  text-align: left;
  align-items: center;

  svg {
    flex-shrink: 0;
  }

  p {
    margin: 0;
  }
`;

function SignUp({ resetPassword = false }: { resetPassword?: boolean }) {
  const {
    user,
    signIn,
    signUp,
    isLoading,
    authError,
    setAuthError,
    requestPasswordReset,
    updatePassword,
  } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [togglePassword, setTogglePassword] = useState<boolean>(false);
  const [toggleConfirmPassword, setToggleConfirmPassword] = useState<boolean>(false);
  const navigate = useNavigate();
  const [invalidResetLink] = useState(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const query = new URLSearchParams(window.location.search);
    return resetPassword && (params.has('error') || params.has('error_code') || query.has('error'));
  });
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'reset'>(
    resetPassword ? 'reset' : 'login'
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setError('');
    setAuthError('');
    setMessage('');
    if (mode === 'forgot') {
      const result = await requestPasswordReset(email);
      if (!result.success) {
        setError(result.error || 'Unable to send reset email. Please try again.');
        return;
      }
      setMessage(
        'If an account exists for this email, you’ll receive a password reset link shortly. Check your spam folder too.'
      );
      setShowForm(false);
      return;
    }
    if (mode === 'reset') {
      if (!user || invalidResetLink) {
        setError('Request a new password reset link to continue.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      const result = await updatePassword(password);
      if (!result.success) {
        setError(
          result.error || 'Unable to update your password. Request a new link and try again.'
        );
        return;
      }
      setPassword('');
      setConfirmPassword('');
      setMessage('Your password has been updated. You can return to your movies.');
      setShowForm(false);
      return;
    }
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
        showToast(authError || loginError || 'Unable to sign in. Please try again.', false);
        return;
      }
      showToast("You're signed in!", true);
      navigate('/');
    } else {
      const { success, error: loginError } = await signUp(email, password);
      if (!success) {
        setError(loginError ?? 'unknown error');
        showToast(
          authError || loginError || 'Unable to create your account. Please try again.',
          false
        );
        return;
      }
      showToast('Account created. Check your email to confirm your account.', true);
      setMessage('Check your email for a confirmation link to finish creating your account.');
      setShowForm(false);
    }
  };

  const secondaryAction = (!showForm || mode !== 'reset') && (
    <ToggleButton
      className="no-hover"
      disabled={isLoading}
      onClick={() => {
        if (mode === 'reset') {
          navigate('/');
          return;
        }
        setMode(mode === 'login' && showForm ? 'signup' : 'login');
        setShowForm(true);
        setMessage('');
        setPassword('');
        setConfirmPassword('');
        setError(null);
        setAuthError('');
      }}
    >
      {mode === 'reset'
        ? 'Go to my movies'
        : mode === 'login' && showForm
          ? 'Sign up for an account'
          : 'Back to sign in'}
      <CaretDoubleRightIcon size={24} />
    </ToggleButton>
  );

  return (
    <>
      <div>
        <AuthForm onSubmit={handleSubmit} aria-busy={isLoading} hidden={!showForm}>
          {showForm && (
            <>
              <h2>
                {mode === 'forgot'
                  ? 'Forgot password?'
                  : mode === 'reset'
                    ? 'Set a new password'
                    : mode === 'login'
                      ? 'Welcome back'
                      : 'Create an account'}
              </h2>
              <FormHint>
                {mode === 'forgot'
                  ? 'Enter your email and we’ll send you a reset link.'
                  : mode === 'reset'
                    ? 'Choose a new password for your account.'
                    : mode === 'login'
                      ? 'Sign in to pick up your watchlist.'
                      : 'Keep your next great movie in one place.'}
              </FormHint>
              {mode !== 'reset' && (
                <div>
                  <label htmlFor="email">
                    <FinnTheHumanIcon size={24} />
                    Email
                  </label>
                  <input
                    required
                    name="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    autoComplete="email"
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              )}
              {mode !== 'forgot' && (
                <PasswordField>
                  <label htmlFor="password">
                    <PasswordIcon size={24} />
                    Password
                  </label>
                  <input
                    required
                    name="password"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    id="password"
                    type={togglePassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <RevealButton
                    className="no-hover"
                    aria-label={togglePassword ? 'Hide password' : 'Show password'}
                    aria-pressed={togglePassword}
                    type="button"
                    onClick={() => setTogglePassword(prev => !prev)}
                  >
                    {togglePassword ? <EyeClosedIcon size={24} /> : <EyeIcon size={24} />}
                  </RevealButton>
                </PasswordField>
              )}
              {(mode === 'signup' || mode === 'reset') && (
                <>
                  <PasswordField>
                    <label htmlFor="confirmPassword">
                      <PasswordIcon size={24} />
                      Confirm Password
                    </label>
                    <input
                      required
                      name="confirmPassword"
                      aria-invalid={Boolean(confirmPassword && confirmPassword !== password)}
                      aria-describedby={
                        confirmPassword && confirmPassword !== password
                          ? 'password-match'
                          : undefined
                      }
                      autoComplete="new-password"
                      id="confirmPassword"
                      type={toggleConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <RevealButton
                      className="no-hover"
                      aria-label={
                        toggleConfirmPassword
                          ? 'Hide confirmation password'
                          : 'Show confirmation password'
                      }
                      aria-pressed={toggleConfirmPassword}
                      type="button"
                      onClick={() => setToggleConfirmPassword(prev => !prev)}
                    >
                      {toggleConfirmPassword ? <EyeClosedIcon size={24} /> : <EyeIcon size={24} />}
                    </RevealButton>
                  </PasswordField>
                  {confirmPassword && confirmPassword !== password && (
                    <FormError id="password-match">Passwords don’t match yet.</FormError>
                  )}
                </>
              )}
              {mode === 'reset' && !isLoading && (!user || invalidResetLink) && (
                <FormError>
                  This reset link is invalid or has expired. Request a new link to continue.
                </FormError>
              )}
              {(authError || error) && <FormError>{authError || error}</FormError>}
              <SubmitButton
                type="submit"
                disabled={isLoading || (mode === 'reset' && (!user || invalidResetLink))}
              >
                {mode === 'forgot'
                  ? isLoading
                    ? 'Sending link'
                    : 'Send reset link'
                  : mode === 'reset'
                    ? isLoading
                      ? 'Updating password'
                      : 'Update password'
                    : isLoading
                      ? mode === 'login'
                        ? 'Logging In'
                        : 'Signing Up'
                      : mode === 'login'
                        ? 'Login'
                        : 'Sign Up'}
                {isLoading ? <Loader size={'small'} /> : <FilmSlateIcon size={24} />}
              </SubmitButton>
              {mode === 'login' && (
                <ToggleButton
                  className="no-hover"
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    setMode('forgot');
                    setError(null);
                    setAuthError('');
                  }}
                >
                  Forgot password?
                  <KeyIcon size={20} />
                </ToggleButton>
              )}
            </>
          )}
          {showForm && secondaryAction}
        </AuthForm>
        {message && (
          <MessageField role="status">
            <>
              <ConfettiIcon size={24} />
              {message}
            </>
          </MessageField>
        )}
        {mode === 'reset' && showForm && !isLoading && !user && (
          <ToggleButton
            className="no-hover"
            onClick={() => {
              navigate('/login');
            }}
          >
            Request a new reset link from sign in
          </ToggleButton>
        )}
        {!showForm && secondaryAction}
      </div>
    </>
  );
}
export default SignUp;
