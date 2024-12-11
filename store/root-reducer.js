import { combineReducers } from "redux";
import { videosReducer } from "./videos/videos.reducer";
import { photosReducer } from "./photos/photos.reducer";
import {mediaReducer} from "@/store/media/media.reducer";


export const rootReducer = combineReducers({
  photos: photosReducer,
  videos: videosReducer,
  media: mediaReducer,
});
