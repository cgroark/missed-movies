import styled, { keyframes } from 'styled-components';

interface LoaderProps {
  size?: 'small' | 'large';
}

const spin = keyframes`
  0% {transform: rotate(0deg)}
  100% {transform: rotate(360deg)}
`;

const LoadingBlock = styled.div<LoaderProps>`
  display: block;
  margin: auto;
  vertical-align: text-bottom;
  border: 0.12em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  -webkit-animation: ${spin} 0.75s linear infinite;
  animation: ${spin} 0.75s linear infinite;
  width: ${({ size }) => (size === 'small' ? '1.28rem' : '5rem')};
  height: ${({ size }) => (size === 'small' ? '1.28rem' : '5rem')};
`;

function Loader({ size = 'large' }: LoaderProps) {
  return <LoadingBlock size={size}></LoadingBlock>;
}

export default Loader;
