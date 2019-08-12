import { createStackNavigator, createAppContainer, createSwitchNavigator, NavigationScreenProps, createDrawerNavigator } from "react-navigation";
import Login from "./components/Login"
import Main from "./components/Main"
import Preview from "./components/Preview"
import Responde from "./components/Responde"

const AppNavigator = createStackNavigator({
  Main: {
    screen: Main
  },
  Preview: {
    screen: Preview
  },
  Responde: {
    screen: Responde
  }
}, {
  defaultNavigationOptions: {
    headerTintColor: "white",
    headerStyle: {backgroundColor: "rgb(0,160,200)"},
    headerPressColorAndroid: "white",
    headerTitleStyle: {fontFamily: "Roboto-Medium", fontSize: 26}
  }
});

const SwitchNavigator = createSwitchNavigator({
  Logged: AppNavigator,
  NotLogged: Login
}, {
  initialRouteName: "NotLogged"
});

export default createAppContainer(SwitchNavigator);