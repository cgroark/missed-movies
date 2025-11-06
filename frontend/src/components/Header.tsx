import {FilmReelIcon} from '@phosphor-icons/react';
import styled from 'styled-components';
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const HeaderSection = styled.header`
  margin-bottom: 50px;
  height: 40vh;
  border-bottom: solid 8px teal;
  display: flex;
  flex-direction: column;
  justify-content: center;
`
const Heading = styled.div`
  display: flex;
  justify-content: center;
`
const GradientHeading = styled.h1`
  background: linear-gradient(315deg, var(--teal) 25%, var(--purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: clamp(5rem, 10vw + 1rem, 7.5rem);
  margin: 0;
  padding: 0 20px;
`;

const SubHeading = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 0 20px;
  font-size: clamp(1.2rem, 3vw + .5rem, 1rem);
`

function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
  return (
    <>
      {user && !isLoginPage && <Navbar />}
      <HeaderSection>
        <Heading>
          <GradientHeading style={{margin: 0}}>Missed Movies</GradientHeading>
        </Heading>
        <SubHeading>
          Keep track of all those movies you've been meaning to watch <FilmReelIcon size={40} />
        </SubHeading>
      </HeaderSection>
    </>
  )
}

export default Header;