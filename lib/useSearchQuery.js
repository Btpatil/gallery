import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export default function useSearchQuery(query, pageNumber) {
    const { data: session } = useSession()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [photos, setPhotos] = useState([])
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setLoading(true)
        setHasMore(true)
        setPhotos([])
    }, [query])

    useEffect(() => {
        if (!session?.user) {
            return
        }
        if(query === '') {
            query='random'
        }
        setLoading(true)
        setError(false)
        if (!hasMore) {
            setLoading(false)
            setError({
                message: 'No More Posts Available',
                color: 'white'
            })
            return
        }
        fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${pageNumber}&per_page=10&client_id=CtxJpDoIiqUC27bnZGzM_-Q9XIjeCENvXyO-3_5PkSM`)
            .then((res) => {
                return res.json()
            })
            .then((data) => {
                setPhotos(prevPhotos => {

                    return [...new Set([...prevPhotos, ...data.results])]
                })
                setLoading(false)
                setHasMore(data.total > photos.length)
            })
            .catch(e => {
                setError({
                    message: e.message,
                    color: 'red'
                })
            })
    }, [query, pageNumber, session])

    return { loading, photos, error }
}
