import React from 'react'
import SearchBar from '../Filtering/SearchBar/SearchBar'
import Filter from '../Filtering/Filter/Filter'

const MyFavoriteShows = () => {
  return (
    <div className="container mx-auto bg-white">
      <p>favorite shows ...</p>
      <div className="flex flex-row">
        <SearchBar />
        <Filter />
      </div>
    </div>
  )
}

export default MyFavoriteShows
