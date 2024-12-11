import { MEDIA_ACTION_TYPES } from './media.types'

const MEDIA_INITIAL_STATE = {
  chosenMediaName: ""
}

export const mediaReducer = (
  state = MEDIA_INITIAL_STATE,
  action = {},
) => {
  const { type, payload } = action
  switch (type) {
    case MEDIA_ACTION_TYPES.SET_CHOSEN_MEDIA_NAME:
      return {
        ...state,
        chosenMediaName: payload,
      }
    default:
      return state
  }
}
