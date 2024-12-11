import { MEDIA_ACTION_TYPES } from './media.types'
import { createAction } from '@/utils/reducer/reducer.utils'

export const setChosenMediaName = (val) =>
  createAction(MEDIA_ACTION_TYPES.SET_CHOSEN_MEDIA_NAME, val)
