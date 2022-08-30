import axios from 'axios'
import {
  get,
  head,
  isArray,
  isEmpty,
  isObject,
  toNumber,
  uniq,
  find,
} from 'lodash'

import React, {
  createContext,
  useEffect,
  useContext,
  useState,
  useMemo,
} from 'react'

const Context = createContext({})

function millisToMinutesAndSeconds(_millis) {
  const millis = toNumber(_millis)
  var minutes = Math.floor(millis / 60000)
  var seconds = ((millis % 60000) / 1000).toFixed(0)
  return seconds == 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

const fetchFeeds = async ({ type, id }) => {
  try {
    console.log(`Fetching feeds... Type: ${type}; Id: ${id}`)
    const { data } = await axios.get(
      `http://128.199.246.210:1337/api/cronjob/fetch/feed?type=${type}&id=${id}`
    )
    if (isArray(data) && !isEmpty(data)) {
      return uniq(data)
    }
    return []
  } catch (err) {
    console.log(`${err}, Failed to fetch feeds, `)
    return null
  }
}

export const PlayerProvider = ({ children, item }) => {
  const [loading, setLoading] = useState(false)
  const [videoRef, setVideoRef] = useState(null)
  const [playerStatus, setPlayerStatus] = useState(null)
  const [feed, setFeed] = useState(null)
  const [movie, setMovie] = useState(null)
  const [episode, setEpisode] = useState(null)
  const [feedsFailed, setFeedsFailed] = useState([])
  const [feedsTried, setFeedsTried] = useState([])
  const [failedToFetch, setFailedToFetch] = useState(false)
  const play = () => {
    if (videoRef?.current) {
      videoRef.current.playAsync()
    }
  }
  const pause = () => {
    if (videoRef?.current) {
      videoRef.current.pauseAsync()
    }
  }

  const forward = (_second) => {
    try {
      const second = _second * 1000
      const { positionMillis: current } = timer
      videoRef.current.playFromPositionAsync(current + second)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const to = head(get(find(get(movie, 'feeds'), { episode }), 'feeds', []))
    switchFeed({ to })
  }, [episode])

  const switchFeed = ({ to, failed }) => {
    console.log({ to, failed })
    if (to) {
      setFeedsTried([...feedsTried, to])
      setFeed(to)
    } else if (failed) {
      setFeedsFailed([...feedsFailed, failed])
      // const { feeds = [] } = movie || {}
      // const _to = head(difference(feeds, feedsTried))
      // if (_to) {
      //   setFeedsTried([...feedsTried, _to])
      //   setFeed(_to)
      // }
    }
  }

  const timer = useMemo(() => {
    if (playerStatus) {
      const { positionMillis, playableDurationMillis, durationMillis } =
        playerStatus
      return {
        positionMillis,
        current: millisToMinutesAndSeconds(positionMillis),
        playable: millisToMinutesAndSeconds(playableDurationMillis),
        total: millisToMinutesAndSeconds(durationMillis),
        played: (positionMillis / durationMillis) * 100,
        loaded: (playableDurationMillis / durationMillis) * 100,
      }
    }
    return {}
  }, [playerStatus])

  useEffect(() => {
    const movie = {
      id: item.id,
      ...item.attributes,
    }
    setMovie(movie)
    const feeds = get(item, 'attributes.feeds', [])
    if (isEmpty(feeds)) {
      setLoading(true)
      const fetch = async () => {
        const feeds = await fetchFeeds({ type: item.type, id: item.id })
        setLoading(false)
        if ((isArray(feeds) || isObject(feeds)) && !isEmpty(feeds)) {
          setMovie({
            ...movie,
            feeds,
          })
          if (item.type === 'movies') {
            const feed = head(feeds)
            setFeed(feed)
            setFeedsTried([feed])
          } else if (item.type === 'tvshows' || item.type === 'dramas') {
            const firstEpisode = head(feeds)
            setEpisode(get(firstEpisode, 'episode', null))
          }
        } else {
          setFailedToFetch(true)
        }
      }
      fetch()
    } else {
      setFeed(head(feeds))
    }
  }, [item])
  return (
    <Context.Provider
      value={{
        play,
        pause,
        forward,
        type: item.type,
        feed,
        movie,
        episode,
        timer,
        feedsFailed,
        loading,
        failedToFetch,
        switchFeed,
        setVideoRef,
        setEpisode,
        setPlayerStatus,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default function usePlayer() {
  return useContext(Context)
}
