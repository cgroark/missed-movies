import { useState, useEffect, useRef } from 'react';
import { FilmReelIcon } from '@phosphor-icons/react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface NavbarWrapperProps {
  scrolled: boolean;
}

const HeaderSection = styled.header<{ $compact: boolean }>`
  background:
    radial-gradient(ellipse at 85% 0%, rgba(123, 94, 166, 0.5), transparent 65%),
    radial-gradient(ellipse at 10% 100%, rgba(21, 170, 147, 0.13), transparent 60%),
    var(--lightBlack);
  border-bottom: 1px solid rgba(249, 244, 218, 0.06);
  margin-bottom: 50px;
  min-height: 260px;
  height: 36vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 576px) {
    min-height: 210px;
    height: 28vh;
    margin-bottom: 20px;
  }

  ${({ $compact }) =>
    $compact &&
    `
    && {
      height: 20vh;
      min-height: 120px;
      margin-bottom: 24px;
    }
    h1 { margin-top: 0; }
  `}
`;
const Heading = styled.div`
  display: flex;
  justify-content: center;
`;
const GradientHeading = styled.h1`
  background: linear-gradient(120deg, #6dd4bf 10%, #bda2e3 70%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: clamp(2rem, 10vw + 0.5rem, 7.5rem);
  letter-spacing: -0.025em;
  margin: 20px 0 0;
  padding: 0 20px;
`;

const SubHeading = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 0 20px;
  color: rgba(249, 244, 218, 0.75);
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  font-size: clamp(1rem, 3vw + 0.5rem, 1.5rem);
`;

const NavbarWrapper = styled.nav.withConfig({
  shouldForwardProp: prop => prop !== 'scrolled',
})<NavbarWrapperProps>`
  position: sticky;
  top: env(safe-area-inset-top, 0px);
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(249, 244, 218, 0.1);
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  transition: background 0.5s ease;

  background: ${({ scrolled }) => (scrolled ? 'rgba(33, 33, 40, 0.94)' : 'rgba(40, 44, 52, 0.96)')};

  @media (max-width: 576px) {
    display: none;
  }
`;

function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = ['/login', '/reset-password'].includes(location.pathname);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const headerBottom = headerRef.current.offsetHeight;
      setScrolled(window.scrollY >= headerBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {user && !isLoginPage && (
        <NavbarWrapper scrolled={scrolled} aria-label="Main navigation">
          <Navbar />
        </NavbarWrapper>
      )}
      <HeaderSection ref={headerRef} $compact={isLoginPage}>
        <Heading>
          <GradientHeading>Missed Movies</GradientHeading>
        </Heading>
        {!isLoginPage && (
          <SubHeading>
            Keep track of all those movies you've been meaning to watch <FilmReelIcon size={40} />
          </SubHeading>
        )}
      </HeaderSection>
    </>
  );
}

export default Header;
