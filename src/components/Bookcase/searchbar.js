import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal"; // Import Modal from react-modal

const Searchbar = ( {handleAddManga} ) => {
  const [searchInput, setSearchInput] = useState("");
  const [mangaList, setMangaList] = useState([]);
  const [mangaCovers, setMangaCovers] = useState([]);
  const [selectedManga, setSelectedManga] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);  

  const handleMangaClick = (manga) => {
    setSelectedManga(manga);
    toggleModal(); 
  };
  const handleAddMangaToSelectedList = () => {
    if (selectedManga) {
      handleAddManga(selectedManga);
      toggleModal(); // Close the modal after adding
    }
  };

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleChange = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const fetchMangaIDs = async () => {//async is a continuous method, meaning whenever we need data it can be called
      const baseUrl = "https://api.mangadex.org";
      try {
        const response = await axios.get(`${baseUrl}/manga`, {
          params: {
            title: searchInput,
          },
        });
        const mangaData = response.data.data || [];
        setMangaList(mangaData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMangaIDs();
  }, [searchInput]);


  useEffect(() => {
    const fetchMangaCovers = async () => {
      const baseUrl = "https://api.mangadex.org";
      try {
        const mangaCoversData = await Promise.all(
          mangaList.map(async (manga) => {
            const response = await axios.get(
              `${baseUrl}/manga/${manga.id}?includes[]=author&includes[]=artist&includes[]=cover_art&includes[]=description`
            );
            console.log(response.data);
            return response.data;
          })
        );
        setMangaCovers(mangaCoversData);
      } catch (error) {
        console.error(error);
      }
    };

    if (mangaList.length > 0) {
      fetchMangaCovers();
    }
  }, [mangaList]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search here"
        onChange={handleChange}
        value={searchInput}
        id="searchbar"
      />

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Cover Image</th>
          </tr>
        </thead>
        <tbody>
          {mangaCovers &&
            mangaCovers.length > 0 &&
            mangaCovers.map((manga, index) => (
              <tr key={index}>
                <td onClick={() => handleMangaClick(manga)}>
                  <h2>{manga.data.attributes.title?.en}</h2>
                  <br />
                  Author: {manga.data.relationships[0].attributes?.name},
                  Artist: {manga.data.relationships[1].attributes?.name}
                </td>
                <td>
                  <img
                   className="mangaImg mangaSearch"
                    src={`https://uploads.mangadex.org/covers/${manga.data.id}/${manga.data.relationships[2]?.attributes.fileName}`}
                    alt={`Cover for ${manga.data.attributes.title?.en}`}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal} // Use the onCloseModal prop
        contentLabel="MangaSynopsis"
        className='open'      
        >
        {selectedManga && (
          <div>
            <p>{selectedManga.data.attributes.description?.en}</p>
            <p className="bold">Alt Titles</p>
            <ul>
              {selectedManga.data.attributes.altTitles.map(
                (altTitle, index) => {
                  // Extract the language key and alternate title from each altTitle object
                  const language = Object.keys(altTitle)[0]; // Get the first key in the object
                  const title = altTitle[language]; // Get the value associated with the key

                  return (
                    <li key={index}>
                      {language}: {title}
                    </li>
                  );
                }
              )}
            </ul>
          </div>
        )}
        <button onClick={handleAddMangaToSelectedList}>Add to List</button>

        <button onClick={toggleModal}>Close</button>
      </Modal>
    </div>
  );
  };

export default Searchbar;
