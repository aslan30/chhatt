import React, { useRef } from 'react';

const Modal = ({ mediaUrl, mediaType, onClose }) => {
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    const handleClose = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.src = '';
        }
        onClose();
    };

    const renderMedia = () => {
        switch (mediaType) {
            case 'audio':
                return (
                    <div>
                        <audio
                            ref={audioRef}
                            controls
                            className="w-full"
                            preload="auto"
                            onError={(e) => console.error("Error loading audio:", e)}
                        >
                            <source src={mediaUrl} type="audio/mpeg" />
                            Ваш браузер не поддерживает воспроизведение аудио.
                        </audio>
                    </div>
                );
            case 'video':
                return (
                    <div>
                        <video
                            ref={videoRef}
                            controls
                            className="w-full rounded-lg shadow-md"
                            preload="auto"
                            onError={(e) => console.error("Error loading video:", e)}
                        >
                            <source src={mediaUrl} type="video/mp4" />
                            Ваш браузер не поддерживает воспроизведение видео.
                        </video>
                    </div>
                );
            case 'image':
            case 'gif':
                return (
                    <div>
                        <img src={mediaUrl} alt="Media" className="w-full rounded-lg shadow-md" />
                    </div>
                );
            default:
                return (
                    <div>
                        <p>Файл не поддерживается. <a href={mediaUrl} download className="text-blue-500 underline">Нажмите здесь, чтобы скачать.</a></p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full shadow-lg">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg mb-2">Воспроизведение медиа</h3>
                    <button onClick={handleClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                {renderMedia()}
            </div>
        </div>
    );
};

export default Modal;
