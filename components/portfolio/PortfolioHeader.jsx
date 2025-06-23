'use client'


const PortfolioHeader = ({showPhotos, showVideos, setShowPhotos, setShowVideos}) => {

  return (
      <div className='flex items-center justify-center mt-12 '>
          <button
              className={`btn ${showPhotos ? 'active' : ''} text-2xl  `}
              onClick={setShowPhotos}>
              Photos
          </button>
          <button
              className={`btn ${showVideos ? 'active' : ''} mt-48 text-2xl    `}
              onClick={setShowVideos}>
              Videos
          </button>
      </div>
  )

}

export default PortfolioHeader;