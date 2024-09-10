import {createSelector} from 'reselect'

const selectVideosReducer = (state) => {
    return state.videos
}

export const selectMainVideos = createSelector(
  [selectVideosReducer],
  (videosSlice) => videosSlice.mainVideos,
)

export const selectMainVideosIsLoading = createSelector(
  [selectVideosReducer],
  (videosSlice) => videosSlice.isLoadingMainVideos,
)

export const selectCategoryVideos = createSelector(
    [selectVideosReducer],
    (videosSlice) => videosSlice.categoryVideos,
)

export const selectCategoryVideosIsLoading = createSelector(
    [selectVideosReducer],
    (videosSlice) => videosSlice.isLoadingMainVideos,
)

export const selectVideosInUse = createSelector(
    [selectVideosReducer],
    (videosSlice) => videosSlice.videosInUse,
)

export const selectMainVideosHome = createSelector(
    [selectMainVideos],
    (videosSlice) =>  {
        return videosSlice.map((media, index) => {
            return {
                ...media,
                marginTop: index % 2 === 0 ? 0 : Math.floor(Math.random() * 100) + 200,
                marginBottom: index % 2 === 0 ? Math.floor(Math.random() * 100) + 200 : 0,
            }
        })
    }
)



