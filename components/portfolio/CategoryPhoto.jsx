import { useDispatch } from "react-redux";
import Image from "next/image";
import React from "react";
import { setCategoryPhotos } from "@/store/photos/photos.action";
import { useRouter } from 'next/navigation'

const CategoryPhoto = ({ src, alt  }) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleOnClick = () => {
        dispatch(setCategoryPhotos({ category: alt }));
        router.push("/gallery");
    };

    return (
        <div
            className="relative w-full aspect-[16/9] group hover:cursor-pointer overflow-hidden"
            onClick={handleOnClick}
        >
            <div className="w-full h-full transition-transform duration-[6000ms] ease-[cubic-bezier(0.25,0.45,0.45,0.95)] group-hover:scale-110">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    style={{ objectFit: "cover", position: "relative" }}
                    draggable="false"
                />
            </div>
            <div className="absolute inset-0 bg-black opacity-80 lg:opacity-0 group-hover:opacity-50 flex items-center justify-center transition-opacity">
                <h2 className="font-bold text-[28px] sm:text-[36px]  text-primary-text text-center">{alt}</h2>
            </div>
        </div>
    );
};

export default CategoryPhoto;