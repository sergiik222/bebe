'use client'

import {useDispatch, useSelector} from "react-redux";
import {setVideosInUse} from "@/store/videos/videos.action";
import {selectVideosInUse} from "@/store/videos/videos.selector";
import { Link } from "react-scroll";



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
          <button className={`btn ${videosInUse ? '' : 'active'} text-2xl `} onClick={showPhotos}>
              Photos
          </button>
          <Link className='btn text-2xl'
                to="portfolio"
                smooth={true}
                duration={600}
                offset={-50}>
              Portfolio
          </Link>
          <button className={`btn ${videosInUse ? 'active' : ''} mt-48 text-2xl`} onClick={showVideos}>
              Videos
          </button>
      </div>
  )

}

export default Header;