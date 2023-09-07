import React from 'react';
import Modal from 'react-modal';
import ReadManga from './readManga';

const MangaDetailsModal = ({ isOpen, onRequestClose, selectedManga }) => {
  console.log("Modal Selected Manga:", selectedManga); // Debugging statement
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="MangaDetails"
        className="open"
           >
        {selectedManga && (
          <div>
            <button 
            onClick={onRequestClose} 
            className="close" 
            data-toggle="tooltip" 
            data-placement="top" 
            title="close" 
            animation="true"
            >
            </button>
            <div id="topOffBookcase">
              <h2>{selectedManga.data.attributes.title?.en}</h2>
            </div>

            <div id="offBookcase">
              <img
                className="mangaImg"
                src={`https://uploads.mangadex.org/covers/${selectedManga.data.id}/${selectedManga.data.relationships[2]?.attributes.fileName}`}
                alt={`Cover for ${selectedManga.data.attributes.title?.en}`}
              />
              <div id="stats">
              <p>Status: {selectedManga.data.attributes?.status}</p>
              <p>Last Chapter: {selectedManga.data.attributes?.lastChapter}</p>

              <ReadManga
                selectedManga={selectedManga}

              />
              </div>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );

};

export default MangaDetailsModal;
