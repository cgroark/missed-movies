import {FilmReelIcon} from '@phosphor-icons/react';
import styled from 'styled-components';
import { useAuth } from "../context/AuthContext";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Heading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  font-size: 30px;
`

const GradientHeading = styled.h1`
  background: linear-gradient(315deg, var(--teal) 25%, var(--purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  font-size: clamp(3.5rem, 4vw + 2rem, 6rem);
  margin: 0;
  text-align: center;
  padding: 0 10px;
`;

const SubHeading = styled.h2`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  padding: 0 10px;
  font-size: clamp(1rem, 4vw + .5rem, 2rem);
`

const Line = styled.hr`
  background: linear-gradient(315deg, var(--teal) 25%, var(--purple));
  height: 6px;
  border: 0;

`

function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
  return (
    <>
      {user && !isLoginPage && <Navbar />}
      <div style={{marginBottom: '50px'}}>
        <Heading>
          <GradientHeading style={{margin: 0}}>Missed Movies</GradientHeading>
        </Heading>
        <SubHeading>
          Keep track of all those movies you've been meaning to watch <FilmReelIcon size={40} />
        </SubHeading>
        <Line ></Line>
      </div>

    </>
  )
}

export default Header;