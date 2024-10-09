import React from 'react';

function EmojiPicker({ addEmoji }) {
    const emojis = [
        '😂', '😊', '😱', '😳', '😘', '❤️', '😍', '💋', '😭', '😄', '😔',
        '😒', '😜', '😉', '😃', '😢', '😝', '😌', '😚', '😅', '😞', '😏', '😡',
        '😀', '😋', '😆', '😕'
    ];

    return (
        <div className="flex flex-wrap space-x-2">
            {emojis.map((emoji, index) => (
                <button 
                    key={index} 
                    onClick={() => addEmoji(emoji)} 
                    className="text-2xl p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                    {emoji}
                </button>
            ))}
        </div>
    );
}

export default EmojiPicker;
