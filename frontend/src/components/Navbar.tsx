import { NavLink } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  justify-content: end;

  @media (max-width: 576px) {
    justify-content: center;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const NavItem = styled.li`
  display: inline-block;
  padding-left: 25px;

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

  @media (max-width: 768px) {
    gap: 2px;

    svg {
      width: 20px !important;
      height: 20px !important;
    }
  }
`;

function Navbar() {
    return (
        <Nav>
          <NavList>
            <NavItem>
              <StyledNavLink to="/" end>
                Home
              </StyledNavLink>
            </NavItem>
            <NavItem>
              <StyledNavLink to="/sign-up">
                Sign Up
              </StyledNavLink>
            </NavItem>
          </NavList>
        </Nav>
    )
}

export default Navbar;