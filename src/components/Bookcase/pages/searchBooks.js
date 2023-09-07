import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Searchbar from '../searchbar.js'; // Correct path to Searchbar component
// import MangaDetailsModal from '../components/mangaDetailsModal.js'; // Import the modal for manga details



const SearchBooks = ({ handleAddManga, selectedMangas}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // const [mModalIsOpen, setMModalIsOpen] = useState(false);
  const [selectedManga, setSelectedManga] = useState(null); // Add state for selected manga

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };
  // const toggleModalM = () => {
  //   setMModalIsOpen(!mModalIsOpen);
  // };

  const handleMangaClick = (manga) => {
    
    setSelectedManga(manga);
    console.log(manga); 
    // toggleModalM();
    
  };
  useEffect(() => {
    if (selectedManga) {
      setSelectedManga(selectedManga);
    }
  }, [selectedManga]);
  

  return (
    <div>
      <button onClick={toggleModal} id="openSearch"
      data-toggle="tooltip" 
      data-placement="top" 
      title="Add Manga" 
      animation="true"></button>

      {/* Main Searchbar Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        contentLabel="MangaSearch"
        className='open'
      >
        <Searchbar
          handleAddManga={handleAddManga}
          selectedMangas={selectedMangas}
          onMangaClick={handleMangaClick} // Pass the click handler to Searchbar
          onCloseModal={toggleModal} // Pass the onCloseModal function
          
        />
      </Modal>

      {/* Manga Details Modal */}
      {/* <MangaDetailsModal
        isOpen={mModalIsOpen}
        // isOpen={false}
        onRequestClose={toggleModalM}
        selectedManga={selectedManga}
        onMangaClick={handleMangaClick} // Pass the click handler to Searchbar
        
      /> */}

      
    </div>
  );
};

export default SearchBooks;
