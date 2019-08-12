import React, { useState, useEffect } from "react"
import { View, Text, Button, TextInput, Alert, AsyncStorage, ScrollView, ActivityIndicator } from "react-native"
import { NavigationScreenComponent } from "react-navigation"
import { useDispatch } from "react-redux"
import axios from "axios"
import { InputAndroid, InputAndroidPassword } from "./Utils/AnimatableInput"

const Login: NavigationScreenComponent<{}> = props => {

    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)

    const setToken = (token: string) => {
        dispatch({
            type: "SET_TOKEN",
            payload: token
        })
    }

    const [usuario, setUsuario] = useState<string>("")
    const [contraseña, setContraseña] = useState<string>("")

    useEffect(() => {
        AsyncStorage.getItem("token")
        .then(token => {
            if (token) {
                    setToken(token)
                    setLoading(false)
                    props.navigation.navigate("Main")
            } else {
                setLoading(false)
            }
        })
    }, [])

    const cambiarUsuario = (text: string) => {
        setUsuario(text)
    }

    const cambiarContraseña = (text: string) => {
        setContraseña(text)
    }

    return(
        <ScrollView contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between'
        }}>
            <View pointerEvents={loading ? "none" : "auto"}>
                <Text style={{fontSize: 24, fontWeight: "bold", textAlign: "center", paddingVertical: 15}}>Iniciar sesión</Text>
                <InputAndroid placeholder="Ingresa usuario..." bindedFunction={cambiarUsuario} containerStyle={{marginHorizontal: 20}} inputStyle={{fontSize: 20, borderBottomColor: "gray", borderBottomWidth: 2}} value={usuario}/>
                <InputAndroidPassword placeholder="Ingresa contraseña..." bindedFunction={cambiarContraseña} containerStyle={{marginHorizontal: 20}} inputStyle={{fontSize: 20, borderBottomColor: "gray", borderBottomWidth: 2}} value={contraseña} />
            </View>
            <View pointerEvents={loading ? "none" : "auto"} style={{paddingVertical: 80, marginHorizontal: 40}}>
                <Button title="Inicia sesión" onPress={() => {
                    if (usuario === "") {
                        Alert.alert("Falta ingresar usuario.")
                    } else if (contraseña === "") {
                        Alert.alert("Falta ingresar contraseña.")
                    } else {
                        setLoading(true)
                        axios.get(`http://192.168.1.200:3000/login?username=${usuario}&password=${contraseña}`)
                        .then(acceso => {
                            AsyncStorage.setItem("token", acceso.data)
                            .then(token => {
                                setLoading(false)
                                setToken(acceso.data)
                                props.navigation.navigate("Main")
                            })
                            .catch(error => {
                                setLoading(false)
                                Alert.alert("Error. Intenta de nuevo.")
                            })
                        })
                        .catch(error => {
                            console.log(error)
                            if (error.response !== undefined) {
                                if (error.response.status === 403) {
                                    setLoading(false)
                                    Alert.alert("Datos incorrectos.")
                                    
                                } else {
                                    setLoading(false)
                                    Alert.alert("Error desconocido.")
                                    
                                }
                            } else {
                                setLoading(false)
                                Alert.alert("Error de conexión.")
                            }
                        })
                    }}}
                />
            </View>
            {loading && <View style={{position: "absolute", top: 0, bottom: 0, right: 0, left: 0, alignItems: "center", justifyContent: "center"}}>
                <ActivityIndicator size="large" />
            </View>}
        </ScrollView>

    )
}

export default Login