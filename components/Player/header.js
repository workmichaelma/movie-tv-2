import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTailwind } from 'tailwind-rn'
import { View, Text, useTVEventHandler } from 'react-native'
import { Avatar } from 'react-native-paper'

import usePlayer from '../../hooks/usePlayer'
import Timer from './timer'
import Button from '../Button'
import { get, includes, map, find, isEmpty } from 'lodash'

const _modifyButton = {
  15: '15秒',
  30: '30秒',
  60: '1分鐘',
  300: '5分鐘',
  1800: '30分鐘',
}

const PlayerHeader = ({ navigation }) => {
  const tailwind = useTailwind()
  const {
    movie,
    feed,
    play,
    pause,
    forward,
    switchFeed,
    feedsFailed,
    episode,
    type,
    setEpisode,
  } = usePlayer()
  const [more, setMore] = useState(false)

  const [showOverlay, setShowOverlay] = useState(true)
  const [lastEventType, setLastEventType] = useState('')

  const { season, title, feeds } = movie || {}
  const myTVEventHandler = (evt) => {
    setLastEventType(evt.eventType)
  }
  useTVEventHandler(myTVEventHandler)
  useEffect(() => {
    setShowOverlay(true)
    const hideOverlay = setTimeout(() => {
      setShowOverlay(false)
    }, 5000)
    return () => clearTimeout(hideOverlay)
  }, [lastEventType, setShowOverlay])

  const feedIsDead = useMemo(() => {
    return includes(feedsFailed, feed)
  }, [feedsFailed, feed])

  useEffect(() => {
    if (feedIsDead && !more) {
      setMore(true)
    }
  }, [feedIsDead, more])

  const modifyButton = useCallback((modify = 1) => {
    return map(_modifyButton, (w, second) => {
      const word = modify > 0 ? '快進' : '後退'
      const key = modify > 0 ? 'forward' : 'back'
      return (
        <Button
          style={`border-b-1 border-slate-700 pb-2 mx-1 p-1`}
          _style={`border-slate-200`}
          id={`player__${key}-${second}s`}
          key={`player__${key}-${second}s`}
          onPress={() => {
            forward(second * modify)
          }}
        >
          <Text
            style={tailwind(`text-xs text-slate-400`)}
          >{`${word}${w}`}</Text>
        </Button>
      )
    })
  }, [])

  const feedBtns = useMemo(() => {
    const currentFeeds =
      type === 'movies'
        ? feeds || []
        : get(find(feeds, { episode }), 'feeds', [])
    return (
      <View style={tailwind(`flex flex-col w-2/4 items-center mt-2`)}>
        <View style={tailwind(`border-b-1 border-slate-500 pb-1 w-20`)}>
          <Text
            style={tailwind(`text-slate-300 text-sm text-center`)}
            accessible={false}
          >
            片源
          </Text>
        </View>
        <View
          style={tailwind(
            `flex flex-row flex-wrap w-full justify-center items-center mt-2`
          )}
        >
          {map(currentFeeds, (_feed, index) => {
            const failed = includes(feedsFailed, _feed)
            return (
              <Button
                style={`flex flex-row items-center justify-center border-2 border-slate-500 rounded-full w-7 h-7 mr-2 mr-1 ${
                  failed ? 'border-red-300' : ''
                }`}
                _style={`border-cyan-600 bg-slate-300 ${
                  failed ? 'border-red-300' : ''
                }`}
                selected={_feed === feed}
                selectedStyle={'border-slate-300'}
                id={`player__feed-${index}`}
                key={`player__feed-${index}`}
                onPress={() => {
                  setMore(false)
                  switchFeed({ to: _feed })
                }}
              >
                <Text
                  style={tailwind(
                    `text-sm text-cyan-600 ${failed ? 'text-red-300' : ''}`
                  )}
                  accessible={!failed}
                >
                  {index + 1}
                </Text>
              </Button>
            )
          })}
        </View>
      </View>
    )
  }, [episode, feed, feedsFailed, feeds])

  const episodeBtns = useMemo(() => {
    const episodes = type === 'movies' ? [] : map(feeds || [], 'episode')
    console.log({ feeds })
    if (!isEmpty(episodes)) {
      return (
        <View
          style={tailwind(
            `flex flex-col w-2/4 justify-center items-center mt-2`
          )}
        >
          <View style={tailwind(`border-b-1 border-slate-500 pb-1 w-20`)}>
            <Text
              style={tailwind(`text-slate-300 text-sm text-center`)}
              accessible={false}
            >
              集數
            </Text>
          </View>
          <View
            style={tailwind(
              `flex flex-row flex-wrap w-full justify-center items-center mt-2`
            )}
          >
            {map(episodes, (_episode) => {
              console.log({ _episode, episode })
              const selected = _episode === episode
              return (
                <Button
                  style={`flex flex-row items-center justify-center border-2 border-slate-500 rounded-full w-7 h-7 mr-2 mb-1 ${
                    selected ? 'border-slate-300' : ''
                  } `}
                  _style={`border-cyan-600 bg-slate-300`}
                  id={`player__episode-${_episode}`}
                  key={`player__episode-${_episode}`}
                  onPress={() => {
                    setMore(false)
                    setEpisode(_episode)
                  }}
                >
                  <Text style={tailwind(`text-sm text-cyan-600`)}>
                    {_episode}
                  </Text>
                </Button>
              )
            })}
          </View>
        </View>
      )
    }
  }, [type, episode, feeds])

  if (!showOverlay && !feedIsDead) {
    return (
      <View style={tailwind(`absolute top-0 left-0 h-1 w-full`)}>
        <Text></Text>
      </View>
    )
  }

  return (
    <View
      style={tailwind(
        `flex flex-col absolute top-0 left-0 w-full p-2 bg-zinc-900 border-b-2 border-zinc-700 z-[100]`
      )}
    >
      <View style={tailwind('flex flex-row w-full items-center')}>
        <View style={tailwind(`flex flex-row w-16 justify-around`)}>
          <Button
            style={`flex items-center justify-center bg-slate-400 rounded-full h-6 w-6 border-2 border-slate-500`}
            _style={`bg-slate-200 border-cyan-600`}
            id="player__play"
            onPress={() => {
              play()
            }}
          >
            <Avatar.Icon
              size={24}
              icon={'play'}
              color="#0891b2"
              style={tailwind('bg-transparent')}
            />
          </Button>
          <Button
            style={`flex items-center justify-center bg-slate-400 rounded-full h-6 w-6 border-2 border-slate-500`}
            _style={`bg-slate-200 border-cyan-600`}
            id="player__pause"
            onPress={() => {
              pause()
            }}
          >
            <Avatar.Icon
              size={24}
              icon={'pause'}
              color="#0891b2"
              style={tailwind('bg-transparent')}
            />
          </Button>
        </View>
        <View style={tailwind(`flex flex-col w-60 mr-4`)}>
          <Timer />
        </View>
        <View style={tailwind(`flex justify-center grow`)} accessible={false}>
          <Text style={tailwind(`text-xs text-slate-400`)} accessible={false}>
            現正播放: {title} {season ? `- 第 ${season} 季` : ''}
            {episode ? `第 ${episode} 集` : ''}
          </Text>
        </View>
        {!more ? (
          <View>
            <Button
              style={`flex items-center justify-center bg-slate-400 rounded-full h-6 w-6 border-2 border-slate-500`}
              _style={`bg-slate-200 border-cyan-600`}
              id="player__setting"
              onPress={() => {
                setMore(true)
              }}
            >
              <Avatar.Icon
                size={24}
                icon={'cog-outline'}
                color="#090909"
                style={tailwind('bg-transparent')}
              />
            </Button>
          </View>
        ) : null}
        <View style={tailwind(`flex items-center ml-2`)}>
          <Button
            style={`flex items-center justify-center bg-slate-400 rounded-full h-6 w-6 border-2 border-slate-500`}
            _style={`bg-slate-200 border-cyan-600`}
            id="player__exit"
            onPress={() => {
              if (more) {
                setMore(false)
              } else {
                navigation.navigate('Home')
              }
            }}
          >
            <Avatar.Icon
              size={24}
              icon={more ? 'close' : 'exit-to-app'}
              color="#090909"
              style={tailwind('bg-transparent')}
            />
          </Button>
        </View>
      </View>
      {more ? (
        <View style={tailwind(`flex flex-col w-full`)}>
          <View
            style={tailwind(`flex flex-row w-full justify-center mt-2 w-full`)}
          >
            {episodeBtns}
            {feedBtns}
          </View>
          <View style={tailwind(`flex flex-row w-full mt-2`)}>
            <View style={tailwind(`flex flex-row justify-center`)}>
              {modifyButton()}
            </View>
            <View style={tailwind(`flex flex-row grow`)}></View>
            <View style={tailwind(`flex flex-row-reverse justify-center`)}>
              {modifyButton(-1)}
            </View>
          </View>
        </View>
      ) : null}
    </View>
  )
}

export default PlayerHeader
