import { css } from 'styled-components';

export const actionButtonStyles = css`
  min-height: 44px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(189, 162, 227, 0.4);
  background: #383040;
  color: var(--offWhite);
  font-size: 0.9rem;
  font-weight: 500;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition:
    background-color 160ms ease,
    border-color 160ms ease;

  &:hover:not(:disabled),
  &[data-state='open'] {
    background: #483953;
    border-color: rgba(189, 162, 227, 0.65);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
