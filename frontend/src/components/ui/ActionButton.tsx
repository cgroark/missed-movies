import styled from 'styled-components';
import { actionButtonStyles } from './ButtonStyles';

const ActionButton = styled.button<{ $surface?: 'light' | 'dark' }>`
  &&& {
    ${actionButtonStyles}
    ${({ $surface }) =>
      $surface === 'light' &&
      `
      background: #9576b2;
      color: #ffffff;
      border-color: rgba(91, 63, 120, 0.4);
      box-shadow: 0 2px 6px rgba(123, 94, 166, 0.15);
      &:hover:not(:disabled) {
        background: #80609e;
        border-color: rgba(91, 63, 120, 0.6);
      }
    `}
  }
`;

export default ActionButton;
