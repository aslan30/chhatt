const ConfirmationModal = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl transform transition-all duration-300 scale-100 hover:scale-105">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Подтверждение удаления</h2>
                <p className="mt-2 text-gray-700 dark:text-gray-300">Выберите, что вы хотите сделать:</p>
                <div className="flex justify-between mt-6 space-x-2">
                    <button 
                        onClick={() => { onConfirm('self'); onClose(); }} 
                        className="bg-yellow-400 text-white hover:bg-yellow-500 transition-colors duration-300 px-3 py-1.5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50" // Уменьшены отступы
                    >
                        Удалить только у себя
                    </button>
                    <button 
                        onClick={() => { onConfirm('both'); onClose(); }} 
                        className="bg-red-600 text-white hover:bg-red-700 transition-colors duration-300 px-3 py-1.5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50" // Уменьшены отступы
                    >
                        Удалить у всех
                    </button>
                    <button 
                        onClick={onClose} 
                        className="bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-300 px-3 py-1.5 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50" // Уменьшены отступы
                    >
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
