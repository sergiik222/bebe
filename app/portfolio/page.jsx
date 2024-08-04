import React from 'react';
import MediaGallery from '../../components/MediaGallery';

const PortfolioPage = () => {
    const fotosFolderId = '1dpMWk6rEvmnkg3r7-1bbXutltkq-gQ6K'; // Replace with your actual folder ID
    const videosFolderId = '1ja4rSeezsNh2naSUoNG7UC3sM5fgh0rA'; // Replace with your actual folder ID

    return (
        <div>
            <h1>Fotos</h1>
            <MediaGallery folderId={fotosFolderId} />

            <h1>Videos</h1>
            <MediaGallery folderId={videosFolderId} />
        </div>
    );
};

export default PortfolioPage;
