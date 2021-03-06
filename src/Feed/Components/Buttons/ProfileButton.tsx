import { SFC } from 'react'
import { View } from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather'
import React from 'react'

const ProfileButtonComponent: SFC<{}> = () => {
    return (
        <View
            style={{
                paddingVertical: 6,
                paddingHorizontal: 6,
                opacity: 0.8,
                margin: 10,
                shadowRadius: 1,
                shadowOffset: { width: 3, height: 3 },
                shadowOpacity: 0.3,
                shadowColor: '#000',
            }}
        >
            <FeatherIcon
                name="user"
                size={40}
                color="#fff"
                style={{ marginLeft: 0 }}
            />
        </View>
    )
}

export default ProfileButtonComponent
