import React from 'react'

const Artists = ({result}) => {

const showTracks=()=>{
  

}

  return (
    <div>  
        {result.name}
        {result.images?.length ? (
        <img width={"0%"} src={result.images[0]?.url} alt="" />
    ) : (
        <div>No Image</div>
    )} </div>
  )
}

export default Artists