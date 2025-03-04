import React, { useEffect, useState } from 'react';
import {useDebounce} from 'react-use';
import Search from './components/Search';
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { getTrendingMovies, updateSearchCount } from './appwrite';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term to limit API requests
  // by waiting until the user has stopped typing
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 2000, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpoint = query ? 
      `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` :
      `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      
      if(data.Response === "False") {
        setErrorMessage(data.Error || 'Error fetching movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error loading trending movies: ${error}`);
    }
  };

 // Initial load and search effect
 
//  const loadTrendingMovies = async () => {
//   try {
//     const movies = await getTrendingMovies();
//     // Ensure we set an array even if the response is unexpected
//     setTrendingMovies(Array.isArray(movies) ? movies : []);
//   } catch (error) {
//     console.error('Error loading trending movies:', error);
//     setTrendingMovies([]); // Set empty array on error
//   }
// };
 
 useEffect(() => {
  fetchMovies(debouncedSearchTerm);
}, [debouncedSearchTerm]);

useEffect(() => {
  loadTrendingMovies();
}, []);


  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <h1>
            <img src="./MAXENT24_white.png" alt="" className="w-64" />
            <img src="hero-img.png" alt="" />
            Find <span className="text-gradient">Movie</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>


        {trendingMovies.length > 0 && (
          <section className='trending'>
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}

{/* {(trendingMovies && trendingMovies.length > 0) && (
  <section className='trending'>
    <h2>Trending Movies</h2>
    <ul>
      {trendingMovies.map((movie, index) => (
        <li key={movie.$id}>
          <p>{index + 1}</p>
        </li>
      ))}
    </ul>
  </section>
)} */}

        <section className='all-movies'>
          <h2>All Movies</h2>
          
        {isLoading ? (
          <p className='text-white'><Spinner /></p>
        ) : errorMessage ? (
          <p className='text-red-500'>{errorMessage}</p>
        ) : (
          <ul>
            {movieList.map((movie) => (
              <li>
                <MovieCard key={movie.id} movie={movie}/>
              </li>
            ))}
          </ul>
        )}
        </section>
      </div>
    </main>
  );
};

export default App;