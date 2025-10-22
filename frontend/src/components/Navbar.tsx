import { NavLink } from "react-router-dom";
import styled from "styled-components";
import {MagnifyingGlassPlusIcon, FilmStripIcon} from '@phosphor-icons/react';
import '../index.css';
import Logout from "./Logout";


const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(315deg, var(--purple) 25%, var(--teal));
  display: flex;
  justify-content: center;
  padding: 0 20px;
  margin-bottom: 50px;

  @media (max-width: 576px) {
    justify-content: center;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding-left: 0;
  display: flex;
  gap: 15px;
  max-width: 1280px;
  justify-content: end;
  width: 100%;
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
  font-size: clamp(.75rem, 3vw + .25rem, 1);


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
            <NavItem>
              <Logout />
            </NavItem>
          </NavList>
        </Nav>
    )
}

export default Navbar;