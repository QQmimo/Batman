import { useState, useCallback, useEffect } from 'react';
import styles from "./imagepreview.module.scss";

export function ImagePreview({ src = null, onSelected, onClear }) {
    const [previewImage, setPreviewImage] = useState(src);
    const [isDragging, setIsDragging] = useState(false);
    
    useEffect(() => {
        setPreviewImage(src);
    }, [src]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.match('image.*')) {
            previewFile(file);
        }
    };

    const previewFile = (file) => {
        if (file === null) {
            onClear();
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewImage(reader.result);
            onSelected(reader.result);
        };
    };

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            previewFile(file);
        }
    }, []);

    return (
        <div className={styles.imageUploader}>
            <div
                className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {previewImage ? (
                    <div className={styles.previewContainer}>
                        <img
                            src={previewImage}
                            alt="Preview"
                            className={styles.previewImage}
                        />
                        <button
                            onClick={() => setPreviewImage(null)}
                            className={styles.removeButton}
                        >
                            Удалить
                        </button>
                    </div>
                ) : (
                    <div className="upload-prompt">
                        <p>Перетащите изображение сюда или</p>
                        <label htmlFor="file-upload" className={styles.uploadButton}>
                            Выберите файл
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};