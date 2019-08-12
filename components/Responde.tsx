import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, Text, ScrollView, ActivityIndicator, AsyncStorage, Alert } from "react-native"
import { NavigationScreenComponent, NavigationScreenProps } from "react-navigation"
import Icon from "react-native-vector-icons/FontAwesome5"
import axios from "axios"
import { useSelector } from "react-redux"
import uuid from 'uuid/v4'

interface Pregunta {
    Titulo: string,
    ID: string
    Opciones: string[]
}

const Responde: NavigationScreenComponent<{}> = ({ navigation }: NavigationScreenProps ) => {

    let ID: string = navigation.getParam("ID")
    let TituloEncuesta: string = navigation.getParam("TituloEncuesta")
    let Color: string = navigation.getParam("Color")
    let Preguntas: string = navigation.getParam("Preguntas")

    let [index, setIndex] = useState<number>(0)
    let [length, setLenght] = useState<number>(0)
    let [preguntas, setPreguntas] = useState<Pregunta[]>([])
    let [jsonAnswer, setJsonAnswer] = useState<string>(JSON.stringify({ID: uuid()}))
    let [optionSelected, setOptionSelected] = useState<number|null>(null)
    let [isLoading, setIsLoading] = useState<boolean>(false)
    let [textoModal, setTextoModal] = useState<string>("Enviando respuestas...")
    let [isFinished, setIsFinished] = useState<boolean>(false)

    let token = useSelector((state: any) => state.token)

    console.log(jsonAnswer)

    useEffect(() => {
        if (index === length && Object.keys(JSON.parse(jsonAnswer)).length - 1 === length + 1) {
            setIsLoading(true)
            axios.post(`http://192.168.1.200:3000/enviarRespuesta`, {ID, token, newJsonAnswer: jsonAnswer}, {timeout: 2000})
            .then(async isTrue => {
                if (isTrue.data === true) {
                    await AsyncStorage.removeItem("respuestaNoTerminada")
                    navigation.navigate("Main")
                }
            })
            .catch(async (error) => {
                setTextoModal("Envio falló, guardando...")
                let respuestasTerminadas = await AsyncStorage.getItem("respuestasTerminadas")
                let parseRespuestasTerminadas = respuestasTerminadas ? JSON.parse(respuestasTerminadas) : null
                if (respuestasTerminadas === null) {
                    respuestasTerminadas = JSON.stringify({[ID]: [JSON.parse(jsonAnswer)]})
                    await AsyncStorage.setItem("respuestasTerminadas", respuestasTerminadas)
                    await AsyncStorage.removeItem("respuestaNoTerminada")
                    setIsLoading(false)
                    navigation.navigate("Main")
                } else {
                    if (parseRespuestasTerminadas[ID] !== undefined) {
                        parseRespuestasTerminadas[ID].push(JSON.parse(jsonAnswer))
                        parseRespuestasTerminadas = JSON.stringify(parseRespuestasTerminadas)
                        await AsyncStorage.setItem("respuestasTerminadas", parseRespuestasTerminadas)
                        await AsyncStorage.removeItem("respuestaNoTerminada")
                        setIsLoading(false)
                        navigation.navigate("Main")
                    } else {
                        parseRespuestasTerminadas[ID] = [JSON.parse(jsonAnswer)]
                        parseRespuestasTerminadas = JSON.stringify(parseRespuestasTerminadas)
                        await AsyncStorage.setItem("respuestasTerminadas", parseRespuestasTerminadas)
                        await AsyncStorage.removeItem("respuestaNoTerminada")
                        setIsLoading(false)
                        navigation.navigate("Main")
                    }
                }
            })
        }
        if (isFinished && Object.keys(JSON.parse(jsonAnswer)).length - 1 !== length + 1) {
            Alert.alert("¡Hay preguntas sin responder!")
            setIsFinished(false)
        }
    }, [isFinished])

    useEffect(() => {
        setPreguntas(JSON.parse(Preguntas))
        setLenght(JSON.parse(Preguntas).length - 1)
        AsyncStorage.getItem("respuestaNoTerminada").then(respuestaNoTerminada => {
            if (respuestaNoTerminada) {
                if (JSON.parse(respuestaNoTerminada)[ID] !== undefined) {
                    setJsonAnswer(JSON.stringify(JSON.parse(respuestaNoTerminada)[ID]))
                    setOptionSelected(JSON.parse(respuestaNoTerminada)[ID][JSON.parse(Preguntas)[0].ID])
                }
            }
        })
    }, [])
    
    return(
        <ScrollView
            style={{backgroundColor: "rgb(245,245,245)"}} 
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'space-between'
            }}>
            <View pointerEvents={isLoading ? "none" : "auto"}>
                <View style={{height: 50, backgroundColor: `rgba(${Color},0.6)`, justifyContent: "center"}}>
                    <Text style={{fontSize: 18, fontFamily: "Roboto-Bold", paddingHorizontal: 20, color: 'white'}} ellipsizeMode="tail" numberOfLines={3}>{preguntas.length === 0 ? null : preguntas[index].Titulo}</Text>
                </View>
                {preguntas.length === 0 ? null : preguntas[index].Opciones.map((opcion: any, i: number) => <TouchableOpacity key={i} onPress={() => setOptionSelected(i)} style={{height: 35, flexDirection: "row", alignItems: "center", marginHorizontal: 25}}><View style={{height: 20, width: 20, borderWidth: 1, backgroundColor: "rgb(255,255,255)", borderRadius: 40, alignItems: "center", justifyContent: "center"}}>{i === optionSelected && <View style={{height: 12, width: 12, backgroundColor: "black", borderRadius: 40}}></View>}</View><Text style={{fontFamily: "Roboto-Light", fontSize: 16, paddingLeft: 15}}>{opcion}</Text></TouchableOpacity>)}
            </View>
            <View style={{flexDirection: "row", marginVertical: 40}}>
                <TouchableOpacity onPress={async () => {
                    navigation.setParams({index: navigation.getParam("index") - 1})
                    if (optionSelected === null) {}
                    else {
                        let newJsonAnswer = JSON.parse(jsonAnswer)
                        newJsonAnswer[preguntas[index].ID] = optionSelected
                        setJsonAnswer(JSON.stringify(newJsonAnswer))
                        let store = await AsyncStorage.getItem("respuestaNoTerminada")
                        let parseStore = store ? JSON.parse(store) : null
                        if (store) {
                            parseStore[ID] = newJsonAnswer
                            await AsyncStorage.setItem("respuestaNoTerminada", JSON.stringify(parseStore))
                        } else {
                            await AsyncStorage.setItem("respuestaNoTerminada", JSON.stringify({
                                [ID]: newJsonAnswer
                            }))
                        }
                    }
                    setOptionSelected(JSON.parse(jsonAnswer)[preguntas[index !== 0 ? index - 1 : index].ID] !== undefined ? JSON.parse(jsonAnswer)[preguntas[index !== 0 ? index - 1 : index].ID] : null)
                    setIndex(index !== 0 ? index - 1 : index)
                }} style={{borderRadius: 200, width: "46%", marginHorizontal: "2%", backgroundColor: index === 0 ? "rgba(0,135,255,0.25)" : "rgba(0,135,255,0.6)", alignItems: "center", justifyContent: "center", flexDirection: "row", height: 40}}><Icon name="chevron-left" color="white" size={20} style={{paddingRight: 10}}/><Text style={{color: "white", fontFamily: "Roboto-Medium", fontSize: 20}}>Anterior</Text></TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                    navigation.setParams({index: navigation.getParam("index") + 1})
                    if (optionSelected === null) {}
                    else {
                        let newJsonAnswer = JSON.parse(jsonAnswer)
                        newJsonAnswer[preguntas[index].ID] = optionSelected
                        setJsonAnswer(JSON.stringify(newJsonAnswer))
                        let store = await AsyncStorage.getItem("respuestaNoTerminada")
                        let parseStore = store ? JSON.parse(store) : null
                        if (store) {
                            parseStore[ID] = newJsonAnswer
                            await AsyncStorage.setItem("respuestaNoTerminada", JSON.stringify(parseStore))
                        } else {
                            await AsyncStorage.setItem("respuestaNoTerminada", JSON.stringify({
                                [ID]: newJsonAnswer
                            }))
                        }
                    }
                    if (index !== length) {
                        setOptionSelected(JSON.parse(jsonAnswer)[preguntas[index !== length ? index + 1 : index].ID] !== undefined ? JSON.parse(jsonAnswer)[preguntas[index !== length ? index + 1 : index].ID] : null)
                    }
                    
                    setIndex(index !== length ? index + 1 : index)
                    if (index === length) {
                        setIsFinished(true)
                    }
                }} style={{borderRadius: 200, width: "46%", marginHorizontal: "2%", backgroundColor: "rgba(0,135,255,0.6)", alignItems: "center", justifyContent: "center", flexDirection: "row", height: 40}}><Text style={{color: "white", fontFamily: "Roboto-Medium", fontSize: 20}}>{index === length ? "Finalizar" : "Siguiente"}</Text><Icon name="chevron-right" color="white" size={20} style={{paddingLeft: 10}}/></TouchableOpacity>
            </View>
            {isLoading && <View style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center"}}>
                <View style={{borderRadius: 22, backgroundColor: "rgb(160,160,160)", borderColor: `rgba(${Color},0.4)`, borderWidth: 3, width: "80%", justifyContent: "center", alignItems: "center", elevation: 3}}>
                    <Text style={{textAlign: "center", fontSize: 20, fontFamily: "Roboto-Light", color: "white", marginTop: 15}}>
                        ¡Captura finalizada!
                    </Text>
                    <Text style={{textAlign: "center", fontSize: 20, fontFamily: "Roboto-Light", color: "white"}}>
                        {textoModal}
                    </Text>
                    <View style={{alignItems: "center", justifyContent: "center", height: 100}}>
                        <ActivityIndicator size="large"/>
                    </View>
                </View>
            </View>}
        </ScrollView>
    )
}

Responde.navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
        title: `Responde (${navigation.getParam("index")}/${JSON.parse(navigation.getParam("Preguntas")).length})`
    }
}

export default Responde