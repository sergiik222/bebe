import { PHOTOS_ACTION_TYPES } from './photos.types'

const PHOTOS_INITIAL_STATE = {
  mainPhotos: [],
  categoryPhotos: [],
  isLoadingMainPhotos: false,
  categorySelected: false,
  isLoadingCategoryPhotos: false,
  error: null,
}

export const photosReducer = (
  state = PHOTOS_INITIAL_STATE,
  action = {},
) => {
  const { type, payload } = action
  switch (type) {
    case PHOTOS_ACTION_TYPES.FETCH_MAIN_PHOTOS_START:
      return {
        ...state,
        isLoadingMainPhotos: true,
      }
    case PHOTOS_ACTION_TYPES.CATEGORY_SELECTED:
      return {
        ...state,
        categorySelected: payload,
      }
    case PHOTOS_ACTION_TYPES.FETCH_MAIN_PHOTOS_SUCCESS:
      return {
        ...state,
        isLoadingMainPhotos: false,
        mainPhotos: payload,
      }
    case PHOTOS_ACTION_TYPES.FETCH_MAIN_PHOTOS_FAILED:
      return {
        ...state,
        isLoadingMainPhotos: false,
        error: payload,
        mainPhotos: [],
      }
    case PHOTOS_ACTION_TYPES.SET_IS_LOADING_MAIN_PHOTOS:
      return {
        ...state,
        isLoadingMainPhotos: payload,
      }
    case PHOTOS_ACTION_TYPES.FETCH_CATEGORY_PHOTOS_START:
      return {
        ...state,
        isLoadingCategoryPhotos: true,
      }
    case PHOTOS_ACTION_TYPES.FETCH_CATEGORY_PHOTOS_SUCCESS:
      return {
        ...state,
        isLoadingCategoryPhotos: false,
        categoryPhotos: payload,
      }
    case PHOTOS_ACTION_TYPES.FETCH_CATEGORY_PHOTOS_FAILED:
      return {
        ...state,
        isLoadingCategoryPhotos: false,
        error: payload,
        categoryPhotos: [],
      }
    case PHOTOS_ACTION_TYPES.SET_IS_LOADING_CATEGORY_PHOTOS:
      return {
        ...state,
        isLoadingMainPhotos: payload,
      }
    default:
      return state
  }
}
