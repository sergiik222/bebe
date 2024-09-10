import { combineReducers } from "redux";
import { videosReducer } from "./videos/videos.reducer";
import { photosReducer } from "./photos/photos.reducer";


export const rootReducer = combineReducers({
  photos: photosReducer,
  videos: videosReducer
});
