import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {MagnifyingGlassPlusIcon, FilmStripIcon} from '@phosphor-icons/react';
import '../index.css';
import Logout from "./Logout";

const NavList = styled.ul`
  list-style: none;
  padding-left: 0;
  display: flex;
  gap: 15px;
  max-width: 1280px;
  justify-content: end;
  width: 100%;
  max-width: 1280px;


  @media (max-width: 576px) {
    gap: 10px;
    justify-content: center;
  }
`;

const NavItem = styled.li`
  display: inline-block;
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  display: flex;
  gap: 4px;
  align-items: center;
  border-bottom: 4px solid transparent;
  transition: border-bottom 0.3s ease;
  padding-bottom: 3px;
  color: var(--offWhite);
  font-weight: 500;
  font-size: clamp(.9rem, 2.5vw + .25rem, 1rem);

  &:hover {
    color: var(--offWhite);
    border-bottom: 4px solid var(--teal);
  }

  &.active {
    border-bottom: 4px solid var(--pink);
  }

  @media (max-width: 576px) {
    gap: 3px;
  }
`;

function Navbar() {
    return (
      <NavList>
        <NavItem>
          <StyledNavLink to="/" end>
            My Movies<FilmStripIcon size={24} />
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <StyledNavLink to="/search">
            Find Movies<MagnifyingGlassPlusIcon size={24} />
          </StyledNavLink>
        </NavItem>
        <NavItem>
          <Logout />
        </NavItem>
      </NavList>
    )
}

export default Navbar;