import React from 'react'

const ReadManga = ({selectedManga, toggleModal}) => {
    let windowObjectReference = null; // global variable
    let title=selectedManga.data.attributes.title?.en;
    let urlTitle= title.replace(/\s/g, "-");
    const width = 400; // Specify the width of the new window
    const height = 600; // Specify the height of the new window
    

    function openRequestedTab(url, bookOpened) {
        if (windowObjectReference === null || windowObjectReference.closed) {
            windowObjectReference = window.open(url, bookOpened, `width=${width},height=${height}`);

        } else {
            windowObjectReference.focus();
            <alert>Book couldnt open. Try enabling pop-ups and try again.</alert>
        }
        console.log(url)
    }


return (
    <div>
        <button onClick={(()=>openRequestedTab(`https://mangadex.org/title/${selectedManga.data.id}/${urlTitle}`,'bookOpened'))} id="read">Read</button>
    </div>
)
}

export default ReadManga