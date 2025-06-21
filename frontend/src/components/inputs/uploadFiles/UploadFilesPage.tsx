import React from 'react';
import {useDropzone} from 'react-dropzone';
import "./indexUploadFiles.css";
import TopNavbar from "../../common/topNavbar/TopNavbar.tsx";
import Button from "@mui/material/Button";
import ReadingService from "../../../services/readings/ReadingService.ts";
import EventBus from "../../../common/EventBus.ts";
import {Alert} from "@mui/material";
import {Collapse} from "react-bootstrap";
import SpotId from "../../../constants/inputs/SpotId.ts";


const UploadFilesPage: React.FC<SpotId> = ({spotId}) => {
    // TODO Change allowed extensions
    const allowedExtensions = ['xlsx'];
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

    const onDrop = (acceptedFiles: File[]) => {
        const filteredFiles: File[] = acceptedFiles.filter((file) => {
            const fileExtension = file.name.toLowerCase().slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
            return allowedExtensions.includes(fileExtension);
        });
        if (filteredFiles.length !== acceptedFiles.length) {
            if (filteredFiles.length === 0) {
                setError("Pliki posiadają nieodpowiednie rozszerzenie. Akceptowalne rozszerzenia: xlsx")
            } else {
                setError("Część wybranych plików posiada nieodpowiednie rozszerzenie. Akceptowalne rozszerzenia: xlsx")
            }
        }
        setSelectedFiles(filteredFiles);
        setIsTableVisible(filteredFiles.length > 0);
        setIsDescriptionVisible(filteredFiles.length === 0);
    };

    const send = async () => {
        if (selectedFiles.length > 0) {
            const formData = new FormData();
            selectedFiles.forEach((file) => {
                formData.append('file', file);
            });
            await ReadingService.uploadReadings(spotId, formData)
                .then(() => {
                    reset();
                    setIsSuccessful(true);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        EventBus.dispatch("refresh");
                        location.reload();
                    } else {
                        if (error.response.data.errorCode == 1) {
                            setError("Błąd! W pliku  " + error.response.data.fileName)
                        } else if (error.response.data.errorCode == 2) {
                            setError("Błąd! W pliku " + error.response.data.fileName )
                        } else if (error.response.data.errorCode == 3) {
                            setError("Błąd! Nie można wczytać pliku " + error.response.data.fileName)
                        }
                    }
                });
        }
    }

    const {getRootProps, getInputProps} = useDropzone({
        onDrop,
        multiple: true
    });

    return (
        <>
            <TopNavbar/>
            <h1 className="bottom-space">Dodaj dane z pliku</h1>
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
                        Import danych z plików zakończył się sukcesem
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
                        Przeciągnij i upuść pliki tutaj lub kliknij, aby wybrać pliki
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
};

export default UploadFilesPage;