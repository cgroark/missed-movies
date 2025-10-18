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
`

function Header() {
    const { user } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";
  return (
    <>
      <div style={{marginBottom: '50px'}}>
        <Heading>
          <h1 style={{margin: 0}}>Missed Movies</h1>
          <FilmReelIcon size={48} />
        </Heading>
      <p>Keep track of all those movies you've been meaning to watch</p>
      </div>
      {user && !isLoginPage && <Navbar />}
    </>
  )
}

export default Header;