import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { MagnifyingGlassPlusIcon, FilmStripIcon } from '@phosphor-icons/react';
import Logout from '../auth/Logout';

const NavList = styled.ul`
  list-style: none;
  padding: 8px 0;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 1280px;
  justify-content: end;
  width: 100%;

  @media (max-width: 576px) {
    gap: 4px;
    justify-content: center;
  }
`;

const NavItem = styled.li`
  display: flex;

  &:last-child {
    margin-left: 8px;
    padding-left: 12px;
    border-left: 1px solid rgba(249, 244, 218, 0.15);
  }

  @media (max-width: 576px) {
    &:last-child {
      margin-left: 0;
      padding-left: 4px;
    }
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  min-height: 44px;
  box-sizing: border-box;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 8px 16px;
  color: var(--offWhite);
  font-weight: 500;
  font-size: 0.95rem;
  transition:
    background-color 160ms ease,
    border-color 160ms ease;

  &:hover {
    background: rgba(249, 244, 218, 0.07);
  }

  &.active {
    background: rgba(123, 94, 166, 0.24);
    border-color: rgba(189, 162, 227, 0.4);
    color: #e2cff9;
  }

  @media (max-width: 576px) {
    gap: 5px;
    padding: 8px;
    font-size: 0.8rem;
    svg {
      width: 19px;
      height: 19px;
    }
  }
`;

function Navbar() {
  return (
    <NavList>
      <NavItem>
        <StyledNavLink to="/" end>
          My Movies
          <FilmStripIcon size={24} />
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <StyledNavLink to="/search">
          Find Movies
          <MagnifyingGlassPlusIcon size={24} />
        </StyledNavLink>
      </NavItem>
      <NavItem>
        <Logout />
      </NavItem>
    </NavList>
  );
}

export default Navbar;
