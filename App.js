// In App.js in a new project

import * as React from 'react'
import { useKeepAwake } from 'expo-keep-awake'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { TailwindProvider } from 'tailwind-rn'
import utilities from './tailwind.json'

import { ButtonProvider } from './hooks/useButton'
import { APIProvider } from './hooks/useAPI'
import IndexPage from './components/Index/index'
import PlayerPage from './components/Player/index'

const Stack = createNativeStackNavigator()

function App() {
  useKeepAwake()
  return (
    <APIProvider>
      <ButtonProvider>
        <TailwindProvider utilities={utilities}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={IndexPage} />
              <Stack.Screen name="Player" component={PlayerPage} />
            </Stack.Navigator>
          </NavigationContainer>
        </TailwindProvider>
      </ButtonProvider>
    </APIProvider>
  )
}
export default App
