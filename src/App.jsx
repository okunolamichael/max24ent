import React, { useEffect, useState } from 'react';
import Search from './components/Search';

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

  const fetchMovies = async () => {
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    }
  };

  useEffect(() => {
    fetchMovies(); // Fixed typo: "fatchMovies" -> "fetchMovies"
  }, []); // Removed "deps" since it was undefined; empty array means run once on mount

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

        <section>
          <h2>All Movies</h2>
          {errorMessage && <p className="error">{errorMessage}</p>}
        </section>
      </div>
    </main>
  );
};

export default App;