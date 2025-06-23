import { PHOTOS_ACTION_TYPES } from './photos.types'
import { createAction } from '@/utils/reducer/reducer.utils'
import {getMainPhotos, getCategoryPhotos} from "@/utils/firebase.utils";

export const fetchMainPhotosStart = () =>
  createAction(PHOTOS_ACTION_TYPES.FETCH_MAIN_PHOTOS_START)

export const fetchMainPhotosSuccess = (photos) =>
  createAction(PHOTOS_ACTION_TYPES.FETCH_MAIN_PHOTOS_SUCCESS, photos)

export const fetchMainPhotosFailed = (error) =>
  createAction(PHOTOS_ACTION_TYPES.FETCH_MAIN_PHOTOS_FAILED, error)

export const setMainPhotos = () => async (dispatch) => {
  dispatch(fetchMainPhotosStart())
  try {
    const photosData = await getMainPhotos()
    dispatch(fetchMainPhotosSuccess(photosData))
  } catch (error) {
    dispatch(fetchMainPhotosFailed(error))
  }
}

export const setIsLoadingPhotos = (val) =>
    createAction(PHOTOS_ACTION_TYPES.SET_IS_LOADING_MAIN_PHOTOS, val)

export const fetchCategoryPhotosStart = () =>
    createAction(PHOTOS_ACTION_TYPES.FETCH_CATEGORY_PHOTOS_START)

export const fetchCategoryPhotosSuccess = (photos) =>
    createAction(PHOTOS_ACTION_TYPES.FETCH_CATEGORY_PHOTOS_SUCCESS, photos)

export const fetchCategoryPhotosFailed = (error) =>
    createAction(PHOTOS_ACTION_TYPES.FETCH_CATEGORY_PHOTOS_FAILED, error)

export const setCategorySelected = (selected) =>
    createAction(PHOTOS_ACTION_TYPES.CATEGORY_SELECTED, selected)

export const setCategoryPhotos = ({category}) => async (dispatch) => {
  dispatch(fetchCategoryPhotosStart())
  dispatch(setCategorySelected(true))
  try {
    console.log("Here category: ", category)
    const photosData = await getCategoryPhotos(category)
    dispatch(fetchCategoryPhotosSuccess(photosData))
  } catch (error) {
    dispatch(fetchCategoryPhotosFailed(error))
  }
}

export const setIsLoadingCategoryPhotos = (val) =>
    createAction(PHOTOS_ACTION_TYPES.SET_IS_LOADING_CATEGORY_PHOTOS, val)
