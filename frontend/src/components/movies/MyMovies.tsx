import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { floatingActionStyles, tealFloatingActionStyles } from '../ui/FloatingActionStyles';
import {
  CategoryToolbar,
  CategoryControls,
  CategoryList,
  CategoryButton,
  MediaTypeSwitch,
  MediaTypeButton,
} from '../ui/CategoryTabs';
import { Link, useSearchParams } from 'react-router-dom';
import { FilmStripIcon, FunnelIcon, NotePencilIcon, XIcon } from '@phosphor-icons/react';
import ResponsiveFilters from '../ui/ResponsiveFilters';
import { useMovies } from '../../context/MoviesContext';
import { useCategories } from '../../context/CategoriesContext';
import type { movie, category, SortOption, StatusOption, MediaType } from '../../types/types';
import MovieList from './MovieList';
import MovieListSkeleton from './MovieListSkeleton';
import Modal from '../ui/Modal';
import Loader from '../ui/Loader';
import MobileNavigation from '../layout/MobileNavigation';
import Logout from '../auth/Logout';

const statusOptions: StatusOption[] = [
  { value: 0, label: 'All' },
  { value: 1, label: 'Unwatched' },
  { value: 2, label: 'Watched' },
];

const sortOptions: SortOption[] = [
  { value: 1, key: 'title', label: 'Title A–Z', ascending: true },
  { value: 2, key: 'title', label: 'Title Z–A', ascending: false },
  { value: 3, key: 'release_date', label: 'Release Date ↑', ascending: true },
  { value: 4, key: 'release_date', label: 'Release Date ↓', ascending: false },
];

const tvSortOptions: SortOption[] = [
  { value: 1, key: 'name', label: 'Name A–Z', ascending: true },
  { value: 2, key: 'name', label: 'Name Z–A', ascending: false },
  { value: 3, key: 'first_air_date', label: 'First Air Date ↑', ascending: true },
  { value: 4, key: 'first_air_date', label: 'First Air Date ↓', ascending: false },
];

const ManageCategories = styled.button`
  &&&& {
    flex-shrink: 0;
    min-height: 44px;
    padding: 8px 12px;
    border-radius: 10px;
    background: transparent;
    border: 1px solid transparent;
    border-left-color: rgba(249, 244, 218, 0.15);
    box-shadow: none;
    color: var(--offWhite);
    font-size: 0.8rem;
    gap: 6px;

    &:hover {
      background: rgba(249, 244, 218, 0.06);
    }

    @media (max-width: 576px) {
      width: 44px;
      padding: 8px;
      span {
        display: none;
      }
    }
  }
`;

const StyledLink = styled(Link)`
  background-color: var(--teal);
  text-decoration: none;
  display: flex;
  margin: 25px auto 10px;
  gap: 8px;
  align-items: center;
  border-radius: var(--control-radius);
  box-sizing: border-box;
  min-height: 38.8px;
  justify-content: center;
  border: 1px solid transparent;
  padding: 0.4em 1.4em;
  font-size: 1em;
  font-weight: 500;
  color: var(--offWhite);
  width: fit-content;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--darkTeal);
    color: var(--offWhite);
  }

  &.floater {
    z-index: 200;
    @media (min-width: 577px) {
      right: 10px;
      bottom: 15px;
      position: fixed;
    }
    background-color: var(--purple);
    margin: 0;

    &:hover {
      background-color: var(--darkPurple);
    }
  }
  &.floater {
    ${floatingActionStyles}
  }
`;

const EmptyState = styled.section`
  box-sizing: border-box;
  width: calc(100% - 40px);
  max-width: 560px;
  margin: 32px auto 48px;
  padding: clamp(24px, 5vw, 40px);
  border: 1px solid rgba(249, 244, 218, 0.12);
  border-radius: 18px;
  background: rgba(249, 244, 218, 0.04);
  text-align: center;

  p {
    margin: 0 0 22px;
    color: rgba(249, 244, 218, 0.8);
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const EmptyStateLink = styled(StyledLink)`
  && {
    margin: 0 auto;
    min-height: 44px;
    padding: 8px 16px;
    border-radius: 10px;
    border: 1px solid rgba(70, 213, 187, 0.4);
    background: #1c4842;
    color: var(--offWhite);
    font-size: 0.9rem;
    font-weight: 500;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    transition:
      background-color 160ms ease,
      border-color 160ms ease;

    &:hover {
      background: #245c53;
      border-color: rgba(70, 213, 187, 0.65);
    }
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const FilterClose = styled.button`
  && {
    background: transparent;
    color: var(--darkGray);
    padding: 0;
    min-height: 44px;
    width: 44px;
    margin-right: -10px;
    &:hover {
      background: rgba(123, 94, 166, 0.08);
    }
  }
`;

const FilterCaption = styled.p`
  margin: 0 0 22px;
  color: var(--darkGray);
  font-size: 0.8rem;
  line-height: 1.5;
`;

const FilterFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid rgba(123, 94, 166, 0.16);
  padding-top: 16px;

  span {
    font-size: 0.75rem;
    color: var(--darkGray);
  }
`;

const FilterButton = styled.button`
  z-index: 200;
  @media (min-width: 577px) {
    right: 170px;
    bottom: 15px;
    position: fixed;
  }
  padding: 0.4em 1.4em;
  min-height: 38.8px;
  ${tealFloatingActionStyles}
`;

const ErrorField = styled.div`
  background-color: var(--lightBlack);
  border: solid 2px var(--pink);
  border-radius: 10px;
  width: fit-content;
  margin: 25px auto;
  padding: 10px 25px;

  p {
    margin: 0;
  }
`;

const AppliedFilters = styled.div`
  box-sizing: border-box;
  width: calc(100% - 40px);
  max-width: 1205px;
  margin: -12px auto 22px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  padding: 3px 5px 3px 11px;
  border-radius: 999px;
  border: 1px solid rgba(70, 213, 187, 0.28);
  background: rgba(28, 72, 66, 0.58);
  color: var(--offWhite);
  font-size: 0.76rem;
  line-height: 1.2;

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    min-height: 22px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgba(249, 244, 218, 0.12);
    color: var(--offWhite);
    box-shadow: none;

    &:hover {
      background: rgba(249, 244, 218, 0.24);
    }
  }
`;
function MyMovies() {
  const {
    movies,
    isLoading,
    getMovies,
    activeCategory,
    setActiveCategory,
    status,
    setStatus,
    mediaType,
    setMediaType,
    sortBy,
    setSortBy,
  } = useMovies();
  const { categories, categoryError, getCategories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'edit' | 'category'>('add');
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const categoryValue = searchParams.get('category');
    const categoryParam = categoryValue === null ? 1 : Number(categoryValue);
    const selectedCategory = categoryParam > 0 ? categoryParam : null;
    const statusParam = Number(searchParams.get('status'));
    const mediaTypeParam = searchParams.get('media_type') === 'tv' ? 'tv' : 'movie';
    const sortByKeyParam = searchParams.get('sortBy') || 'title';
    const ascendingParam = searchParams.get('asc') !== 'false';

    const options = mediaTypeParam === 'tv' ? tvSortOptions : sortOptions;
    const currentSort = options.find(
      each => each.key === sortByKeyParam && each.ascending === ascendingParam
    );
    setMediaType(mediaTypeParam);
    setSortBy(currentSort ?? options[0]);
    setActiveCategory(selectedCategory);
    setStatus(statusParam);
    getMovies(selectedCategory ?? undefined, currentSort ?? options[0], statusParam, mediaTypeParam);
  }, [searchParams]);

  useEffect(() => {
    getCategories();
  }, []);

  const handleAdd = (movie: movie) => {
    setModalAction('add');
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleEdit = (movie: movie) => {
    setModalAction('edit');
    setSelectedMovie(movie);
    setOpen(true);
  };

  const handleEditCategory = () => {
    setModalAction('category');
    setSelectedMovie(null);
    setOpen(true);
  };

  const handleAfterSave = async () => {
    await getMovies(activeCategory ?? undefined, sortBy, status);
    setOpen(false);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value);
    const selectedSort = (mediaType === 'tv' ? tvSortOptions : sortOptions).find(
      opt => opt.value === selectedValue
    );
    if (selectedSort) {
      setSortBy(selectedSort);

      setSearchParams({
        sortBy: selectedSort.key,
        asc: String(selectedSort.ascending),
        category: String(activeCategory ?? 0),
        status: String(status),
        media_type: mediaType,
      });
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = Number(e.target.value);
    setStatus(selectedStatus);
    setSearchParams({
      sortBy: sortBy.key,
      asc: String(sortBy.ascending),
      category: String(activeCategory ?? 0),
      status: String(selectedStatus),
      media_type: mediaType,
    });
  };

  const handleCategoryChange = (id: number) => {
    setActiveCategory(id);
    setSearchParams({
      sortBy: sortBy.key,
      asc: String(sortBy.ascending),
      category: String(id),
      status: String(status),
      media_type: mediaType,
    });
  };

  const clearCategoryFilter = () => {
    setActiveCategory(null);
    setSearchParams({
      sortBy: sortBy.key,
      asc: String(sortBy.ascending),
      category: '0',
      status: String(status),
      media_type: mediaType,
    });
  };

  const clearStatusFilter = () => {
    setStatus(0);
    setSearchParams({
      sortBy: sortBy.key,
      asc: String(sortBy.ascending),
      category: String(activeCategory ?? 0),
      status: '0',
      media_type: mediaType,
    });
  };

  const handleMediaTypeChange = (nextType: MediaType) => {
    const options = nextType === 'tv' ? tvSortOptions : sortOptions;
    const nextSort = options[0];
    setMediaType(nextType);
    setSortBy(nextSort);
    setActiveCategory(null);
    setStatus(0);
    setSearchParams({
      sortBy: nextSort.key,
      asc: String(nextSort.ascending),
      category: '0',
      status: '0',
      media_type: nextType,
    });
  };

  return (
    <>
      {categories.length > 0 && (
        <div>
          <CategoryToolbar aria-label="Your saved media">
            <MediaTypeSwitch role="group" aria-label="Show movies or TV shows">
              {([{ value: 'movie', label: 'Movies' }, { value: 'tv', label: 'TV Shows' }] as const).map(tab => (
                <MediaTypeButton
                  key={tab.value}
                  type="button"
                  onClick={() => handleMediaTypeChange(tab.value)}
                  aria-pressed={mediaType === tab.value}
                >
                  {tab.label}
                </MediaTypeButton>
              ))}
            </MediaTypeSwitch>
            <CategoryControls>
              <CategoryList>
                {categories
                  .filter(each => each.id !== null)
                  .map((each: category) => (
                    <li key={each.id}>
                      <CategoryButton
                        onClick={() => handleCategoryChange(each.id!)}
                        aria-pressed={activeCategory === each.id}
                        className={activeCategory === each.id ? 'active' : ''}
                      >
                        {each.name}
                      </CategoryButton>
                    </li>
                  ))}
              </CategoryList>
              <ManageCategories
                type="button"
                onClick={handleEditCategory}
                aria-label={categories.length > 1 ? 'Manage categories' : 'Add category'}
                title={categories.length > 1 ? 'Manage categories' : 'Add category'}
              >
                <NotePencilIcon size={20} />
                <span>{categories.length > 1 ? 'Manage' : 'Add category'}</span>
              </ManageCategories>
            </CategoryControls>
          </CategoryToolbar>
          {(activeCategory !== null || status !== 0) && (
            <AppliedFilters aria-label="Applied filters">
              {activeCategory !== null && (
                <FilterBadge>
                  Category: {categories.find(each => each.id === activeCategory)?.name ?? 'Selected'}
                  <button
                    type="button"
                    aria-label="Remove category filter"
                    title="Remove category filter"
                    onClick={clearCategoryFilter}
                  >
                    <XIcon size={14} />
                  </button>
                </FilterBadge>
              )}
              {status !== 0 && (
                <FilterBadge>
                  Status: {statusOptions.find(each => each.value === status)?.label ?? 'Filtered'}
                  <button
                    type="button"
                    aria-label="Remove watch status filter"
                    title="Remove watch status filter"
                    onClick={clearStatusFilter}
                  >
                    <XIcon size={14} />
                  </button>
                </FilterBadge>
              )}
            </AppliedFilters>
          )}
          {categoryError && <ErrorField>{categoryError}</ErrorField>}
          <MobileNavigation aria-label="Movie actions">
            <StyledLink className="floater mobile-nav-item" to="/search">
              <span>Find titles</span>
              <FilmStripIcon size={24} />
            </StyledLink>
            {categories.length > 0 && (
              <ResponsiveFilters
                trigger={
                  <FilterButton className="teal mobile-nav-item" disabled={isLoading}>
                    {isLoading ? <Loader size="small" /> : <FunnelIcon size={24} />}
                    <span>Filters</span>
                  </FilterButton>
                }
              >
                {close => (
                  <>
                    <FilterHeader>
                      <h3>Refine your collection</h3>
                      <FilterClose type="button" onClick={close} aria-label="Close filters">
                        <XIcon size={20} />
                      </FilterClose>
                    </FilterHeader>
                    <FilterCaption>Find the right movie for your next watch.</FilterCaption>
                    <div>
                      <label htmlFor="sort">Sort by</label>
                      <select id="sort" value={sortBy.value} onChange={handleSort}>
                        {(mediaType === 'tv' ? tvSortOptions : sortOptions).map(each => (
                          <option key={each.value} value={each.value}>
                            {each.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="filter-status">Watch status</label>
                      <select id="filter-status" value={status} onChange={handleStatusChange}>
                        {statusOptions.map(each => (
                          <option key={each.value} value={each.value}>
                            {each.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <FilterFooter>
                      <span>Changes apply instantly</span>
                    </FilterFooter>
                  </>
                )}
              </ResponsiveFilters>
            )}
            <div className="mobile-logout">
              <Logout className="mobile-nav-item" />
            </div>
          </MobileNavigation>
        </div>
      )}
      {isLoading && <MovieListSkeleton />}
      {movies.length > 0 && !isLoading && (
        <>
          <MovieList movies={movies} onAdd={handleAdd} onEdit={handleEdit} />
        </>
      )}
      {!isLoading && movies.length === 0 && (
        <EmptyState aria-label="Empty category">
          <p>No {mediaType === 'tv' ? 'TV shows' : 'movies'} in this category yet.</p>
          <EmptyStateLink to="/search">
            Find titles
            <FilmStripIcon size={24} />
          </EmptyStateLink>
        </EmptyState>
      )}
      {open && (
        <Modal
          open={open}
          movie={selectedMovie || ({} as movie) || null}
          action={modalAction}
          onOpenChange={setOpen}
          onAfterSave={handleAfterSave}
        />
      )}
    </>
  );
}

export default MyMovies;
