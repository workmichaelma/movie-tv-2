import axios from 'axios'
import { get } from 'lodash'
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react'
const Buffer = require('buffer').Buffer

const Context = createContext({})

const toBase64 = (obj) => {
  return new Buffer(JSON.stringify(obj)).toString('base64')
}

const fetch = async ({ type, year, category, page, region }) => {
  try {
    let filters = `&pagination[page]=${page}`
    if (year) {
      if (year === '2007-1970') {
        filters += `&filters[year][$gte]=1970&filters[year][$lte]=2007`
      } else {
        filters += `&filters[year][$eq]=${year}`
      }
    }
    if (category && type !== 'dramas') {
      filters += `&filters[tags][name][$eq]=${category}`
    }
    if (region) {
      filters += `&filters[region][$eq]=${region}`
    }
    const url = `http://128.199.246.210:1337/api/${type}?sort[0]=id:desc&populate=%2A&pagination[pageSize]=27${filters}`
    console.log(
      `fetching: ${JSON.stringify({
        type,
        category,
        year,
        page,
      })}, filters: ${filters}, url: ${url}`
    )
    const { data } = await axios.get(url)
    return data
  } catch (err) {
    console.log(err)
    return {}
  }
}

const initState = {
  page: 0,
  year: null,
  category: null,
  type: 'movies',
  region: null,
}

export const APIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [store, setStore] = useState({})
  const [config, setConfig] = useState(initState)

  const [currentData, setCurrentData] = useState(null)

  const page = useMemo(() => {
    return config.page
  }, [config])
  const year = useMemo(() => {
    return config.year
  }, [config])
  const category = useMemo(() => {
    return config.category
  }, [config])
  const type = useMemo(() => {
    return config.type
  }, [config])
  const region = useMemo(() => {
    return config.region
  }, [config])
  const getFetchId = ({ type, year, category, page, region }) => {
    return toBase64({
      type,
      year,
      category,
      page,
      region,
    })
  }

  const updateStore = (fetchId, data) => {
    setStore((_store) => ({
      ..._store,
      [fetchId]: data,
    }))
  }

  const reset = () => {
    setConfig({
      ...initState,
      page: 1,
    })
  }

  const nextPage = () => {
    const pagination = get(currentData, 'meta.pagination', {})
    const { page: currentPage = 1, pageCount } = pagination
    if (currentPage && pageCount) {
      if (pageCount > page) {
        setConfig({
          ...config,
          page: page + 1,
        })
      }
    }
  }

  const prevPage = () => {
    const pagination = get(currentData, 'meta.pagination', {})
    const { page: currentPage } = pagination
    if (currentPage > 1) {
      setConfig({
        ...config,
        page: page - 1,
      })
    }
  }

  useEffect(() => {
    const { type, year, category, page, region } = config
    const fetchId = getFetchId({ type, year, category, page, region })
    const getData = async () => {
      if (!store[fetchId]) {
        setLoading(true)
        const data = await fetch({ type, year, category, page, region })
        setLoading(false)
        updateStore(fetchId, data)
        setCurrentData(data)
      } else {
        console.log(`fetching from store: ${JSON.stringify(config)}`)
        setCurrentData(store[fetchId])
      }
    }

    if (page > 0) getData()
  }, [config])

  return (
    <Context.Provider
      value={{
        loading,
        page,
        type,
        category,
        year,
        region,
        currentData,
        reset,
        setLoading,
        setType: (v) => {
          setConfig({
            ...config,
            type: v,
          })
        },
        setCategory: (v) => {
          setConfig({
            ...config,
            category: v,
          })
        },
        setYear: (v) => {
          setConfig({
            ...config,
            year: v,
          })
        },
        setRegion: (v) => {
          const _ = v === region ? null : v
          console.log({ _ })
          setConfig({
            ...config,
            region: _,
          })
        },
        nextPage,
        prevPage,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default function useButton() {
  return useContext(Context)
}
