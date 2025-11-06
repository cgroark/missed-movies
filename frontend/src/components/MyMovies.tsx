import { useState, useEffect, act } from 'react';
import styled from 'styled-components';
import { Link, useSearchParams } from 'react-router-dom';
import { FilmStripIcon } from '@phosphor-icons/react';
import { useMovies } from '../context/MoviesContext';
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
  display: flex;
  margin: auto;
  gap: 5px;
  align-items: center;
  transition: all 0.3s ease;
  padding: 1.4rem 2.4rem;

  &.active, &:hover {
    background-color: var(--pink);
    color: var(--lightBlack);
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

function MyMovies() {
  const { movies, isLoading, error, getMovies, activeCategory, setActiveCategory, status, setStatus, sortBy, setSortBy } = useMovies();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
  const [modalAction, setModalAction] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<category[]>([]);
  // const [activeCategory, setActiveCategory] = useState<number | null>(1);
  const [categoryLoading, setLoading] = useState<boolean>(false);
  // const [sortBy, setSortBy] = useState<SortOption>(sortOptions[0]);
  // const [status, setStatus] = useState<number>(0);

  useEffect(() => {
    const categoryParam = Number(searchParams.get('category')) || 1;
    const statusParam = Number(searchParams.get('status')) || 1;
    const sortByKeyParam = searchParams.get('sortBy') || 'title';
    const ascendingParam = searchParams.get('asc') === 'true';
    console.log('asc', ascendingParam)

    const currentSort = sortOptions.find((each) => each.key === sortByKeyParam && each.ascending === ascendingParam);
    if (currentSort) setSortBy(currentSort);
    setActiveCategory(categoryParam);
    setStatus(statusParam);

    getMovies(categoryParam, currentSort, statusParam);

  }, [searchParams])

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if(!res.ok) throw new Error('Category error');
        const data = await res.json();
        setCategories(data);
      } catch (err: any) {
          console.log('err', err);
      } finally {
        setLoading(false);
      }
    }
    getCategories();
  }, [])

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

  const handleAfterSave = async () => {
    await getMovies(activeCategory, sortBy, status);
    setOpen(false);
  };

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value);
    const selectedSort = sortOptions.find(opt => opt.value === selectedValue);
    if (selectedSort) {
      setSortBy(selectedSort);
          console.log('sel status', selectedSort)

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
      {!categoryLoading && categories.length && (
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
          </CategoryList>
        </div>
      )}
      {isLoading && <Loader size='large' /> }
      {!isLoading && (
        movies.length ?
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

          <MovieList movies={movies} onAdd={handleAdd} onEdit={handleEdit}/>
        </>
         :
        <>
        <p>No movies in this category yet</p>
        <StyledLink to='/search'>
          Find movies
          <FilmStripIcon size={24} />
        </StyledLink>
        </>
      )}
      {open && (
        <Modal
          open={open}
          movie={selectedMovie || ({} as movie)}
          action={modalAction}
          onOpenChange={setOpen}
          onAfterSave={handleAfterSave}
        />
      )}
    </>
  )
}

export default MyMovies;