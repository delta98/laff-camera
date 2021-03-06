import { SFC } from 'react'
import {
    View,
    TouchableWithoutFeedback,
    GestureResponderEvent,
} from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import React from 'react'

const FlashButtonCompoonent: SFC<{
    active: boolean
    hidden: boolean
    activationHandler: (event: GestureResponderEvent) => void
}> = props => {
    return (
        <TouchableWithoutFeedback
            onPress={props.activationHandler}
            disabled={props.hidden}
        >
            <View
                style={{
                    paddingVertical: 6,
                    paddingHorizontal: 6,
                    opacity: props.hidden ? 0 : props.active ? 0.8 : 0.5,
                    margin: 10,
                    shadowRadius: 3,
                    shadowOffset: { width: 0, height: 3 },
                    shadowOpacity: 0.5,
                    shadowColor: '#000',
                }}
            >
                <MaterialIcon
                    name={props.active ? 'flash-on' : 'flash-off'}
                    size={45}
                    color="#fff"
                />
            </View>
        </TouchableWithoutFeedback>
    )
}

export default FlashButtonCompoonent
