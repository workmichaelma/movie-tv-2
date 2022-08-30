import { get } from 'lodash'
import React, { useMemo } from 'react'
import { Platform, TouchableWithoutFeedback, View } from 'react-native'
let TouchableOpacityTV = TouchableWithoutFeedback
import { useTailwind } from 'tailwind-rn'

import useButton from '../hooks/useButton'

if (Platform.OS === 'android' && Platform.isTV) {
  const TouchableOpacityAndroidTV = (props, ref) => {
    /** Make sure presses on AndroidTV are sent only once */
    const onPressFilter = (e) => {
      const { onPress } = props
      const { eventKeyAction } = e
      if (onPress && eventKeyAction === 1 /*up trigger*/) {
        onPress(e)
      }
    }

    return (
      <TouchableWithoutFeedback
        {...props}
        accessibilityRole="button"
        accessible={true}
        ref={ref}
        onPress={onPressFilter}
        clickable={true}
        touchableHandleActivePressIn
      />
    )
  }
  TouchableOpacityTV = TouchableOpacityAndroidTV
}
const Button = React.forwardRef(TouchableOpacityTV)

export default ({
  children,
  id,
  _style,
  style,
  metadata,
  selected = false,
  selectedStyle = '',
  ...props
}) => {
  const tailwind = useTailwind()

  const buttonId = `button__${id}`
  const { button, setButton } = useButton()
  const isFocusing = useMemo(() => {
    return buttonId === get(button, 'buttonId')
  }, [buttonId, button])

  let styles = selected ? `${style} ${selectedStyle} ` : style
  styles = isFocusing ? `${styles} ${_style}` : styles

  return (
    <Button
      {...props}
      onFocus={() => {
        setButton({ buttonId, metadata })
      }}
    >
      <View style={tailwind(styles)}>{children}</View>
    </Button>
  )
}
