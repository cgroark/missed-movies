import { NavLink } from "react-router-dom";
import styled from "styled-components";
import '../index.css';

import {MagnifyingGlassPlusIcon, FilmStripIcon} from '@phosphor-icons/react';


const Nav = styled.nav`
  display: flex;
  justify-content: center;

  @media (max-width: 576px) {
    justify-content: center;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding-left: 0;
  display: flex;
  gap: 15px;
`;

const NavItem = styled.li`
  display: inline-block;

  @media (max-width: 768px) {
    padding-left: 10px;
    font-size: 14px;
  }
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
  font-size: 20px;

  &:hover {
    color: var(--offWhite);
    border-bottom: 4px solid var(--teal);
  }

  &.active {
    border-bottom: 4px solid var(--pink);
  }
`;

function Navbar() {
    return (
        <Nav>
          <NavList>
            <NavItem>
              <StyledNavLink to="/" end>
                Your Movies<FilmStripIcon size={24} />
              </StyledNavLink>
            </NavItem>
            <NavItem>
              <StyledNavLink to="/search">
                Find Movies<MagnifyingGlassPlusIcon size={24} />
              </StyledNavLink>
            </NavItem>
          </NavList>
        </Nav>
    )
}

export default Navbar;