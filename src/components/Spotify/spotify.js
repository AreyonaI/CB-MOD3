import { createElement, useEffect, useState } from "react";
import axios from 'axios';
import Modal from "react-modal";
import IFrame from "./iframe.js";
import "./index.css";
import cd from "../../assets/cd.png";

function Spotify({ isPlaying, selectedTrack, onToggleIsPlaying, onSelectTrack }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const CLIENT_ID = "972121a8f57f4599a19ef1421911f08f";
  const REDIRECT_URI = "http://localhost:3000/home";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const SCOPE = "user-library-read";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const [searchType, setSearchType] = useState("");
  const [results, setResults] = useState([]);
  const [resultsP, setResultsP] = useState([]);
  const allSavedItems = [...results, ...resultsP];
  const [frontPageOffset, setFrontPageOffset] = useState(0);
  const [searchResultsOffset, setSearchResultsOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState("");

  const itemsPerPage = 20;

  const [displayFrontPage, setDisplayFrontPage] = useState(false);
  const [displaySearchPage, setDisplaySearchPage] = useState(false);

  const [iframeUrl, setIframeUrl] = useState(null);

  const loadIframe = (id, type) => {
    onSelectTrack(id);
    const iframeType = type || searchType; // Use the provided type or the current searchType
    setIframeUrl(`https://open.spotify.com/embed/${iframeType}/${id}?utm_source=generator`);
    onToggleIsPlaying();
  };
  

  const getToken = () => {
    const urlParams = new URLSearchParams(window.location.hash.replace("#", "?"));
    const token = urlParams.get('access_token');
    if (token) {
      setToken(token);
      window.localStorage.setItem("token", token);
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    if (token) {
      setToken(token);
    }
  }, [searchType]);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const frontPageTracks = async () => {
    try {
      const url = "https://api.spotify.com/v1/me/tracks";
      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { offset: frontPageOffset },
      });

      setResults(data.items || []);
    } catch (error) {
      console.error("Front Page Tracks API Error:", error);
    }
  };

  //   const frontPagePlaylists = async () => {
  //     try {
  //       const url = "https://api.spotify.com/v1/me/playlists";

  //       const { data } = await axios.get(url, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //         params: { offset: frontPageOffset },
  //       });
  //       console.log(data); // Log the API response for debugging
  //       setResultsP(data.items || []);//you're accessing the items property of the appropriate property in the data object based on the searchType value
  //       console.log(resultsP)
  //     } catch (error) {
  //       console.error("API Error:", error);
  //     }
  //   }
  // };

  const searchResults = async (e) => {
    if (!searchKey) {
      console.error("Invalid search key");
      return;
    }

    try {
      const url = "https://api.spotify.com/v1/search";
      const params = {
        q: searchKey,
        type: searchType,
        offset: searchResultsOffset,
      };
      const moreData = `${searchType}s`;

      const { data } = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: params,
      });

      setResults(data[moreData]?.items || []);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const loadNextFrontResults = () => {
    const newOffset = frontPageOffset + itemsPerPage;
    if (newOffset >= 0) {
      setFrontPageOffset(newOffset);
      frontPageTracks();
    }
  };

  const loadPreviousFrontResults = () => {
    const newOffset = frontPageOffset - itemsPerPage;
    if (newOffset >= 0) {
      setFrontPageOffset(newOffset);
      frontPageTracks();
    }
  };

  const loadNextSearchResults = () => {
    const newOffset = searchResultsOffset + itemsPerPage;
    if (newOffset >= 0) {
      setSearchResultsOffset(newOffset);
      searchResults();
    }
  };

  const loadPreviousSearchResults = () => {
    const newOffset = searchResultsOffset - itemsPerPage;
    if (newOffset >= 0) {
      setSearchResultsOffset(newOffset);
      searchResults();
    }
  };

  const switchToFrontPage = () => {
    setCurrentPage("homepage");
    setDisplayFrontPage(true);
    setDisplaySearchPage(false);
    setSearchKey("");
    setSearchType("");
    setFrontPageOffset(0);
    setResults([]);
  };

  const switchToSearchPage = () => {
    setCurrentPage("searchpage");
    setDisplayFrontPage(false);
    setDisplaySearchPage(true);
    setSearchKey("");
    setSearchType("");
    setSearchResultsOffset(0);
    setResults([]);
  };

  const renderAllSavedItems = () => {
    return (
      <div id="frontpage">
        {frontPageOffset > 0 && (
          <button onClick={loadPreviousFrontResults} id="previous">
            Previous
          </button>
        )}
        <button onClick={loadNextFrontResults}>Next</button>
        {allSavedItems.map((result) => (
          <div key={result.id}>
            {result.track ? (
              <div className="tracks">
                <div>
                  <h1>{result.track.name}</h1>
                  by {result.track.artists?.length ? (
                    result.track.artists[0]?.name
                  ) : (
                    <div>Unknown Artist</div>
                  )}
                  <button onClick={() => loadIframe(result.track.id, "track")}>Play</button>

                </div>
                <div>
                  {result.track.album.images?.length ? (
                    <img width={"100%"} src={result.track.album.images[0]?.url} alt="" />
                  ) : (
                    <div>No Image</div>
                  )}
                </div>
              </div>
            ) : null}
            <div className="tracks">
              {result.name ? (
                <div>
                  <div>
                    <h1>{result.name}</h1>
                    by {result.owner?.display_name}
                    <button onClick={() => {
                      setSearchType("playlist")
                      loadIframe(result.track.id);
                    }}>Play</button>
                  </div>
                  <div>
                    {result.images?.length ? (
                      <img width={"100%"} src={result.images[0]?.url} alt="" />
                    ) : (
                      <div>No Image</div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ))}
        {frontPageOffset > 0 && (
          <button onClick={loadPreviousFrontResults} id="previous">
            Previous
          </button>
        )}
        <button onClick={loadNextFrontResults}>Next</button>
      </div>
    );
  };

  const renderSearchResults = () => {
    return (
      <div>
        {searchResultsOffset > 0 && (
          <button onClick={loadPreviousSearchResults} id="previous">
            Previous
          </button>
        )}
        <button onClick={loadNextSearchResults}>Next</button>
        {results.map((result) => (
          <div key={result.id}>
            {searchType === "track" && (
              <div>
                <div>{result.name} by {result.artists?.length ? (
                  result.artists[0]?.name
                ) : (
                  <div>Unknown Artist</div>
                )}
                  <button onClick={() => {
                    console.log("Play button clicked with id:", result.id)
                    loadIframe(result.id)
                  }}>Play</button>
                </div>
                <div>
                  {result.album.images?.length ? (
                    <img width={"100%"} src={result.album.images[0]?.url} alt="" />
                  ) : (
                    <div>No Image</div>
                  )}
                </div>
              </div>
            )}
            {searchType === "playlist" && (
              <div>
                <div>
                  <h1>{result.name}</h1>
                  by {result.owner?.display_name}
                  <button onClick={() => {
                    console.log("Play button clicked with id:", result.id)
                    loadIframe(result.id)
                  }}>Play</button>
                </div>
                <div>
                  {result.images?.length ? (
                    <img width={"100%"} src={result.images[0]?.url} alt="" />
                  ) : (
                    <div>No Image</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        {searchResultsOffset > 0 && (
          <button onClick={loadPreviousSearchResults} id="previous">
            Previous
          </button>
        )}
        <button onClick={loadNextSearchResults}>Next</button>
      </div>
    );
  };

  return (
    <div id="music">
      <div className="dropdown">
        <div onClick={toggleModal} className="dropbtn">
          <img
            src={cd}
            alt="cd"
            data-toggle="tooltip"
            data-placement="top"
            title="Spotify Portal"
            animation="true"
          ></img>
        </div>
        <div className="dropdown-content">
          {isPlaying && selectedTrack && <IFrame iframeUrl={iframeUrl} />}
        </div>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={toggleModal}>
        <div className="spotify-content">
          <header className="App-header">
            <h1>Mini Spotify Portal</h1>
            {!token ? (
              <a
                href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
              >
                Login to Spotify
              </a>
            ) : (
              <button onClick={logout}>Logout</button>
            )}

            {token && (
              <div id="firstpage">
                <div id="pages">
                  <p
                    onClick={() => {
                      switchToFrontPage();
                    }}
                  >
                    Homepage
                  </p>

                  <p
                    onClick={() => {
                      setDisplayFrontPage(false);
                      setDisplaySearchPage(true);
                      switchToSearchPage();
                    }}
                  >
                    SearchPage
                  </p>
                </div>
              </div>
            )}

            {currentPage === "homepage" && displayFrontPage ? (
              renderAllSavedItems()
            ) : currentPage === "searchpage" ? (
              <div>
                <form onSubmit={searchResults}>
                  <input type="text" onChange={(e) => setSearchKey(e.target.value)} />
                  <select
                    onChange={(e) => {
                      setSearchType(e.target.value);
                    }}
                  >
                    <option value=""></option>
                    <option value="track">Track</option>
                    <option value="playlist">Playlist</option>
                  </select>
                  <button type="submit">Search</button>
                </form>
                {renderSearchResults()}
              </div>
            ) : null}
          </header>
        </div>
      </Modal>
    </div>
  );
}

export default Spotify;