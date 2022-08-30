import { useEffect, useState } from 'react'
import { useTailwind } from 'tailwind-rn'
import { View, Text, ImageBackground, Image } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

import useAPI from '../../hooks/useAPI'

import Header from './header'
import Cards from './cards'
import SearchBar from './search-bar'

const HomeScreen = ({ navigation }) => {
  const tailwind = useTailwind()
  const { loading, currentData, reset } = useAPI()

  useEffect(() => {
    console.log('reset state')
    reset()
  }, [])

  return (
    <View style={tailwind(`flex flex-col w-full h-full`)}>
      <Header />
      {loading ? (
        <View
          style={tailwind(`grow flex flex-col items-center justify-center`)}
        >
          <View style={tailwind(`w-28 h-28`)}>
            <ActivityIndicator
              animating={true}
              color={'#0891b2'}
              size="large"
            />
          </View>
        </View>
      ) : (
        <>
          <SearchBar />
          {currentData && currentData?.meta?.pagination?.total < 1 ? (
            <View
              style={tailwind('grow flex flex-col items-center justify-center')}
            >
              <View></View>
              <View style={tailwind(`p-2`)}>
                <Text stlye={tailwind('text-slate-900 text-lg')}>
                  沒有相關影片
                </Text>
              </View>
            </View>
          ) : (
            <>
              <Cards navigation={navigation} />
            </>
          )}
        </>
      )}
    </View>
  )
}

export default HomeScreen
