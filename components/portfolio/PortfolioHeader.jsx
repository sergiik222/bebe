'use client'


const PortfolioHeader = ({showPhotos, showVideos, setShowPhotos, setShowVideos, resetPhotosVideos}) => {

  return (
      <div className='flex items-center justify-center mt-3 '>
          <button
              className={`btn ${showPhotos ? 'active' : ''} text-2xl absolute right-[26rem] `}
              onClick={setShowPhotos}>
              Photos
          </button>
          <button
              className='btn text-2xl'
              onClick={resetPhotosVideos}>
              Portfolio
          </button>
          <button
              className={`btn ${showVideos ? 'active' : ''} mt-48 text-2xl absolute left-[26rem]  `}
              onClick={setShowVideos}>
              Videos
          </button>
      </div>
  )

}

export default PortfolioHeader;