import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import MangaList from './Bookcase/mangaList';
import '../App.css';
import { v4 as uuidv4 } from 'uuid';//uuid provides a unique ids to components
import SearchBooks from './Bookcase/pages/searchBooks.js';
import Settings from './settings.js'
import sound from "../assets/Mouse-Click-00-c-FesliyanStudios.com.mp3";
import bookcase from "../assets/bookcase.png"


import Spotify from './Spotify/spotify';

// import Scene1 from './images/scene1.gif'

Modal.setAppElement("#root");

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState("");

  const toggleIsPlaying = () => {
    setIsPlaying(!isPlaying);
  };

  const selectTrack = (trackId) => {
    setSelectedTrack(trackId);
  };


  // const location=useLocation();
  const storedMangas = useMemo(() => JSON.parse(localStorage.getItem('selectedMangas')) || [], []);
  const [selectedManga, setSelectedManga] = useState(null);
  const [selectedMangas, setSelectedMangas] = useState(storedMangas);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleAddManga = (manga) => {
    const newManga = { ...manga, id: uuidv4() };//uses uuid 4 to give each manga a new id
    const updatedMangas = [...selectedMangas, newManga];
    setSelectedMangas(updatedMangas);
    localStorage.setItem('selectedMangas', JSON.stringify(updatedMangas));
  };
  const sfx = new Audio(sound);
  // const handleRemoveManga = (mangaToBeRemoved) => {
  //   const updatedMangas= selectedMangas.filter((manga)=> manga.id !== mangaToBeRemoved.id);
  //   setSelectedMangas(updatedMangas);
  //   localStorage.setItem('selectedMangas', JSON.stringify(updatedMangas));
  //   console.log(updatedMangas)
  // };
  const playSound = () => {
    sfx.play();
  };

  const handleMangaClick = (manga) => {
    setSelectedManga(manga);
    toggleModal();
  };

  useEffect(() => {
    if (storedMangas) {
      setSelectedMangas(storedMangas);
    }
  }, [storedMangas]);

  return (
    <div className="homepage" onClick={playSound}>
      <Settings />
      <Spotify
        isPlaying={isPlaying}
        selectedTrack={selectedTrack}
        onToggleIsPlaying={toggleIsPlaying}
        onSelectTrack={selectTrack}
      />
      <div className=" App">
        <div className='bookcase'>
          <img src={bookcase} alt="bookcase"></img>
        </div>

        <SearchBooks
          handleAddManga={handleAddManga}
          selectedManga={selectedManga} // Pass the state here
          setSelectedMangas={setSelectedMangas}
          onMangaClick={handleMangaClick}
        />

        <MangaList
          selectedMangas={selectedMangas} // Pass the state here
          onMangaClick={handleMangaClick}
        // handleRemoveManga={handleRemoveManga}
        />


      


        {/* Modal */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={toggleModal}
          contentLabel="MangaDetails"
          id="openBook"
        >
          {/* ... */}
        </Modal>



      </div>
    </div>
  )
}

export default Home;
//start with nodemon server.js and npm start