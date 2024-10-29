import React, { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';

function Home() {
  const [title, setTitle] = useState(''); // State for title
  const [text, setText] = useState(''); // State for note text
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);

  // Toggle textarea visibility
  const eventClick = () => {
    setShow((prev) => !prev);
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Handle textarea change
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Save note with title and text to localStorage
  const eventSubmit = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleString();
    const noteKey = `note_${new Date().getTime()}`;

    const note = { title, text, timestamp, key: noteKey };
    localStorage.setItem(noteKey, JSON.stringify(note));

    // Clear inputs
    setTitle('');
    setText('');
    fetchDataFromLocalStorage(); // Reload notes after saving
  };

  // Reset form (clear inputs)
  const eventReset = () => {
    setTitle('');
    setText('');
  };

  // Fetch notes from localStorage
  const fetchDataFromLocalStorage = () => {
    const notesList = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      try {
        const note = JSON.parse(value);
        if (note?.title && note?.text && note?.timestamp) {
          notesList.push(note);
        }
      } catch (error) {
        console.error(`Error parsing note: ${value}`, error);
      }
    }
    setNotes(notesList);
  };

  // Load notes on component mount
  useEffect(() => {
    fetchDataFromLocalStorage();
  }, []);

  // Toggle "Show Notes" visibility
  const handleShowNotes = () => {
    setShowNotes((prev) => !prev);
  };

  // Delete a note using its key
  const handleDelete = (key) => {
    localStorage.removeItem(key);
    fetchDataFromLocalStorage();
  };

  return (
    <div className="bg-white w-96 mx-auto mt-10 p-6 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">NoteBook</h1>
        <button onClick={eventClick}>
          <FiPlusCircle size={33} className="text-yellow-400" />
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={eventSubmit} onReset={eventReset}>
        {show && (
          <>
            {/* Title Input */}
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 mb-2 border rounded-lg"
              value={title}
              onChange={handleTitleChange}
            />
            {/* Textarea for Note Text */}
            <textarea
              className="w-full h-40 p-2 border rounded-lg"
              placeholder="Write your note here..."
              value={text}
              onChange={handleTextChange}
            ></textarea>
          </>
        )}

        {/* Buttons Section */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="submit"
            className="w-1/2 mr-2 p-2 font-bold bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Save
          </button>
          <button
            type="reset"
            className="w-1/2 ml-2 p-2 font-bold bg-gray-300 text-gray-700 rounded-lg hover:bg-red-400"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Show Notes Button */}
      <div className="mt-4">
        <button
          onClick={handleShowNotes}
          className="w-full p-2 font-bold bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          {showNotes ? 'Hide Notes' : 'Show Notes'}
        </button>
      </div>

      {/* Notes Display */}
      {showNotes && (
        <div className="mt-4">
          {notes.map((note) => (
            <div
              key={note.key}
              className="flex items-center justify-between p-2 border-b border-gray-300"
            >
              <div className="flex-1">
                <p className="text-sm font-bold">Title:{note.title}</p>
                <p className="text-sm">
                  <strong>{note.timestamp}</strong> - Text:{note.text}
                </p>
              </div>
              <button onClick={() => handleDelete(note.key)}>
                <RiDeleteBinLine
                  size={24}
                  className="text-red-400 hover:text-red-600"
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
