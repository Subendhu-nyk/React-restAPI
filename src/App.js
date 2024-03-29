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
      const response= await fetch('https://react-http-6e598-default-rtdb.firebaseio.com/movies.json/')
    if(!response.ok){
        throw new Error('something went wrong')
      }
      
      const data= await response.json();  
      const loadedMovies=[]

      for(const key in data){
        loadedMovies.push({
          id:key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseData:data[key].releaseData,
        })
      }
     
      
      setMovies(loadedMovies)   
     
    }
    catch(error){
      setError(error.message)
    }
    setIsLoading(false)
  },[]);

   useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler])

  async function addMovieHandler(movie){
    const response=await fetch('https://react-http-6e598-default-rtdb.firebaseio.com/movies.json',{
      method:'POST',
      body:JSON.stringify(movie),
      headers:{
        'Content-Type':'application/json'
      }
    })
    const data=await response.json()
    console.log(data)
  }
  const deleteMovieHandler = async (id) => {
    console.log("id>>>",id)
    const deleteUrl = `https://react-http-6e598-default-rtdb.firebaseio.com/movies/${id}.json`;

    try {
     
      const response = await fetch(deleteUrl, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Could not delete movie.');
      }

      
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
       {!isLoading && movies.length>0 && <MoviesList movies={movies} onDelete={deleteMovieHandler} />}
       {!isLoading && movies.length===0 && !error && <p>Found no movies</p>}
       {!isLoading && error && <p>{error}</p>}
       {isLoading && <img src={load} alt='loading'/>}
      </section>
    </React.Fragment>
  );
}

export default App;
