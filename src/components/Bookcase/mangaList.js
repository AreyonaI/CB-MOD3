import React from 'react';
import { useState } from 'react';
import MangaDetailsModal from './mangaDetailsModal';


const MangaList = ({ selectedMangas, handleRemoveManga}) => {
  const [selectedManga, setSelectedManga] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const handleMangaClick = (manga) => {
    setSelectedManga(manga);
    toggleModal();
  };
    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen); 
      };
  return (
<div>
      {/* <h2>Selected Mangas</h2> */}
      <div id="mangalist">
      {selectedMangas.map((manga, index) => (
          <div
          key={index} 
          onClick={() => handleMangaClick(manga)}
          data-toggle="tooltip" 
            data-placement="top" 
            title={manga.data.attributes.title?.en}
            animation="true"
            >
              <img
                className="mangaImg poster"
                src={`https://uploads.mangadex.org/covers/${manga.data.id}/${manga.data.relationships[2]?.attributes.fileName}`}
                alt={`Cover for ${manga.data.attributes.title?.en}`}
              />
              </div>
               ))}
     
        </div>   
  
      <MangaDetailsModal
        isOpen={modalIsOpen}
        // isOpen={false}
        onRequestClose={toggleModal}
        selectedManga={selectedManga}
        // handleRemoveManga={handleRemoveManga}

      />
    </div>
    
  
  
  );
};


export default MangaList;