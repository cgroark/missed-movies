import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

/** Decorative placeholder; give its loading container an accessible status label. */
const Skeleton = styled.div.attrs({ 'aria-hidden': true })<{
  $width?: string;
  $height?: string;
  $radius?: string;
}>`
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '1em'};
  border-radius: ${({ $radius }) => $radius ?? '4px'};
  background: rgba(150, 150, 150, 0.25);
  animation: ${pulse} 1.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export default Skeleton;
