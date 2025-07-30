import React from 'react';
import {useDropzone, FileRejection} from 'react-dropzone'; 
import "./imageUploader.css";
import Button from "@mui/material/Button";
import EventBus from "../../../common/EventBus.ts";
import {Alert} from "@mui/material";
import {Collapse} from "react-bootstrap";
import ImageService from "../../../services/images/ImageService.ts";
import SpotId from "../../../constants/inputs/SpotId.ts";

const MAX_SIZE_BYTES = 20 * 1024 * 1024; 

const ImageUploader: React.FC<SpotId> = ({spotId}) => {
    const [error, setError] = React.useState("");
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const [isTableVisible, setIsTableVisible] = React.useState(false);
    const [isDescriptionVisible, setIsDescriptionVisible] = React.useState(true);
    const [isSuccessful, setIsSuccessful] = React.useState(false);

    const reset = () => {
        setSelectedFiles([]);
        setIsTableVisible(false);
        setIsDescriptionVisible(true);
    }

    const onDrop = React.useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (fileRejections.length > 0) {
            const firstRejection = fileRejections[0];
            if (firstRejection.errors.some(e => e.code === 'file-too-large')) {
                setError(`Błąd! Plik jest za duży. Maksymalny rozmiar to 20 MB.`);
            } else if (firstRejection.errors.some(e => e.code === 'file-invalid-type')) {
                setError("Wybrano pliki o nieodpowiednim typie. Akceptowalne są tylko obrazy JPG i PNG.");
            } else {
                 setError("Wystąpił nieznany błąd podczas wyboru plików.");
            }
        } else {
            setError("");
        }

        setSelectedFiles(acceptedFiles);
        setIsTableVisible(acceptedFiles.length > 0);
        setIsDescriptionVisible(acceptedFiles.length === 0);
    }, []);

    const send = async () => {
        if (selectedFiles.length > 0) {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('file', file);
            });

            await ImageService.addImages(spotId, formData)
                .then(() => {
                    reset();
                    setIsSuccessful(true);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        EventBus.dispatch("refresh");
                        location.reload();
                    } else {
                        setError("Błąd! Nie można załadować zdjęć. Sprawdź, czy pliki nie są uszkodzone i mają prawidłowy format (JPG, PNG).")
                    }
                });
        }
    }

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        multiple: true,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png']
        },
        maxSize: MAX_SIZE_BYTES 
    });

    return (
        <>
            <h1 className="bottom-space">Dodaj zdjęcia do punktu pomiarowego</h1>
            <Collapse in={error.length > 0} className="centered-collapse">
                <div className={`alert ${error.length > 0 ? '' : 'alert-hidden'}`}>
                    <Alert
                        severity='error'
                        onClose={() => {
                            setError("")
                        }}
                    >
                        {error}
                    </Alert>
                </div>
            </Collapse>

            <Collapse in={isSuccessful} className="centered-collapse">
                <div className={`alert ${isSuccessful ? '' : 'alert-hidden'}`}>
                    <Alert
                        severity='success'
                        onClose={() => {
                            setIsSuccessful(false);
                        }}
                    >
                        Przesyłanie obrazów skończyło się sukcesem
                    </Alert>
                </div>
            </Collapse>
            <div {...getRootProps()} className="dropzone container" style={{
                height: '40vh',
                border: '2px dashed #aaa',
                width: '60vw',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <input {...getInputProps()} />
                {isDescriptionVisible &&
                    <p className="text-center">
                        Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać pliki (tylko JPG, PNG, max 20MB)
                    </p>
                }
                {isTableVisible && (
                    <div className="table-responsive" style={{maxHeight: '100%', width: '100%', overflowY: 'auto'}}>
                        <table className="custom-table">
                            <thead>
                            <tr>
                                <th>Nazwa pliku</th>
                                <th>Rozmiar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {selectedFiles.map((file, index) => (
                                <tr key={index}>
                                    <td>{file.name}</td>
                                    <td>{file.size} B</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="button-container">
                <Button variant="contained" size="medium"
                        onClick={reset}
                        style={{marginRight: "15px"}}>
                    Wymaż
                </Button>
                <Button variant="contained" size="medium"
                        onClick={send}>
                    Dodaj
                </Button>
            </div>
        </>
    );
}

export default ImageUploader;