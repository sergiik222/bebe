import {createSelector} from 'reselect'

const selectMediaReducer = (state) => {
    return state.media
}

export const selectMediaName = createSelector(
  [selectMediaReducer],
  (mediaSlice) => mediaSlice.chosenMediaName,
)
