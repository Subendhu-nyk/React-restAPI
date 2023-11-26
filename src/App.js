import React, { useState,useEffect,useCallback } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import load from './components/load.gif'
import AddMovie from './components/AddMovie';

function App() {
  const [movies,setMovies]=useState([]);
  const [isLoading,setIsLoading]=useState(false)
  const [error,setError]=useState(null)
 

  // function fetchMoviesHandler(){
    // through promises
    // fetch('https://swapi.dev/api/films/')
    // .then((response)=>{
    //   return response.json();
    // })
    // .then((data)=>{
    //   const transformedMovies= data.results.map(movieData=>{
    //     return {
    //       id:movieData.episode_id,
    //       title:movieData.title,
    //       openingText:movieData.opening_crawl,
    //       releaseData:movieData.release_date
    //     };
    //   })
    //   setMovies(transformedMovies)
    // })
  // }

   const fetchMoviesHandler =  useCallback(async ()=> {    
    setIsLoading(true)
    setError(null)
    try{
      const response= await fetch('https://swapi.dev/api/films/')
   const data= await response.json();  
      
      if(!response.ok){
        throw new Error('something went wrong')
      }
      const transformedMovies= data.results.map(movieData=>{
        return {
          id:movieData.episode_id,
          title:movieData.title,
          openingText:movieData.opening_crawl,
          releaseData:movieData.release_date
        };
      })
      setMovies(transformedMovies)   
     
    }
    catch(error){
      setError(error.message)
    }
    setIsLoading(false)
  },[]);

   useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler])

  function addMovieHandler(movie){
    console.log(movie)
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
       {!isLoading && movies.length>0 && <MoviesList movies={movies} />}
       {!isLoading && movies.length===0 && !error && <p>Found no movies</p>}
       {!isLoading && error && <p>{error}</p>}
       {isLoading && <img src={load} alt='loading'/>}
      </section>
    </React.Fragment>
  );
}

export default App;
