// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import ImageService from "../../../../services/images/ImageService.ts";
import EventBus from "../../../../common/EventBus.ts";
import React, {useState} from "react";
import {CircularProgress} from "@mui/material";
import "./index.css"
import ImageDto from "../../../../constants/spots/ImageDto.ts";
import MiniGalleryProps from "../../../../constants/spots/spotsMap/gallery/MiniGalleryProps.ts";


const MiniGallery: React.FC<MiniGalleryProps> = ({spotId}) => {
    const [imageData, setImageData] = useState<ImageDto[]>([]);
    const [loading, setLoading] = useState(false);

    const imagesAvailable = () => {
        return imageData.length > 0;
    }

    const getImages = async () => {

        setLoading(true);
        await ImageService.getImages(spotId).then((response) => {
                setImageData(response.data);
                setLoading(false);
            }
        ).catch((error) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });

    }

    const generateImageUrls = (byteArray: number[]) => {
        return {
            original: `data:image/png;base64,${byteArray}`
        };
    };

    React.useEffect(() => {
        getImages();
    }, []);

    React.useEffect(() => {
        getImages();
    }, [spotId]);


    const images = imageData.map((image) => generateImageUrls(image.image));

    return (
        <>
            <div>
                {loading && <CircularProgress className="mt-5"/>}
                {!loading && imagesAvailable() && <ImageGallery items={images}
                                                                showIndex={true}
                                                                infinite={true}
                                                                showPlayButton={false}
                                                                showThumbnails={false}/>
                }
                {!loading && !imagesAvailable() && <h2 className="mt-5" style={{fontSize: "1.2em"}}>Brak dostępnych zdjęć</h2>}

            </div>
        </>
    );
}
export default MiniGallery;