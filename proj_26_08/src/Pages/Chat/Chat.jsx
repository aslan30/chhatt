import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Modal from '../../components/ModalMessageFile/Modal';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import ClearMessagesModal from '../../components/ClearMessagesModal/ClearMessagesModal';
import EmojiPicker from '../../components/EmojiPicker/EmojiPicker';

const ChatPage = () => {
    const { receiverId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [receiver, setReceiver] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [mediaType, setMediaType] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [editMessageId, setEditMessageId] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [messageIdToDelete, setMessageIdToDelete] = useState(null);
    const [clearModalOpen, setClearModalOpen] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('http://127.0.0.1:8000/api/v1/users/current_user/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCurrentUser(response.data);
            } catch (error) {
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchCurrentUser();
    }, [navigate]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!receiverId || !currentUser) return;
    
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get('http://127.0.0.1:8000/api/v1/chats/messages/', {
                    params: { sender: currentUser.id, receiver: receiverId },
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const messages = response.data.messages;
    
                if (!messages || !Array.isArray(messages)) {
                    console.error('Messages are not in expected format');
                    return;
                }
    
                const combinedMessages = messages.filter(msg => {
                    const isNotDeleted =
                        (msg.receiver.id === currentUser.id && !msg.deleted_for_receiver) ||
                        (msg.sender.id === currentUser.id && !msg.deleted_for_sender);
                    return isNotDeleted;
                });
        
                combinedMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                setMessages(combinedMessages);
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401) {
                        navigate('/login');
                    } else if (err.response.status === 404) {
                        navigate('/404');
                    }
                } else {
                    console.error('Ошибка при загрузке данных:', err);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchMessages();
    }, [receiverId, currentUser]);

    useEffect(() => {
        const fetchReceiver = async () => {
            if (!receiverId) return;
    
            setLoading(true);
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/users/${receiverId}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setReceiver(response.data);
            } catch (err) {
                if (err.response) {
                    if (err.response.status === 401) {
                        navigate('/login');
                    } else if (err.response.status === 404) {
                        navigate('/404');
                    }
                } else {
                    console.error('Ошибка при загрузке данных:', err);
                }
            } finally {
                setLoading(false);
            }
        };
    
        fetchReceiver();
    }, [receiverId, navigate]);

    const handleSendMessage = async (event) => {
        event.preventDefault();
        if (newMessage.trim() === '' && !file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('sender', currentUser.id);
        formData.append('receiver', receiverId);
        formData.append('content', newMessage);
        if (file) {
            formData.append('file', file);
        }

        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.post('http://127.0.0.1:8000/api/v1/chats/send/', formData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            setMessages(prevMessages => [...prevMessages, response.data]);
            setNewMessage('');
            setFile(null);
            setFileName('');
            setEditMessageId(null);
        } catch (error) {
            console.error('Ошибка отправки сообщения:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditMessage = async (messageId, content) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(`http://127.0.0.1:8000/api/v1/chats/messages/update/${messageId}/`, { content }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessages(prevMessages => prevMessages.map(msg => (msg.id === messageId ? { ...msg, content } : msg)));
            setNewMessage('');
            setEditMessageId(null);
        } catch (error) {
            console.error('Ошибка редактирования сообщения:', error);
        } finally {
            setLoading(false);
        }
    };


    
    const handleDeleteMessage = (messageId) => {
        setMessageIdToDelete(messageId);
        setConfirmDeleteOpen(true);
    };
    
    const confirmDelete = async (deleteType) => {
        if (!messageIdToDelete) return;
    
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(`http://127.0.0.1:8000/api/v1/chats/messages/delete/${messageIdToDelete}/`, {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { delete_type: deleteType }
            });
    
            setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageIdToDelete));
            setMessageIdToDelete(null);
        } catch (error) {
            alert('Ошибка при удалении сообщения. Пожалуйста, попробуйте еще раз.');
        } finally {
            setLoading(false);
            setConfirmDeleteOpen(false);
        }
    };


    const handleClearMessages = async (deleteType, receiverId) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.delete(`http://127.0.0.1:8000/api/v1/chats/messages/clear/?delete_type=${deleteType}&receiver_id=${receiverId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
    
            if (response.status === 204) {
                alert("Сообщения успешно удалены.");
            }
        } catch (error) {
            alert(`Ошибка при очистке сообщений: ${error.response ? error.response.data.detail : error.message}`);
        } finally {
            setLoading(false);
            setClearModalOpen(false);
        }
    };
    

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    const handlePlayMedia = (fileUrl) => {
        const extension = fileUrl.split('.').pop();
        if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension)) {
            setMediaType('audio');
            setMediaUrl(`http://127.0.0.1:8000${fileUrl}`);
        } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
            setMediaType('video');
            setMediaUrl(`http://127.0.0.1:8000${fileUrl}`);
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            setMediaType('image');
            setMediaUrl(`http://127.0.0.1:8000${fileUrl}`);
        } else {
            window.open(`http://127.0.0.1:8000${fileUrl}`, '_blank');
            return;
        }
        setModalOpen(true);
    };

    const groupedMessages = messages.reduce((acc, message) => {
        const date = new Date(message.created_at).toLocaleDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(message);
        return acc;
    }, {});

    const addEmoji = (emoji) => {
        setNewMessage((prevMessage) => prevMessage + emoji);
        setIsEmojiPickerOpen(false);
    };

    return (
        <div className="relative flex flex-col h-screen bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
            <div
                className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 shadow-lg p-4 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-30`}
                style={{ width: '16rem' }}
            >
                <Sidebar onSelectChat={(receiverId) => navigate(`/chat/${receiverId}`)} />
            </div>
    
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black opacity-50 z-20" onClick={() => setSidebarOpen(false)}></div>
            )}
    
            <div className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out ${sidebarOpen ? 'opacity-70' : 'opacity-100'}`}>
                <div className="bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-4 flex justify-between items-center shadow-md">
                    <h2 className="text-2xl font-bold mb-2">{receiver.first_name ? `${receiver.first_name} ${receiver.last_name}` : 'Загрузка...'}</h2>
                    <button onClick={() => setClearModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">Очистить чат</button>
                </div>
    
                <main className={`flex-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 overflow-y-auto shadow-md`} style={{ overflowY: 'auto' }}>
                    {loading && <p className="text-blue-600 dark:text-blue-400">Загрузка...</p>}
                    <ul className="list-none p-0">
                        {Object.keys(groupedMessages).length === 0 ? (
                            <p className="text-gray-600 dark:text-gray-400 text-center">Нет сообщений</p>
                        ) : (
                            Object.keys(groupedMessages).map(date => (
                                <div key={date} className="mb-4">
                                    <h3 className="text-gray-400 dark:text-gray-500 text-center text-sm mb-2 font-medium">{date}</h3>
                                    {groupedMessages[date].map(msg => (
                                        <li key={msg.id} className={`mb-2 flex ${msg.sender.id === currentUser.id ? 'flex-row-reverse' : 'flex-row'} items-start`}>
                                            <div className={`max-w-[80%] p-4 rounded-lg shadow-lg transition-transform duration-200 ${msg.sender.id === currentUser.id ? 'bg-blue-100' : 'bg-white dark:bg-gray-700'} flex flex-col`}>
                                                <div className="flex-grow">
                                                    <strong className={`text-lg ${msg.sender.id === currentUser.id ? 'text-blue-600' : 'text-gray-800 dark:text-gray-200'}`}>
                                                        {msg.sender.id === currentUser.id ? 'Вы' : `${msg.sender.first_name} ${msg.sender.last_name}`}
                                                    </strong>
                                                    {msg.file ? (
                                                        <div className="mt-1">
                                                            <p className="text-sm text-gray-500 break-words">{msg.file.split('/').pop()}</p>
                                                            <button
                                                                onClick={() => handlePlayMedia(msg.file)}
                                                                className="mt-1 flex items-center hover:opacity-75 transition duration-200"
                                                                aria-label="Open File"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0000F5">
                                                                    <path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v240h-80v-200H520v-200H240v640h360v80H240Zm638 15L760-183v89h-80v-226h226v80h-90l118 118-56 57Zm-638-95v-640 640Z"/>
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="mt-1 text-sm text-gray-500 break-words">{msg.content}</p>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
                                                    <span className="text-gray-500 dark:text-white">{msg.read ? '✔️✔️' : '✔️'}</span>
                                                    {msg.sender.id === currentUser.id && (
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => {
                                                                    setEditMessageId(msg.id);
                                                                    setNewMessage(msg.content);
                                                                }}
                                                                className="text-blue-600 hover:opacity-75 transition duration-200"
                                                                aria-label="Edit Message"
                                                            >
                                                                <img
                                                                    src="https://img.icons8.com/?size=100&id=89978&format=png&color=000000"
                                                                    alt="Edit"
                                                                    className="w-5 h-5"
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteMessage(msg.id)}
                                                                className="text-red-600 hover:opacity-75 transition duration-200 ml-2"
                                                                aria-label="Delete Message"
                                                            >
                                                                <img
                                                                    src="https://img.icons8.com/?size=100&id=11997&format=png&color=000000"
                                                                    alt="Delete"
                                                                    className="w-5 h-5"
                                                                />
                                                            </button>
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </div>
                            ))
                        )}
                    </ul>
                </main>
    
                <div className="bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700 p-4 shadow-md">
                    <form onSubmit={handleSendMessage} className="flex flex-wrap items-center">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Введите сообщение..."
                            className="flex-1 border border-gray-300 dark:border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition duration-200 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm hover:shadow-md"
                        />

                        <button
                            type="button"
                            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
                            className="ml-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-200 shadow-md flex items-center justify-center"
                            aria-label="Choose Emoji"
                        >
                            😊
                        </button>

                        {isEmojiPickerOpen && <EmojiPicker addEmoji={addEmoji} />}

                        <label htmlFor="file-upload" className="cursor-pointer ml-2">
                            <img
                                src="https://img.icons8.com/?size=100&id=82yuAoaPrnSq&format=png&color=000000"
                                alt="Upload"
                                className="w-8 h-8 hover:opacity-75 transition duration-200"
                            />
                            <input
                                id="file-upload"
                                type="file"
                                onChange={handleFileChange}
                                className="hidden"
                                ref={fileInputRef}
                            />
                        </label>

                        {file && (
                            <div className="flex items-center ml-2">
                                <span className="text-gray-600 dark:text-gray-300">{fileName}</span>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="ml-2 text-red-600 underline hover:text-red-800 transition duration-200"
                                >
                                    Отменить
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 shadow-md flex items-center justify-center"
                            aria-label="Send Message"
                        >
                            <img
                                src="https://img.icons8.com/?size=100&id=W8DDWFlaXiOE&format=png&color=000000"
                                alt="Send"
                                className="w-6 h-6"
                            />
                        </button>

                        {editMessageId && (
                            <button
                                type="button"
                                onClick={() => handleEditMessage(editMessageId, newMessage)}
                                className="ml-2 p-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition duration-200 shadow-md"
                                aria-label="Save Changes"
                            >
                                <img
                                    src="https://img.icons8.com/?size=100&id=103201&format=png&color=000000"
                                    alt="Save Changes"
                                    className="w-6 h-6"
                                />
                            </button>
                        )}
                    </form>
                </div>
            </div>
    
            {modalOpen && (
                <Modal
                    mediaUrl={mediaUrl}
                    mediaType={mediaType}
                    onClose={() => setModalOpen(false)}
                />
            )}
    
            {confirmDeleteOpen && (
                <ConfirmationModal
                    title="Подтверждение удаления"
                    message="Вы уверены, что хотите удалить это сообщение?"
                    onConfirm={confirmDelete}
                    onClose={() => {
                        setConfirmDeleteOpen(false);
                        setMessageIdToDelete(null);
                    }}
                />
            )}
    
            {clearModalOpen && (
                <ClearMessagesModal
                    onClose={() => setClearModalOpen(false)}
                    onConfirm={(deleteType) => handleClearMessages(deleteType, receiverId)}
                />
            )}
    
            <button
                onClick={() => setSidebarOpen(prev => !prev)}
                className="fixed top-1/2 left-0 transform -translate-y-1/2 p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 z-40 transition duration-200"
                aria-label="Toggle Sidebar"
            >
                {sidebarOpen ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                )}
            </button>
        </div>
    );
    
};

export default ChatPage;
