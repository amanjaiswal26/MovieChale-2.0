// // // //  import axios from "axios"

// // // // export const getNowPlayingMovies = async (req, res) => {
// // // //     try {
// // // //          const { data } = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
// // // //         })
// // // //        const movies = data.results;
// // // // res.json({success: true, movies: movies})
// // // // } catch (error) {
// // // // console.error(error);
// // // // res.json({success: false, message: error.message})
// // // // }
// // // // }
// // // import axios from "axios";
// // // import Movie from "../models/Movie.js";
// // // import Show from "../models/Show.js";

// // // export const getNowPlayingMovies = async (req, res) => {
// // //   try {
// // //     const { data } = await axios.get(
// // //       "https://api.themoviedb.org/3/movie/now_playing",
// // //       {
// // //         headers: {
// // //           Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
// // //         },
// // //       }
// // //     );

// // //     const movies = data.results;
// // //     res.json({ success: true, movies });
// // //   } catch (error) {
// // //     console.error(error);
// // //     res.json({ success: false, message: error.message });
// // //   }
// // // };

// // // export const addShow = async (req, res) =>{
// // // try {
// // // const {movieId, showsInput, showPrice} = req.body

// // // let movie = await Movie.findById(movieId)

// // // if(!movie) {
      
// // //   const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
// // // headers: {Authorization : `Bearer ${process.env. TMDB_API_KEY}`} }),

// // // axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
// // // headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`} })
// // // ]);

// // // const movieApiData = movieDetailsResponse.data;
// // // const movieCreditsData = movieCreditsResponse.data;

// // // const movieDetails = {
// // // _id: movieId,
// // // title: movieApiData.title,
// // // overview: movieApiData.overview,
// // // poster_path: movieApiData.poster_path,
// // // backdrop_path: movieApiData.backdrop_path,
// // // genres: movieApiData.genres,
// // // casts: movieCreditsData.cast,
// // // release_date: movieApiData.release_date,
// // // original_language: movieApiData.original_language,
// // // tagline: movieApiData. tagline || "",
// // // vote_average: movieApiData.vote_average,
// // // runtime: movieApiData. runtime,
// // // }
// // // // Add movie to the database
// // // movie = await Movie.create(movieDetails);
// // // }
// // // const showsToCreate = [];
// // // showsInput. forEach(show => {
// // // const showDate = show.date;
// // // show. time. forEach((time)=>{
// // // const dateTimeString = `${showDate}T${time}` ;
// // // showsToCreate. push( {
// // // movie: movieId,
// // // showDateTime: new Date(dateTimeString),
// // // showPrice,
// // // occupiedSeats: {}
// // // })

// // // })

// // // });
// // // if(showsToCreate.length > 0){
// // // await Show.insertMany(showsToCreate);
// // // }
// // // res. json({success: true, message: 'Show Added successfully. '})

// // // } catch (error) {
// // // console.error(error);
// // // res.json({success: false, message: error.message})
// // // }
// // // }
// // import axios from "axios";
// // import Movie from "../models/Movie.js";
// // import Show from "../models/Show.js"; // <-- missing import added

// // export const getNowPlayingMovies = async (req, res) => {
// //   try {
// //     const { data } = await axios.get(
// //       "https://api.themoviedb.org/3/movie/now_playing",
// //       {
// //         headers: {
// //           Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
// //         },
// //       }
// //     );

// //     res.json({ success: true, movies: data.results });
// //   } catch (error) {
// //     console.error(error);
// //     res.json({ success: false, message: error.message });
// //   }
// // };

// // export const addShow = async (req, res) => {
// //   try {
// //     const { movieId, showsInput, showPrice } = req.body;

// //     let movie = await Movie.findById(movieId);

// //     // If movie does not exist in DB, fetch from TMDB
// //     if (!movie) {
// //       const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
// //         axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
// //           headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
// //         }),
// //         axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
// //           headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
// //         }),
// //       ]);

// //       const movieApiData = movieDetailsResponse.data;
// //       const movieCreditsData = movieCreditsResponse.data;

// //       const movieDetails = {
// //         _id: movieId,
// //         title: movieApiData.title,
// //         overview: movieApiData.overview,
// //         poster_path: movieApiData.poster_path,
// //         backdrop_path: movieApiData.backdrop_path,
// //         genres: movieApiData.genres,
// //         casts: movieCreditsData.cast,
// //         release_date: movieApiData.release_date,
// //         original_language: movieApiData.original_language,
// //         tagline: movieApiData.tagline || "",
// //         vote_average: movieApiData.vote_average,
// //         runtime: movieApiData.runtime,
// //       };

// //       movie = await Movie.create(movieDetails);
// //     }

// //     // Build show documents
// //     const showsToCreate = [];
// //     showsInput.forEach((show) => {
// //       const showDate = show.date;
// //       show.time.forEach((time) => {
// //         const dateTimeString = `${showDate}T${time}`;
// //         showsToCreate.push({
// //           movie: movieId,
// //           showDateTime: new Date(dateTimeString),
// //           showPrice,
// //           occupiedSeats: {},
// //         });
// //       });
// //     });

// //     if (showsToCreate.length > 0) {
// //       await Show.insertMany(showsToCreate);
// //     }

// //     res.json({ success: true, message: "Show Added successfully." });
// //   } catch (error) {
// //     console.error(error);
// //     res.json({ success: false, message: error.message });
// //   }
// // };


// // export const getShows = async (req, res) =>{
// // try {
// // const shows = await Show.find({showDateTime: {$gte: new Date()}}).populate('movie').sort({ showDateTime: 1});

// // // filter unique shows
// // const uniqueShows = new Set(shows.map(show => show.movie))

// // res. json({success: true, shows: Array.from(uniqueShows)})
// // } catch (error) {
// // console.error(error);
// // res.json({ success: false, message: error.message });
// // }
// // }
// // export const getShow = async (req, res) =>{
// // try {
// // const {movieId} = req.params;
// // // get all upcoming shows for the movie
// // const shows = await Show. find( {movie: movieId, showDateTime: { $gte: new
// // Date() }})
// // const movie = await Movie.findById(movieId);
// // const dateTime = {};
// // shows .forEach((show) => {
// // const date = show. showDateTime.toISOString().split("T")[0];
// // if(!dateTime[date]){
// // dateTime[date] = []
// // }

// // dateTime[date].push({ time: show.showDateTime, showId: show ._id })
// // })
// // res.json({success: true, movie, dateTime})
// // } catch (error) {
// // console.error(error);
// // res. json({ success: false, message: error.message });
// // }
// // }
// import axios from "axios";
// import Movie from "../models/Movie.js";
// import Show from "../models/Show.js";

// export const getNowPlayingMovies = async (req, res) => {
//   try {
//     const { data } = await axios.get(
//       "https://api.themoviedb.org/3/movie/now_playing",
//       {
//         headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
//       }
//     );
//     res.json({ success: true, movies: data.results });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const addShow = async (req, res) => {
//   try {
//     const { movieId, showsInput, showPrice } = req.body;
//     let movie = await Movie.findById(movieId);

//     // Fetch movie details if not in DB
//     if (!movie) {
//       const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
//         axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
//           headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
//         }),
//         axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
//           headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
//         }),
//       ]);

//       const movieApiData = movieDetailsResponse.data;
//       const movieCreditsData = movieCreditsResponse.data;

//       const movieDetails = {
//         _id: movieId,
//         title: movieApiData.title,
//         overview: movieApiData.overview,
//         poster_path: movieApiData.poster_path,
//         backdrop_path: movieApiData.backdrop_path,
//         genres: movieApiData.genres,
//         casts: movieCreditsData.cast,
//         release_date: movieApiData.release_date,
//         original_language: movieApiData.original_language,
//         tagline: movieApiData.tagline || "",
//         vote_average: movieApiData.vote_average,
//         runtime: movieApiData.runtime,
//       };

//       movie = await Movie.create(movieDetails);
//     }

//     // Build show documents
//     const showsToCreate = [];
//     showsInput.forEach((show) => {
//       const showDate = show.date;
//       show.time.forEach((time) => {
//         const dateTimeString = `${showDate}T${time}`;
//         showsToCreate.push({
//           movie: movieId,
//           showDateTime: new Date(dateTimeString),
//           showPrice,
//           occupiedSeats: {},
//         });
//       });
//     });

//     if (showsToCreate.length > 0) {
//       await Show.insertMany(showsToCreate);
//     }

//     res.json({ success: true, message: "Show Added successfully." });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getShows = async (req, res) => {
//   try {
//     const shows = await Show.find({ showDateTime: { $gte: new Date() } })
//       .populate("movie")
//       .sort({ showDateTime: 1 });

//     // Deduplicate by movieId
//     const uniqueMovies = {};
//     shows.forEach((show) => {
//       const id = show.movie._id.toString();
//       if (!uniqueMovies[id]) uniqueMovies[id] = show.movie;
//     });

//     res.json({ success: true, shows: Object.values(uniqueMovies) });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getShow = async (req, res) => {
//   try {
//     const { movieId } = req.params;

//     const shows = await Show.find({
//       movie: movieId,
//       showDateTime: { $gte: new Date() },
//     });

//     const movie = await Movie.findById(movieId);

//     const dateTime = {};
//     shows.forEach((show) => {
//       const date = show.showDateTime.toISOString().split("T")[0];
//       const time = show.showDateTime.toISOString().split("T")[1].slice(0, 5);
//       if (!dateTime[date]) {
//         dateTime[date] = [];
//       }
//       dateTime[date].push({ time, showId: show._id });
//     });

//     res.json({ success: true, movie, dateTime });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";

//
//  Get movies that are currently playing (from TMDB)
//
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      }
    );
    res.json({ success: true, movies: data.results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//
//  Add new shows for a movie
//
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;
    let movie = await Movie.findById(movieId);

    // Fetch movie details if not in DB
    if (!movie) {
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime,
      };

      movie = await Movie.create(movieDetails);
    }

    // Build show documents
    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Show Added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//
//  Get all upcoming shows, grouped by movie
//
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    const movieShows = {};
    shows.forEach((show) => {
      const id = show.movie._id.toString();
      if (!movieShows[id]) {
        movieShows[id] = { movie: show.movie, shows: [] };
      }
      movieShows[id].shows.push({
        showId: show._id,
        showDateTime: show.showDateTime,
        showPrice: show.showPrice,
      });
    });

    res.json({ success: true, shows: Object.values(movieShows) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//
//  Get all upcoming shows for a specific movie
//
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    }).sort({ showDateTime: 1 });

    const movie = await Movie.findById(movieId);

    const dateTime = {};
    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      const time = show.showDateTime.toISOString().split("T")[1].slice(0, 5);
      if (!dateTime[date]) {
        dateTime[date] = [];
      }
      dateTime[date].push({
        time,
        showId: show._id,
        price: show.showPrice,
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete a show
export const deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;

    const show = await Show.findById(showId);
    
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    await Show.findByIdAndDelete(showId);

    res.json({ success: true, message: "Show deleted successfully" });
  } catch (error) {
    console.error("deleteShow error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get upcoming movies
export const getUpcomingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/upcoming",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const movies = data.results;
    res.json({ success: true, movies });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};