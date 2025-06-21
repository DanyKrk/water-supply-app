// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import Modal from 'react-bootstrap/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import {CircularProgress} from "@mui/material";
import EventBus from "../../../../common/EventBus.ts";
import AuthService from "../../../../services/users/AuthService.ts";
import ImageDto from "../../../../constants/spots/ImageDto.ts";
import GalleryProps from "../../../../constants/spots/spotDetails/gallery/GalleryProps.ts";
import ImageService from "../../../../services/images/ImageService.ts";


const Gallery: React.FC<GalleryProps> = ({spotId, load}) => {
    const [imageData, setImageData] = useState<ImageDto[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const imagesAvailable = () => {
        return imageData.length > 0;
    }

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
        }
    }, [showAdminBoard]);

    const getImages = async () => {
        if (load) {
            setLoading(true);
            await ImageService.getImages(spotId).then((response: any) => {
                    setImageData(response.data);
                    setLoading(false);
                }
            ).catch((error: any) => {
                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("refresh");
                    location.reload();
                }
            });
        }
    }

    const deleteImage = async () => {
        const toDelete: ImageDto = imageData.at(currentIndex)
        await ImageService.deleteImage(toDelete.id).then(() => {
                setShow(false);
                getImages();
            }
        ).catch((error: any) => {
            if (error.response && error.response.status === 401) {
                EventBus.dispatch("refresh");
                location.reload();
            }
        });
    }

    const generateImageUrls = (byteArray: number[]) => {
        return {
            original: `data:image/png;base64,${byteArray}`,
            thumbnail: `data:image/png;base64,${byteArray}`
        };
    };

    const handleSlide = (currentIndex: number) => {
        setCurrentIndex(currentIndex);
    };

    React.useEffect(() => {
        getImages();
    }, []);

    React.useEffect(() => {
        getImages();
    }, [load]);


    const images = imageData.map((image) => generateImageUrls(image.image));

    return (
        <>
            <div style={{margin: "0 auto", width: "60%"}}>
                <Modal show={show} onHide={() => setShow(false)} style={{display: 'flex', zIndex: 9999, top: '30%'}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Usuń zdjęcie</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <p>Czy jesteś pewny, że chcesz usunąć aktualnie wyświetlone zdjęcie?</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="outlined" className="mr-3" onClick={() => setShow(false)}>Zamknij</Button>
                        <Button variant="outlined" size="medium" color="error" className="mx-2"
                                startIcon={<DeleteIcon/>} onClick={deleteImage}>Usuń</Button>
                    </Modal.Footer>
                </Modal>
                {loading && <CircularProgress className="mt-5"/>}
                {!loading && imagesAvailable() && <ImageGallery items={images}
                                                    thumbnailPosition={"right"}
                                                    showIndex={true}
                                                    infinite={true}
                                                    showPlayButton={false}
                                                    onSlide={handleSlide}/>
                }
                {!loading && !imagesAvailable() && <h2 className="mt-5">Brak dostępnych zdjęć</h2>}
                {!loading && showAdminBoard && imageData.length > 0 &&
                    <Button variant="outlined" size="medium" color="error" className="mb-3 mt-5 mx-auto"
                            startIcon={<DeleteIcon/>} onClick={() => setShow(true)}>
                        Usuń zdjęcie
                    </Button>}
            </div>
        </>
    );
}

export default Gallery;