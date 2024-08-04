'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

const MediaGallery = ({ folderId }) => {
    const [mediaFiles, setMediaFiles] = useState([]);

    useEffect(() => {
        const fetchMediaFiles = async () => {
            try {
                const response = await axios.get(`/api/getMediaFiles`, { params: { folderId } });
                console.log("response", response.data);
                setMediaFiles(response.data);
            } catch (error) {
                console.error('Error fetching media files:', error);
            }
        };

        fetchMediaFiles();
    }, [folderId]);

    return (
        <div className="media-gallery">
            {mediaFiles.map((file) => (
                <div key={file.id} className="media-item">
                    {file.mimeType.startsWith('image/') ? (
                        <Image
                            src={`https://drive.google.com/uc?export=view&id=${file.id}`}
                            alt={file.name}
                            width={300}
                            height={300}

                        />
                    ) : (
                        <video width="300" controls>
                            <source src={`https://drive.google.com/uc?id=${file.id}`}
                                    type={file.mimeType}/>
                            Your browser does not support the video tag.
                        </video>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MediaGallery;
