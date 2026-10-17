import { css } from 'styled-components';
import { actionButtonStyles } from './ButtonStyles';

export const floatingActionStyles = css`
  @media (min-width: 577px) {
    && {
      ${actionButtonStyles}
    }
  }
`;

export const tealFloatingActionStyles = css`
  ${floatingActionStyles}
  @media (min-width: 577px) {
    && {
      background: #1c4842;
      border-color: rgba(70, 213, 187, 0.4);
      &:hover:not(:disabled),
      &[data-state='open'] {
        background: #245c53;
        border-color: rgba(70, 213, 187, 0.65);
      }
    }
  }
`;
