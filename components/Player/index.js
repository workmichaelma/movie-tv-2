import { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn'
import { View, Text, ImageBackground, Image } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import { PlayerProvider } from '../../hooks/usePlayer'

import Player from './player'
import Header from './header'
import Button from '../Button'
import { Video } from 'expo-av'
// https://www.movieffm.net/wp-content/uploads/2020/05/os8ezpT9twtMgYKzSw1TbnFpRjU-185x278.jpg
const PlayScreen = ({ route, navigation }) => {
  const tailwind = useTailwind()
  const { item, type } = route.params

  return (
    <PlayerProvider item={item} type={type}>
      <View style={tailwind(`flex flex-col w-full h-full`)}>
        <Header navigation={navigation} />
        <Player />
      </View>
    </PlayerProvider>
  )
}

export default PlayScreen
