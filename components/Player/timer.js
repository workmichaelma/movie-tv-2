import { useState, useMemo, useEffect } from 'react'
import { useTailwind } from 'tailwind-rn'
import { View, Text } from 'react-native'
import { Avatar } from 'react-native-paper'

import usePlayer from '../../hooks/usePlayer'
import { isNumber, isObject } from 'lodash'

const PlayerTimer = () => {
  const tailwind = useTailwind()
  const { timer } = usePlayer()

  if (
    isObject(timer) &&
    timer?.current &&
    timer?.playable &&
    timer?.total &&
    timer?.played &&
    timer?.loaded
  ) {
    return (
      <View style={tailwind(`flex flex-row items-center w-full`)}>
        <View style={tailwind(`flex items-center w-24`)}>
          <Text style={tailwind(`text-slate-500 text-xs`)} accessible={false}>
            {`${timer.current} / ${timer.total}`}
          </Text>
        </View>
        <View
          style={tailwind(
            `w-36 h-2 rounded-md bg-slate-900 flex flex-row border-1 border-slate-700 overflow-hidden`
          )}
        >
          <View
            style={[
              tailwind(`h-full bg-slate-600`),
              { width: `${timer.played.toFixed(2)}%` },
            ]}
          />
          <View
            style={[
              tailwind(`h-full bg-slate-600`),
              { width: `${(timer.loaded - timer.played).toFixed(2)}%` },
            ]}
          />
        </View>
      </View>
    )
  }
  return null
}
export default PlayerTimer
