import { useState, useMemo, useEffect } from 'react'
import { useTailwind } from 'tailwind-rn'
import { View, Text } from 'react-native'
import { Avatar } from 'react-native-paper'
import { get, includes, isEmpty, isObject, map, range, take } from 'lodash'

import Button from '../Button'
import useButton from '../../hooks/useButton'
import useAPI from '../../hooks/useAPI'

const _categories = {
  funny: '喜劇片',
  action: '動作片',
  cartoon: '動畫片',
  war: '戰爭片',
  scare: '驚悚片',
  music: '音樂片',
  sport: '運動片',
  record: '紀錄片',
  science: '科幻片',
  crime: '犯罪片',
  disaster: '災難片',
  history: '歷史片',
  suspense: '懸疑片',
  hot: '熱門電影',
  netflix: 'netflix',
}
const _regions = {
  movies: {
    hk: '香港',
    cn: '大陸',
    tw: '台灣',
    us: '歐美',
    kr: '韓國',
    jp: '日本',
  },
  tvshows: {
    hk: '香港',
    cn: '大陸',
    tw: '台灣',
    us: '歐美',
    kr: '韓國',
    jp: '日本',
  },
  dramas: {
    hk: '香港',
    cn: '大陸',
    tw: '台灣',
    us: '美國',
    kr: '韓國',
    eng: '英國',
    jp: '日本',
  },
}
const _types = {
  movies: '電影',
  tvshows: '劇集',
  dramas: '連續劇',
}

const IndexHeader = () => {
  const tailwind = useTailwind()

  const [more, setMore] = useState(false)
  const { button } = useButton()
  const {
    reset,
    currentData,
    prevPage,
    nextPage,
    year: currentYear,
    region: currentRegion,
    category: currentCategory,
    type: currentType,
    setYear,
    setRegion,
    setCategory,
    setType,
  } = useAPI()

  const style = 'border-1 border-transparent border-b-slate-700 p-1 mr-2'
  const _style = 'border-cyan-400'
  const _selectedStyle = 'border-b-cyan-400'
  const selectedStyle = (selected) => {
    return {
      text: selected ? 'font-bold text-slate-500' : '',
      btn: selected ? 'border-slate-400 bg-neutral-200' : '',
    }
  }

  const tagStyle = tailwind(
    'text-slate-300 py-1 mr-2 text-xs border-b-1 border-slate-300'
  )

  const itemFocusing = useMemo(() => {
    if (isObject(button) && includes(get(button, 'buttonId', ''), 'Card__')) {
      const item = get(button, 'metadata')
      if (item) {
        const title = item?.title
          ? `${item.title} ${item?.season ? ` [第${item.season}季]` : ''}`
          : ''
        return {
          title,
          region: item?.region || '',
          year: item?.year || '',
          tags: map(item?.tags?.data || [], (tag) => {
            return get(tag, 'attributes.name', '')
          }),
        }
      }
      return {}
    }
    return {}
  })

  useEffect(() => {
    if (!isEmpty(itemFocusing)) {
      setMore(false)
    }
  }, [itemFocusing])

  const years = () => {
    return (
      <View
        style={tailwind(
          'flex flex-row-reverse items-center justify-center flex-wrap'
        )}
      >
        {map(range(16), (i, index) => {
          const _year = 2022 - index
          const is2007 = _year === 2007
          const year = is2007 ? '2007-1970' : _year
          return (
            <Button
              style={`${style} mt-2 `}
              _style={`${_style}`}
              id={`filter__year-${year}`}
              key={`filter__year-${year}`}
              selected={year === currentYear}
              selectedStyle={_selectedStyle}
              onPress={() => {
                setYear(year)
                setMore(false)
              }}
            >
              <Text style={tailwind(`text-cyan-400`)}>{year}</Text>
            </Button>
          )
        })}
      </View>
    )
  }
  const categories = () => {
    if (currentType === 'dramas') {
      return null
    } else {
      return (
        <View
          style={tailwind(
            'flex flex-row items-center grow justify-center mb-2 border-b-1 pb-2 border-slate-300'
          )}
        >
          {map(_categories, (name, index) => {
            return (
              <Button
                style={`${style} mt-2 capitalize`}
                _style={_style}
                id={`filter__category-${index}`}
                key={`filter__category-${index}`}
                selected={name === currentCategory}
                selectedStyle={_selectedStyle}
                onPress={() => {
                  setCategory(name)
                  setMore(false)
                }}
              >
                <Text style={tailwind('text-cyan-600')}>{name}</Text>
              </Button>
            )
          })}
        </View>
      )
    }
  }
  const types = () => {
    return map(_types, (name, index) => {
      return (
        <Button
          style={`${style} `}
          _style={_style}
          id={`filter__type-${index}`}
          key={`filter__type-${index}`}
          selected={index === currentType}
          selectedStyle={_selectedStyle}
          onPress={() => {
            setYear(null)
            setCategory(null)
            setType(index)
          }}
        >
          <Text style={tailwind(`text-cyan-400`)}>{name}</Text>
        </Button>
      )
    })
  }
  const regions = () => {
    return map(_regions[currentType], (name, index) => {
      const { text, btn } = selectedStyle(name === currentRegion)
      return (
        <Button
          style={`${style} capitalize ${btn}`}
          _style={_style}
          id={`filter__${index}`}
          key={`filter__${index}`}
          onPress={() => {
            setRegion(name)
          }}
        >
          <Text style={tailwind(`text-cyan-400 ${text}`)}>{name}</Text>
        </Button>
      )
    })
  }
  return (
    <View
      style={tailwind('p-2 w-full bg-neutral-800 border-b-2 border-slate-300')}
    >
      <View style={tailwind('flex flex-row static')}>
        <View style={tailwind('flex flex-row items-center')}>
          <Button
            style={style}
            _style={_style}
            id={'next_page'}
            onPress={() => {
              nextPage()
            }}
          >
            <Text style={tailwind('text-cyan-400')}>下一頁</Text>
          </Button>
          <Button
            style={style}
            _style={_style}
            id={'prev_page'}
            onPress={() => {
              prevPage()
            }}
          >
            <Text style={tailwind('text-cyan-400')}>上一頁</Text>
          </Button>
        </View>

        <View
          style={tailwind('flex flex-row items-center px-2')}
          accessible={false}
        >
          {isObject(currentData) &&
          !isEmpty(currentData?.meta?.pagination) &&
          currentData?.meta?.pagination?.pageCount > 0 ? (
            <>
              <Text
                style={tailwind(`text-slate-300 text-xs`)}
                accessible={false}
              >
                第 {currentData.meta.pagination.page} 頁，
              </Text>
              <Text
                style={tailwind(`text-slate-300 text-xs`)}
                accessible={false}
              >
                共 {currentData.meta.pagination.pageCount} 頁
              </Text>
            </>
          ) : null}
        </View>

        <View
          style={tailwind(
            'flex flex-row shrink grow overflow-hidden items-center px-4'
          )}
        >
          {isObject(itemFocusing) && !isEmpty(itemFocusing) ? (
            <>
              <View style={tailwind('w-52')}>
                <Text style={tailwind(`text-slate-300 text-center`)}>
                  {itemFocusing.title}
                </Text>
              </View>
              <Text style={tagStyle}>{itemFocusing.year}年</Text>
              <Text style={tagStyle}>{itemFocusing.region}片</Text>
              {map(take(itemFocusing.tags, 5), (tag) => {
                return (
                  <Text style={tagStyle} key={`itemFocusingTag__${tag}`}>
                    {tag}
                  </Text>
                )
              })}
            </>
          ) : (
            <View style={tailwind('flex flex-row grow justify-center')}>
              {regions()}
            </View>
          )}
        </View>
        <View style={tailwind('flex flex-row items-center pl-1')}>
          {types()}
        </View>
        <View style={tailwind('flex flex-row items-center')}>
          <Button
            style={`${style} border-b-red-500`}
            _style={`${_style} border-red-500`}
            id={'filter__reset'}
            onPress={() => {
              reset()
              setMore(false)
            }}
          >
            <Text style={tailwind('text-red-500')}>重設</Text>
          </Button>
          <Button
            style={'border-1 border-slate-400 rounded-full'}
            _style={`${_style} bg-neutral-100`}
            id={'filter__more'}
            onPress={() => {
              more ? setMore(false) : setMore(true)
            }}
          >
            <Avatar.Icon
              size={24}
              icon={more ? 'close' : 'filter-variant'}
              color="#0891b2"
              style={tailwind('bg-transparent')}
            />
          </Button>
        </View>
      </View>
      {more ? (
        <View style={tailwind('mt-2 pt-2 border-t-1 border-slate-300 z-[100]')}>
          {categories()}
          {years()}
        </View>
      ) : null}
    </View>
  )
}

export default IndexHeader
