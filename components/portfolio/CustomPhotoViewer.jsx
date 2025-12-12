'use client'

import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

// Bunny CDN optimization
const getOptimizedUrl = (url, width, quality = 60) => {
    if (!url) return url
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}width=${width}&quality=${quality}`
}

const CustomPhotoViewer = ({ photos, currentIndex, isOpen, onClose, onNavigate }) => {
    const slides = photos.map(photo => ({
        src: getOptimizedUrl(photo.url, 1600),
        alt: photo.alt || photo.name,
    }))

    return (
        <Lightbox
            open={isOpen}
            close={onClose}
            index={currentIndex}
            slides={slides}
            on={{
                view: ({ index }) => onNavigate(index),
            }}
            plugins={[Thumbnails]}
        />
    )
}

export default CustomPhotoViewer
