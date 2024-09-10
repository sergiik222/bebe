import { VIDEOS_ACTION_TYPES } from './videos.types'
import { createAction } from '@/utils/reducer/reducer.utils'
import {getCategoryVideos, getMainVideos} from "@/utils/firebase.utils";

export const fetchMainVideosStart = () =>
  createAction(VIDEOS_ACTION_TYPES.FETCH_MAIN_VIDEOS_START)

export const fetchMainVideosSuccess = (videos) =>
  createAction(VIDEOS_ACTION_TYPES.FETCH_MAIN_VIDEOS_SUCCESS, videos)

export const fetchMainVideosFailed = (error) =>
  createAction(VIDEOS_ACTION_TYPES.FETCH_MAIN_VIDEOS_FAILED, error)

export const fetchCategoryVideosStart = () =>
    createAction(VIDEOS_ACTION_TYPES.FETCH_CATEGORY_VIDEOS_START)

export const fetchCategoryVideosSuccess = (videos) =>
    createAction(VIDEOS_ACTION_TYPES.FETCH_CATEGORY_VIDEOS_SUCCESS, videos)

export const fetchCategoryVideosFailed = (error) =>
    createAction(VIDEOS_ACTION_TYPES.FETCH_CATEGORY_VIDEOS_FAILED, error)

export const setMainVideos = () => async (dispatch) => {
  dispatch(fetchMainVideosStart())
  try {
    const videosData = await getMainVideos()
    dispatch(fetchMainVideosSuccess(videosData))
  } catch (error) {
    dispatch(fetchMainVideosFailed(error))
  }
}

export const setCategoryVideos = ({category}) => async (dispatch) => {
  dispatch(fetchCategoryVideosStart())
  try {
    const videosData = await getCategoryVideos(category)
    dispatch(fetchCategoryVideosSuccess(videosData))
  } catch (error) {
    dispatch(fetchCategoryVideosFailed(error))
  }
}

export const setIsLoadingVideos = (val) =>
  createAction(VIDEOS_ACTION_TYPES.SET_IS_LOADING_MAIN_VIDEOS, val)

export const setVideosInUse = (val) =>
    createAction(VIDEOS_ACTION_TYPES.SET_VIDEOS_IN_USE, val)
