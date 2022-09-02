import { useTailwind } from 'tailwind-rn'
import { useEffect, useRef, useState } from 'react'
import { ActivityIndicator } from 'react-native-paper'
import { View, Text } from 'react-native'

import usePlayer from '../../hooks/usePlayer'
import { Video } from 'expo-av'
import { includes } from 'lodash'

const Player = () => {
  const tailwind = useTailwind()
  const {
    feed,
    videoRef,
    setPlayerStatus,
    switchFeed,
    loading,
    failedToFetch,
    feedsFailed,
  } = usePlayer()
  const [sourceLoading, setSourceLoading] = useState(false)

  const Loading = (loading) => {
    if (loading) {
      return (
        <View
          style={tailwind(
            `w-full h-full flex flex-row items-center justify-center bg-black`
          )}
        >
          <View style={tailwind(`w-28 h-28`)}>
            <ActivityIndicator
              animating={true}
              color={'#0891b2'}
              size="large"
            />
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  if (loading) {
    return <Loading loading={loading} />
  } else if (failedToFetch) {
    return (
      <View
        style={tailwind(
          `w-full h-full flex flex-row items-center justify-center bg-black`
        )}
      >
        <Text style={tailwind(`text-lg text-slate-200`)}>
          無法獲取片源，請觀看其他電影
        </Text>
      </View>
    )
  } else if (includes(feedsFailed, feed)) {
    return (
      <View
        style={tailwind(
          `w-full h-full flex flex-row items-center justify-center bg-black`
        )}
      >
        <Text style={tailwind(`text-lg text-slate-200`)}>
          此片源無效，請選擇其他片源
        </Text>
      </View>
    )
  } else if (feed) {
    return (
      <>
        <Video
          ref={videoRef}
          style={tailwind('w-full h-full')}
          source={{
            uri: feed,
            type: 'm3u8',
          }}
          resizeMode="stretch"
          shouldPlay
          onPlaybackStatusUpdate={(e) => {
            setPlayerStatus(e)
            if (e.isLoaded && sourceLoading) {
              setSourceLoading(false)
            }
          }}
          onError={(e) => {
            switchFeed({ failed: feed })
          }}
          onLoadStart={(e) => {
            setSourceLoading(true)
          }}
        ></Video>
        {sourceLoading ? (
          <View
            style={tailwind(
              `absolute top-0 left-0 w-full h-full flex flex-row items-center justify-center bg-black`
            )}
          >
            <Loading loading={sourceLoading} />
          </View>
        ) : null}
      </>
    )
  }
  return null
}

export default Player
