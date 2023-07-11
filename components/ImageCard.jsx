'use client'
import { useState } from "react"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { BlurhashCanvas } from 'react-blurhash';

const ImageCard = ({ innerRed, photo }) => {
  const {data: session} = useSession()
  const [like, setLike] = useState(false);
  const [imgIsLoading, setImgIsLoading] = useState(true);
  const onLoaded = () => setImgIsLoading(false);

  const likePost = (e) => {
    setLike(prev => !prev)
  }

  return (
    <div ref={innerRed} className={`prompt_card relative bg-[${photo.color}] rounded-md hovereffect`} onDoubleClick={likePost}>
      {imgIsLoading && <BlurhashCanvas hash={photo.blur_hash} className="absolute top-0 bottom-0 left-0 right-0 z-10 w-full h-full"  />}
      <Image alt={photo.description} src={photo.urls.full} width={100} height={100} className="w-full h-full z-0 rounded-lg" onLoad={onLoaded} />
      <div className="title absolute left-4 bottom-2 text-white limit-1 w-[70%] z-30 hidden">
        <p>{photo.alt_description}</p>
      </div>
      <div className={`py-1 px-2 absolute right-1 bottom-2 border-1 rounded-md ${like ? 'bg-red-400 transition-all ease-in' : 'transition-all ease-in bg-white '} z-30`}>
        <button onClick={likePost}>Like</button>
      </div>
    </div>
  )
}

export default ImageCard