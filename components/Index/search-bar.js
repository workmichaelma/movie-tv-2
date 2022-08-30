import { useTailwind } from 'tailwind-rn'
import { View, Text } from 'react-native'
import useAPI from '../../hooks/useAPI'
const IndexSearchBar = () => {
  const tailwind = useTailwind()
  const { region, type, year, category } = useAPI()

  const _region = region === null ? '所有地區' : region
  const _category = category === null ? '' : category.replace(/片|電影/g, '')
  const _year = year === null ? '' : `在 ${year} 年上映的`
  let text = type === 'movies' ? '電影' : type === 'dramas' ? '連續劇' : '劇集'

  if (region === null && year === null && category === null) {
    text = `所有${text}`
  } else {
    text = ` ${_region} ${_year} ${_category}${text}`
  }

  return (
    <View
      style={tailwind(`flex flex-row pt-1 w-full justify-center`)}
      accessible={false}
    >
      <Text style={tailwind(`text-sm text-slate-700`)} accessible={false}>
        現正顯示{text}
      </Text>
    </View>
  )
}

export default IndexSearchBar
