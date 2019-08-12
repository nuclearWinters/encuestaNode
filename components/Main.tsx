import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, TouchableNativeFeedback, TextInput, Image, Text, ScrollView, AsyncStorage, Alert } from "react-native"
import { NavigationScreenComponent, NavigationScreenProps } from "react-navigation"
import Icon from "react-native-vector-icons/FontAwesome5"
import axios from "axios"
import { useSelector } from "react-redux"
import moment from "moment"

interface Encuesta {
    Titulo: string,
    ID: string
    Imagen: string|null,
    Color: string,
    Modificada: Date,
    Total: number,
    Preguntas: string
}

const Main: NavigationScreenComponent<{}> = ({ navigation }: NavigationScreenProps ) => {

    let [encuestas, setEncuestas] = useState<Encuesta[]>([])
    let [respuestasTerminadas, setRespuestasTerminadas] = useState<any>({})
    let [respuestasNoTerminadas, setRespuestasNoTerminadas] = useState<any>({})

    console.log(encuestas)
    console.log(respuestasTerminadas)
    //console.log(respuestasNoTerminadas)

    let token = useSelector((state: any) => state.token)

    useEffect(() => {
        axios.get(`http://192.168.1.200:3000/encuestas?token=${token}`).then(encuestas => {
            setEncuestas(encuestas.data)
            AsyncStorage.setItem("encuestasGuardadas", JSON.stringify(encuestas.data))
        })
        .catch(err => {
            AsyncStorage.getItem("encuestasGuardadas").then(encuestasGuardadas => {
                encuestasGuardadas 
                ?
                setEncuestas(JSON.parse(encuestasGuardadas))
                :
                Alert.alert("¡Conectate a internet para empezar!")
            })
        })
        let subscribe = navigation.addListener('didFocus', () => {
            AsyncStorage.getItem("respuestasTerminadas").then(respuestasTerminadas => {
                respuestasTerminadas ? setRespuestasTerminadas(JSON.parse(respuestasTerminadas)) : setRespuestasTerminadas({})
            })
            AsyncStorage.getItem("respuestaNoTerminada").then(respuestaNoTerminada => {
                respuestaNoTerminada ? setRespuestasNoTerminadas(JSON.parse(respuestaNoTerminada)) : setRespuestasNoTerminadas({})
            })
        });
        AsyncStorage.getItem("respuestasTerminadas").then(respuestasTerminadas => {
            respuestasTerminadas ? setRespuestasTerminadas(JSON.parse(respuestasTerminadas)) : setRespuestasTerminadas({})
        })
        AsyncStorage.getItem("respuestaNoTerminada").then(respuestaNoTerminada => {
            respuestaNoTerminada ? setRespuestasNoTerminadas(JSON.parse(respuestaNoTerminada)) : setRespuestasNoTerminadas({})
        })
        //AsyncStorage.removeItem("respuestaNoTerminada")
        return () => {
            subscribe.remove()
        };
    }, [])
    
    return(
        <ScrollView style={{backgroundColor: "rgb(250,250,250)"}}>
            {encuestas.filter((en: Encuesta) => en.Titulo.toLocaleLowerCase().includes(navigation.getParam("text", "").toLocaleLowerCase())).map((encuesta: Encuesta) => 
                <View key={encuesta.ID} style={{flexDirection: "row", borderBottomColor: "grey", borderBottomWidth: 2}}>
                    <View style={{flex: 1}}>
                        <View style={{backgroundColor: `rgba(${encuesta.Color},0.25)`, height: 20}}>
                        </View>
                        <View style={{backgroundColor: "rgb(250,250,250)", height: 80, flexDirection: "row"}}>
                            <View style={{height: 80, width: 80, alignItems: "center", justifyContent: "center"}}>
                                {encuesta.Imagen && <Image style={{height: 60, width: 60}} resizeMode="contain" source={{uri: encuesta.Imagen}} />}
                                <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "center", justifyContent: "flex-end"}}><View style={{backgroundColor: "rgb(255,255,255)", elevation: 5, borderRadius: 60, justifyContent: "center", marginBottom: 5}}><Text style={{color: "rgb(100,100,100)", fontSize: 16, fontFamily: "Roboto-Bold", textAlign: "center"}}> {encuesta.Total} </Text></View></View>
                            </View>
                            <View style={{justifyContent: "center", flex: 1}}>
                                <Text numberOfLines={2} ellipsizeMode="tail" style={{fontSize: 14, color: "rgba(0,0,0,1)", fontWeight:"300", marginVertical: 5}}>{encuesta.Titulo}</Text>
                                <Text style={{fontSize: 12, color: "rgba(0,0,0,0.4)", fontWeight:"300", paddingBottom: 5}}>{
                                    moment().diff(moment(new Date(encuesta.Modificada)), "minutes", true) < 60
                                    ?
                                    `Modificado hace ${moment().diff(moment(new Date(encuesta.Modificada)), "minutes")} ${moment().diff(moment(new Date(encuesta.Modificada)), "minutes") === 1 ? "minuto" : "minutos"}`
                                    :
                                    moment().diff(moment(new Date(encuesta.Modificada)), "hours", true) < 24
                                    ?
                                    `Modificado hace ${moment().diff(moment(new Date(encuesta.Modificada)), "hours")} ${moment().diff(moment(new Date(encuesta.Modificada)), "hours") === 1 ? "hora" : "horas"}`
                                    :
                                    moment().diff(moment(new Date(encuesta.Modificada)), "days", true) < 7
                                    ?
                                    `Modificado hace ${moment().diff(moment(new Date(encuesta.Modificada)), "days")} ${moment().diff(moment(new Date(encuesta.Modificada)), "days") === 1 ? "día" : "días"}`
                                    :
                                    moment().diff(moment(new Date(encuesta.Modificada)), "weeks", true) < 4
                                    ?
                                    `Modificado hace ${moment().diff(moment(new Date(encuesta.Modificada)), "weeks")} ${moment().diff(moment(new Date(encuesta.Modificada)), "weeks") === 1 ? "semana" : "semanas"}`
                                    :
                                    moment().diff(moment(new Date(encuesta.Modificada)), "months", true) < 12
                                    ?
                                    `Modificado hace ${moment().diff(moment(new Date(encuesta.Modificada)), "months", true)} ${moment().diff(moment(new Date(encuesta.Modificada)), "months") === 1 ? "mes" : "meses"}`
                                    :
                                    `Modificado hace ${moment().diff(moment(new Date(encuesta.Modificada)), "years", true)} ${moment().diff(moment(new Date(encuesta.Modificada)), "years") === 1 ? "año" : "años"}`
                                }</Text>
                            </View>
                            <View style={{width: 80}}>
                            </View>
                        </View>
                    </View>
                    <View style={{width: 80, position: "absolute", height: 100, right: 0}}>
                        <View style={{flex: 1}}>
                            <TouchableOpacity onPress={() => navigation.navigate("Responde", {index: 1, ID: encuesta.ID, TituloEncuesta: encuesta.Titulo, Color: encuesta.Color, Preguntas: encuesta.Preguntas})} style={{flex: 1, marginHorizontal: 2, marginVertical: 2, alignItems: "center", justifyContent: "center", elevation: 3, borderRadius: 2, backgroundColor: "white"}}>
                                <Icon name="play" color={`rgba(${encuesta.Color},0.8)`} size={30}/>
                                {
                                    respuestasNoTerminadas[encuesta.ID] 
                                    ?
                                    respuestasNoTerminadas[encuesta.ID].length !== 0
                                    ?
                                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "flex-end", justifyContent: "flex-end"}}>
                                        <View style={{borderRadius: 40, width: 30, height: 30, backgroundColor: "orange", borderWidth: 2, borderColor: "white", justifyContent: "center", marginHorizontal: 5, marginVertical: 5}}><Text style={{color: "white", fontSize: 16, fontFamily: "Roboto-Bold", textAlign: "center"}}>1</Text></View>
                                    </View>
                                    :
                                    null
                                    :
                                    null
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity onPress={() => navigation.navigate("Preview", {ID: encuesta.ID, TituloEncuesta: encuesta.Titulo, Color: encuesta.Color, Imagen: encuesta.Imagen, Preguntas: encuesta.Preguntas, ListaTerminadas: respuestasTerminadas[encuesta.ID], Respuestas: respuestasTerminadas[encuesta.ID] ? respuestasTerminadas[encuesta.ID].length !== 0 ? respuestasTerminadas[encuesta.ID].length : 0 : 0, Incompletas: respuestasNoTerminadas[encuesta.ID] ? respuestasNoTerminadas[encuesta.ID].length !== 0 ? respuestasNoTerminadas[encuesta.ID].length : null : null})} style={{flex: 1, marginHorizontal: 2, marginVertical: 2, alignItems: "center", justifyContent: "center", elevation: 3, borderRadius: 2, backgroundColor: "white"}}>
                                <Icon name="file-signature" color={`rgba(${encuesta.Color},0.8)`} size={30}/>
                                {
                                    respuestasTerminadas[encuesta.ID] 
                                    ?
                                    respuestasTerminadas[encuesta.ID].length !== 0
                                    ?
                                    <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "flex-end", justifyContent: "flex-end"}}>
                                        <View style={{borderRadius: 40, width: 30, height: 30, backgroundColor: "forestgreen", borderWidth: 2, borderColor: "white", justifyContent: "center", marginHorizontal: 5, marginVertical: 5}}><Text style={{color: "white", fontSize: 16, fontFamily: "Roboto-Bold", textAlign: "center"}}>{respuestasTerminadas[encuesta.ID].length}</Text></View>
                                    </View>
                                    :
                                    null
                                    :
                                    null
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    )
}

Main.navigationOptions = ({ navigation }: NavigationScreenProps) => {
    let search = navigation.getParam("search")
    if (search) {
        return {
            headerLeft: (
                <View style={{height: "100%", alignItems: "center", justifyContent: "center", width: "100%"}}>
                  <TouchableOpacity onPress={() => navigation.setParams({search: false, text: ""})}>
                    <View style={{alignItems: "center", justifyContent: "center", height: 30, width: 30, marginHorizontal: 10}}>
                      <Icon name="times" size={20} color="white"/>
                    </View>
                  </TouchableOpacity>
                </View>
              ),
              headerStyle: {
                backgroundColor: "rgb(0,160,200)"
              },
              headerTintColor: "rgb(35,153,247)",
              headerTitle: <TextInput
                onChangeText={text => navigation.setParams({text})}
                ref={input => {
                    if (input) {
                        input.focus()
                    }
                }}
                selectionColor="black"
                placeholderTextColor="rgba(0,0,0,0.5)"
                style={{fontSize: 20, color: "black", backgroundColor: "rgba(255,255,255,1)", borderRadius: 40, paddingHorizontal: 10, width: "80%"}}
                value={navigation.getParam("text")}
                placeholder="Buscar..."
              />
        }
    } else {
        return {
            title: "medirPobreza*",
            headerRight: (
                <View style={{flexDirection: "row", height: "100%", alignItems: "center", justifyContent: "center"}}>
                    <TouchableNativeFeedback onPress={() => navigation.setParams({search: true})} useForeground={true} background={TouchableNativeFeedback.Ripple("rgba(255,255,255,0.4)", true)}>
                        <View style={{alignItems: "center", justifyContent: "center", height: 30, width: 30, marginHorizontal: 10}}>
                            <Icon name="search" size={22} color={navigation.getParam("headerTintColor", "white")}/>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            ),
            headerTintColor: "white",
            headerStyle: {backgroundColor: "rgb(0,160,200)"}
        }
    }
}


export default Main