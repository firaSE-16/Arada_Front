import React from 'react'

const Depart = ({name,image}) => {
  return (
    <div>
        <img src={image} alt="" />
        <p>{name}</p>
    </div>
  )
}

export default Depart