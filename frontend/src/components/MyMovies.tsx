import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import { FilmStripIcon, FunnelIcon, NotePencilIcon } from '@phosphor-icons/react';
import * as Popover from '@radix-ui/react-popover';
import { useMovies } from '../context/MoviesContext';
import { useCategories } from '../context/CategoriesContext';
import type { movie, category, SortOption, StatusOption } from '../types/types';
import MovieList from './MovieList';
import Modal from './Modal';
import Loader from './Loader';
import '../index.css';

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

const CategoryList = styled.ul`
  padding: 0 20px;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 40px;
`

const CategoryButton = styled.button`
  background-color: var(--darkGray);
  box-shadow: 3px 3px 3px var(--teal) ;

  &.active, &:hover {
    background-color: var(--pink) !important;
    color: var(--lightBlack);
    box-shadow: 3px 3px 3px var(--offWhite) ;
  }
`

const StyledLink = styled(Link)`
  background-color: var(--teal);
  display: flex;
  margin: 25px auto 10px;
  gap: 5px;
  align-items: center;
  border-radius: 8px;
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
`

const Select = styled.select`
  text-align: left;
  margin: 5px 0 20px 10px;
  border-radius: 4px;
  border: 1px solid var(--lightBlack);
  background-color: white;
  color: var(--lightBlack);
  min-height: 30px;
  padding: 5px;
  min-width: 150px;
`

const FilterSection = styled.div`
  display: flex;
  justify-content: end;
  align-items: baseline;
  padding: 0 20px;
  gap: 10px;
  max-width: 1280px;
`
const FilterButton = styled(Popover.Trigger)`
  background-color: var(--teal);
  margin-left: auto;

  &:hover {
     background-color: var(--darkTeal);
  }

  &:disabled {
    background-color: lightgrey;
  }
`;

const FilterContent = styled(Popover.Content)`
  background: var(--lightBlack);
  border: 2px solid var(--offWhite);
  border-radius: 8px;
  padding: 15px;
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
`
function MyMovies() {
  const { movies, isLoading, error, getMovies, activeCategory, setActiveCategory, status, setStatus, sortBy, setSortBy, rangeFrom, setRangeFrom, rangeTo, setRangeTo } = useMovies();
  const { categories, categoryError, getCategories } = useCategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'edit' | 'category'>('add');
  const [open, setOpen] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);


  const loaderRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const categoryParam = Number(searchParams.get('category')) || 1;
    const statusParam = Number(searchParams.get('status'));
    const sortByKeyParam = searchParams.get('sortBy') || 'title';
    const ascendingParam = searchParams.get('asc') === 'true';

    const currentSort = sortOptions.find((each) => each.key === sortByKeyParam && each.ascending === ascendingParam);
    if (currentSort) setSortBy(currentSort);
    setActiveCategory(categoryParam);
    setStatus(statusParam);
    setIsInitialLoading(true);

    getMovies(rangeFrom, rangeTo, categoryParam, currentSort, statusParam)
      .finally(() => setIsInitialLoading(false));
    ;
  }, [searchParams]);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      const first = entries[0];
      if(first.isIntersecting) {
        setRangeFrom((prevFrom) => prevFrom + 6);
        setRangeTo((prevTo) => prevTo + 6);
      }
    },
    {threshold: 0.5}
    );
    const currentLoader = loaderRef.current;
    const currentObserver = observerRef.current;

    if (currentLoader && currentObserver) currentObserver.observe(currentLoader);

    return () => {
      if (currentLoader && currentObserver) currentObserver.unobserve(currentLoader);
    };
  }, [hasMore, isFetchingMore, isLoading]);

  useEffect(() => {
    if (rangeFrom === 0 && rangeTo === 11) return;
    if (isFetchingMore || !hasMore) return;

    const fetchMore = async () => {
      setIsFetchingMore(true);

      const newMovies = await getMovies(rangeFrom, rangeTo, activeCategory, sortBy, status);

      if (newMovies.length < 6) {
        setHasMore(false);
        if(loaderRef.current) observerRef.current?.unobserve(loaderRef.current);
      }
      setIsFetchingMore(false);
    }

    fetchMore();
  }, [rangeTo]);

 useEffect(() => {
  setHasMore(true);
  setIsFetchingMore(false);
  setRangeFrom(0);
  setRangeTo(11);

  if (observerRef.current && loaderRef.current) {
    observerRef.current.observe(loaderRef.current);
  }
}, [activeCategory, sortBy, status]);

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
  }

  const handleAfterSave = async () => {
    await getMovies(rangeFrom, rangeTo, activeCategory, sortBy, status);
    setOpen(false);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value);
    const selectedSort = sortOptions.find(opt => opt.value === selectedValue);
    if (selectedSort) {
      setSortBy(selectedSort);

      setSearchParams(
        {
          sortBy: selectedSort.key,
          asc: String(selectedSort.ascending),
          category: String(activeCategory),
          status: String(status),
        }
      )
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = Number(e.target.value);
    setStatus(selectedStatus);
    setSearchParams(
      {
        sortBy: sortBy.key,
        asc: String(sortBy.ascending),
        category: String(activeCategory),
        status: String(selectedStatus),
      }
    )
  }

  const handleCategoryChange = (id: number) => {
    console.log('NEW CHEK', movies, isLoading)

    setActiveCategory(id);
    setSearchParams(
      {
        sortBy: sortBy.key,
        asc: String(sortBy.ascending),
        category: String(id),
        status: String(status),
      }
    )
  };

  return (
    <>
      {categories.length > 0 && (
        <div>
          <CategoryList>
            {categories.map((each: category) =>
              <li key={each.id}>
                <CategoryButton
                  onClick={() => handleCategoryChange(each.id)}
                  className={ activeCategory === each.id ? 'active' : ''}
                >
                  {each.name}
                </CategoryButton>
              </li>
            )}
            <li>
              <button
                className='slimmer'
                onClick={handleEditCategory}>
                {categories.length > 1 ? 'Edit Categories' :
                'Add Category'}<NotePencilIcon size={24} />
              </button>
            </li>
          </CategoryList>
            {categoryError &&
        <ErrorField>{categoryError}</ErrorField>
      }
          <div style={{maxWidth: '1280px', margin: 'auto',  padding: '0 20px'}}>
          <Popover.Root>
          <FilterButton className='slimmer' disabled={isLoading}>
            {isLoading ? <Loader size='small' /> : <FunnelIcon size={24} />}
            Filters
          </FilterButton>
            <Popover.Portal>
              <FilterContent align="end" sideOffset={8}>
                <>
                <FilterSection>
                  <label htmlFor='sort'>Sort by:</label>
                  <Select id='sort' value={sortBy.value} onChange={handleSort}>
                    {sortOptions.map((each) =>
                      <option key={each.value} value={each.value}>{each.label}</option>
                    )}
                  </Select>
                </FilterSection>

                <FilterSection>
                  <label htmlFor='status'>Status:</label>
                  <Select id='status' value={status} onChange={handleStatusChange}>
                    {statusOptions.map((each) =>
                      <option key={each.value} value={each.value}>{each.label}</option>
                    )}
                  </Select>
                </FilterSection>
                </>

              </FilterContent>
            </Popover.Portal>
          </Popover.Root>
        </div>
        </div>
      )}
      {isInitialLoading && <Loader size='large' /> }
      {movies.length > 0  && !isInitialLoading && (
        <>
          <MovieList movies={movies} onAdd={handleAdd} onEdit={handleEdit}/>
          <div ref={loaderRef} style={{ height: '40px' }} />
        </>
        )
      }
      {!isLoading && movies.length === 0 &&
        (
          <>
          <p>No movies in this category yet</p>
          <StyledLink to='/search'>
            Find movies
            <FilmStripIcon size={24} />
          </StyledLink>
          </>
        )
      }
      {isFetchingMore && <Loader size='small' />}
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
  )
}

export default MyMovies;