import { Link } from 'react-router-dom';
import { FilmStripIcon } from '@phosphor-icons/react';
import MobileNavigation from '../layout/MobileNavigation';
import Logout from '../auth/Logout';
import Search from './Search';
import TopMovies from './TopMovies';

function FindMovies() {
  return (
    <>
      <Search />
      <TopMovies />
      <MobileNavigation $mobileOnly aria-label="Movie actions">
        <Link className="mobile-nav-item" to="/">
          <span>My Movies</span> <FilmStripIcon size={24} />
        </Link>
        <div className="mobile-logout">
          <Logout className="mobile-nav-item" />
        </div>
      </MobileNavigation>
    </>
  );
}

export default FindMovies;
