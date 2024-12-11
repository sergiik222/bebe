'use client'

import {useDispatch, useSelector} from "react-redux";
import {setVideosInUse} from "@/store/videos/videos.action";
import NavLink from "@/components/NavLink";
import {selectVideosInUse} from "@/store/videos/videos.selector";



const Header = () => {
    const dispatch = useDispatch()
    const videosInUse = useSelector(selectVideosInUse)
    const showPhotos = () => {
        dispatch(setVideosInUse(false))
    }
    const showVideos = () => {
        dispatch(setVideosInUse(true))
    }

  return (
      <div className='flex items-center justify-center mt-3 '>
          <button className={`btn ${videosInUse ? 'active' : ''} mt-48`} onClick={showVideos}>
              Videos
          </button>
          <NavLink href="/portfolio">
              Portfolio
          </NavLink>
          <button className={`btn ${videosInUse ? '' : 'active'}`} onClick={showPhotos}>
              Photos
          </button>
      </div>
  )

}

export default Header;