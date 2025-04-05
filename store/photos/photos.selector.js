import { createSelector } from 'reselect'
import React from "react";

const selectPhotosReducer = (state) => state.photos

export const selectMainPhotos = createSelector(
  [selectPhotosReducer],
  (photosSlice) => photosSlice.mainPhotos,
)

export const selectMainPhotosIsLoading = createSelector(
  [selectPhotosReducer],
  (photosSlice) => photosSlice.isLoadingMainPhotos,
)


export const selectCategoryPhotos = createSelector(
    [selectPhotosReducer],
    (photosSlice) => photosSlice.categoryPhotos,
)

export const selectCategoryPhotosIsLoading = createSelector(
    [selectPhotosReducer],
    (photosSlice) => photosSlice.isLoadingCategoryPhotos,
)



export const selectMainPhotosHome = createSelector(
    [selectMainPhotos],
    (photosSlice) =>  {
        if (!Array.isArray(photosSlice) || photosSlice.length === 0) {
            return []
        }

        return photosSlice.map((media, index) => {
            return {
                ...media,
                marginTop: index % 2 === 0 ? 0 : Math.floor(Math.random() * 100) + 200,
                marginBottom: index % 2 === 0 ? Math.floor(Math.random() * 100) + 200 : 0,
            }
        })
    }
)

