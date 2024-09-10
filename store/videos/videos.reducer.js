import { VIDEOS_ACTION_TYPES } from './videos.types'

const VIDEOS_INITIAL_STATE = {
  mainVideos: [],
  categoryVideos: [],
  isLoadingMainVideos: false,
  isLoadingCategoryVideos: false,
  error: null,
  videosInUse: false
}

export const videosReducer = (
  state = VIDEOS_INITIAL_STATE,
  action = {},
) => {
  const { type, payload } = action
  switch (type) {
    case VIDEOS_ACTION_TYPES.FETCH_MAIN_VIDEOS_START:
      return {
        ...state,
        isLoadingMainVideos: true,
      }
    case VIDEOS_ACTION_TYPES.FETCH_MAIN_VIDEOS_SUCCESS:
      return {
        ...state,
        isLoadingMainVideos: false,
        mainVideos: payload,
      }
    case VIDEOS_ACTION_TYPES.FETCH_MAIN_VIDEOS_FAILED:
      return {
        ...state,
        isLoadingMainVideos: false,
        error: payload,
        mainVideos: [],
      }
    case VIDEOS_ACTION_TYPES.SET_IS_LOADING_MAIN_VIDEOS:
      return {
        ...state,
        isLoadingMainVideos: payload,
      }
    case VIDEOS_ACTION_TYPES.FETCH_CATEGORY_VIDEOS_START:
      return {
        ...state,
        isLoadingCategoryVideos: true,
      }
    case VIDEOS_ACTION_TYPES.FETCH_CATEGORY_VIDEOS_SUCCESS:
      return {
        ...state,
        isLoadingCategoryVideos: false,
        categoryVideos: payload,
      }
    case VIDEOS_ACTION_TYPES.FETCH_CATEGORY_VIDEOS_FAILED:
      return {
        ...state,
        isLoadingCategoryVideos: false,
        error: payload,
        categoryVideos: [],
      }
    case VIDEOS_ACTION_TYPES.SET_IS_LOADING_CATEGORY_VIDEOS:
      return {
        ...state,
        isLoadingCategoryVideos: payload,
      }
    case VIDEOS_ACTION_TYPES.SET_VIDEOS_IN_USE:
      return {
        ...state,
        videosInUse: payload,
      }
    default:
      return state
  }
}
