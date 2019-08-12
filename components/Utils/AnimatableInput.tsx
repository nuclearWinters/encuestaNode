import React from 'react';
import {
  Animated,
  TextInput,
  View
} from 'react-native';

const InputAndroid = (props: any) => {
    const _animated = new Animated.Value(0)
    let {
        inputStyle,
        containerStyle,
        value,
        placeholder,
        bindedFunction
    } = props
    return (
        <View style={containerStyle}>
            <TextInput
                style={inputStyle}
                underlineColorAndroid={'transparent'}
                placeholder={placeholder}
                value={value}
                onChangeText={bindedFunction}
                onFocus={() => {
                    Animated.timing(_animated, {
                        toValue: 1,
                        duration: 300
                    }).start()
                }}
                onBlur={() => {
                    Animated.timing(_animated, {
                        toValue: 0,
                        duration: 300
                    }).start()
                }}
            />
            <Animated.View
                style={[
                    {position: "absolute", bottom: 0, left: 0, top: 0, borderBottomColor: "rgb(33,150,243)", borderBottomWidth: 3, width: "0%"},
                    {
                        width: _animated.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"]
                        })
                    }
                ]}
            />
        </View>
    );
}

const InputAndroidPassword = (props: any) => {
    const _animated = new Animated.Value(0);
    let {
        inputStyle,
        containerStyle,
        value,
        placeholder,
        bindedFunction
    } = props
    return (
        <View style={containerStyle}>
            <TextInput
                secureTextEntry={true}
                style={inputStyle}
                underlineColorAndroid={'transparent'}
                placeholderTextColor="rgb(153,153,153)"
                placeholder={placeholder}
                value={value}
                onChangeText={bindedFunction}
                onFocus={() => {
                    Animated.timing(_animated, {
                        toValue: 1,
                        duration: 300
                    }).start()
                }}
                onBlur={() => {
                    Animated.timing(_animated, {
                        toValue: 0,
                        duration: 300
                    }).start()
                }}
            />
            <Animated.View
                style={[
                    {position: "absolute", bottom: 0, left: 0, top: 0, borderBottomColor: "rgb(33,150,243)", borderBottomWidth: 3, width: "0%"},
                    {
                        width: _animated.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", "100%"]
                        })
                    }
                ]}
            />
        </View>
    );
}

export {
    InputAndroid,
    InputAndroidPassword
}