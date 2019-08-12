import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { createStore } from "redux"
import { Provider } from "react-redux"
import React from "react"

reducer = (state, action) => {
    switch(action.type) {
        case "SET_TOKEN":
            return {
                ...state,
                token: action.payload
            }
        default:
            return state
    }
}

const INITIAL_STATE = {token: ""}

const store = createStore(reducer, INITIAL_STATE)

const Appo = () => {
    return(
        <Provider store={store}>
            <App />
        </Provider>
    )
}

AppRegistry.registerComponent(appName, () => Appo);
