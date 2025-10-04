// import express from "express";
// import { getNowPlayingMovies } from "../controllers/showController.js";
// const showRouter = express.Router();

// showRouter.get('/now-playing', getNowPlayingMovies)

// export default showRouter;
import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShows, deleteShow, getUpcomingMovies } from "../controllers/showController.js";
import { protectAdmin } from "../middleware/auth.js";

const showRouter = express.Router();

showRouter.get("/now-playing", protectAdmin, getNowPlayingMovies);
showRouter.get("/upcoming", getUpcomingMovies);
showRouter.post('/add', protectAdmin, addShow)
showRouter.get("/all", getShows)
showRouter.get("/:movieId", getShow)
showRouter.delete("/:showId", protectAdmin, deleteShow)

export default showRouter;
