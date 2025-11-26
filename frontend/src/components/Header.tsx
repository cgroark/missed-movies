import { useState, useEffect, useRef } from 'react';
import { FilmReelIcon } from '@phosphor-icons/react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

interface NavbarWrapperProps {
  scrolled: boolean;
}

const HeaderSection = styled.header`
  background: linear-gradient(255deg, var(--purple) 5%, var(--lightBlack));
  margin-bottom: 50px;
  height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 576px) {
    height: 30vh;
    margin-bottom: 20px;
  }
`;
const Heading = styled.div`
  display: flex;
  justify-content: center;
`;
const GradientHeading = styled.h1`
  background: linear-gradient(315deg, var(--teal) 25%, var(--purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: clamp(2rem, 10vw + .5rem, 7.5rem);
  margin: 0;
  padding: 0 20px;
`;

const SubHeading = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 0 10px;
  font-size: clamp(1rem, 3vw + 0.5rem, 1.5rem);
`;

const NavbarWrapper = styled.nav.withConfig({
  shouldForwardProp: prop => prop !== 'scrolled',
})<NavbarWrapperProps>`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  box-shadow: 0 4px 6px var(--lightBlack60);
  transition: background 0.5s ease;

  background: ${({ scrolled }) =>
    scrolled ? 'linear-gradient(255deg, var(--purple), var(--lightBlack))' : 'var(--lightBlack)'};

  @media (max-width: 576px) {
    justify-content: center;
    padding: 0 10px;
  }
`;

function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
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
        <NavbarWrapper scrolled={scrolled}>
          <Navbar />
        </NavbarWrapper>
      )}
      <HeaderSection ref={headerRef}>
        <Heading>
          <GradientHeading style={{ margin: 0 }}>Missed Movies</GradientHeading>
        </Heading>
        <SubHeading>
          Keep track of all those movies you've been meaning to watch <FilmReelIcon size={40} />
        </SubHeading>
      </HeaderSection>
    </>
  );
}

export default Header;
