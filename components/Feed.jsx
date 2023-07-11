'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import ImageCard from './ImageCard'
import useSearchQuery from '@lib/useSearchQuery'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

function GalleryList({ photos, loading, setPageNumber }) {
  const observer = useRef()
  const lastPhotoRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPageNumber(prevNumber => prevNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading])

  return (
    <div className="mt-16 prompt_layout">
      {photos.map((photo, index) => {
        if (index + 1 === photos.length) {
          return <ImageCard key={photo.id} innerRed={lastPhotoRef} photo={photo} />
        } else {
          return <ImageCard key={photo.id} photo={photo} />
        }
      })}
    </div>
  )
}

const Feed = () => {
  const { data: session } = useSession()
  const [query, setQuery] = useState('')
  const [searchText, setSearchText] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const { loading, photos, error } = useSearchQuery(query, pageNumber)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setQuery(searchText)
    setPageNumber(1)
  }

  return (
    <section
      className='feed'>
      <form
        className='relative w-full flex-center'
        onSubmit={handleSubmit}
      >
        <input type="text"
          placeholder='Search for a tag or username'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={`search_input peer`}
          disabled={session?.user ? false : true}
        />
      </form>

      {
        session?.user ?
          <>
            <GalleryList
              photos={photos}
              loading={loading}
              setPageNumber={setPageNumber}
            />
            {loading &&
              <div className="w-full p-4 bg-yellow-200 border">Loading Images Please wait...</div>
            }
            {error && <>
              {error.color === 'red' &&
                <div className="w-full p-4 bg-red-300 border">{error.message}</div>
              }
              {error.color === 'white' &&
                <div className="w-full p-4 bg-yellow-200 border">{error.message}</div>
              }
            </>}
          </> :
          <div className="w-full p-4 bg-yellow-200 border">Sign In to See the Pictures</div>
      }
    </section>
  )
}

export default Feed