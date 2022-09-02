import { useState } from 'react'
import { useTailwind } from 'tailwind-rn'
import { View, Text, ImageBackground, Image } from 'react-native'
import { includes, isArray, map, range, tail } from 'lodash'
import { Avatar } from 'react-native-paper'

import useAPI from '../../hooks/useAPI'
import Button from '../Button'

const IndexCards = ({ navigation }) => {
  const tailwind = useTailwind()
  const { currentData, type } = useAPI()

  const Cards = () => {
    if (currentData?.data && isArray(currentData.data)) {
      return map(currentData.data, (item) => {
        const year = item?.attributes?.year || ''
        const tags = map(item?.attributes?.tags?.data || [], (tag) => {
          return tag?.attributes?.name
        })
        const isHot = includes(tags, '熱門電影')
        const title = item?.attributes?.title
          ? `${item.attributes.title} ${
              item?.attributes?.season ? ` [第${item.attributes.season}季]` : ''
            }`
          : ''
        return (
          <Button
            style={
              'mr-2 mb-3 w-24 h-36 overflow-hidden rounded-xl border-3 border-slate-500 opacity-90'
            }
            _style={'border-cyan-500 opacity-100'}
            id={`Card__${item.id}`}
            key={`Card__${item.id}`}
            metadata={item.attributes}
            onPress={() => {
              navigation.navigate('Player', {
                item: {
                  ...item,
                  type,
                },
              })
            }}
          >
            <ImageBackground
              source={{
                uri: item.attributes.poster,
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
              style={tailwind('w-full h-full')}
            >
              {year ? (
                <View
                  style={tailwind(
                    `absolute left-0 top-0 p-1 bg-zinc-900/70 rounded-br-xl`
                  )}
                >
                  <Text style={tailwind('text-slate-100 text-xs')}>{year}</Text>
                </View>
              ) : null}
              {isHot ? (
                <View style={tailwind(`absolute right-0 top-0`)}>
                  <Text style={tailwind('text-slate-100 text-xs')}>
                    <Avatar.Icon
                      size={18}
                      icon={'thumb-up'}
                      color="#0891b2"
                      style={tailwind('bg-transparent')}
                    />
                  </Text>
                </View>
              ) : null}
              <View style={tailwind('w-full h-full flex flex-col justify-end')}>
                <View style={tailwind('p-1 bg-zinc-900/50 w-full')}>
                  <Text style={tailwind('text-slate-100 text-xs')}>
                    {title}
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </Button>
        )
      })
    }
    return null
  }

  return (
    <View style={tailwind('px-2 grow w-full flex')}>
      <View
        style={tailwind(
          'flex flex-row grow flex-wrap justify-center items-center'
        )}
      >
        {<Cards />}
      </View>
    </View>
  )
}

export default IndexCards
