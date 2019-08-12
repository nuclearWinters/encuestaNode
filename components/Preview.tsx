import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, Image, Text, ScrollView, AsyncStorage, ActivityIndicator, Alert } from "react-native"
import { NavigationScreenComponent, NavigationScreenProps } from "react-navigation"
import Icon from "react-native-vector-icons/FontAwesome5"
import axios from "axios"
import { useSelector } from "react-redux"

interface Pregunta {
    Titulo: string,
    ID: string
    Opciones: string[]
}

const Preview: NavigationScreenComponent<{}> = ({ navigation }: NavigationScreenProps ) => {

    let ID: string = navigation.getParam("ID")
    let TituloEncuesta: string = navigation.getParam("TituloEncuesta")
    let Imagen: string = navigation.getParam("Imagen")
    let Color: string = navigation.getParam("Color")
    let Preguntas: string = navigation.getParam("Preguntas")
    let Incompletas: string = navigation.getParam("Incompletas")
    let ListaTerminadas: any[] = navigation.getParam("ListaTerminadas")

    let [isLoading, setIsLoading] = useState<boolean>(false)
    let [preguntas, setPreguntas] = useState<Pregunta[]>([])
    let [Respuestas, setRespuestasLenght] = useState<number>(navigation.getParam("Respuestas"))

    let token = useSelector((state: any) => state.token)

    const intentarEnviar = (ListaTerminadas: any[], Respuestas: number) => {
        axios.post(`http://192.168.1.200:3000/enviarRespuesta`, {ID, token, newJsonAnswer: JSON.stringify(ListaTerminadas.shift())}, {timeout: 2000})
        .then(async isTrue => {
            let respuestas = await AsyncStorage.getItem("respuestasTerminadas")
            let parseRespuestas = respuestas ? JSON.parse(respuestas) : null
            if (parseRespuestas) {
                parseRespuestas[ID].shift()
                await AsyncStorage.setItem("respuestasTerminadas", JSON.stringify(parseRespuestas))
            }
            if (ListaTerminadas.length !== 0) {
                setRespuestasLenght(Respuestas--)
                intentarEnviar(ListaTerminadas, Respuestas)
            } else {
                setRespuestasLenght(Respuestas)
                delete parseRespuestas[ID]
                await AsyncStorage.setItem("respuestasTerminadas", JSON.stringify(parseRespuestas))
                setIsLoading(false)
            }
            
        })
        .catch(() => {
            setIsLoading(false)
            Alert.alert("¡Conectate a internet para enviar respuestas!")
        })
    }

    const sendRespuestas = () => {
        if (Respuestas !== 0) {
            setIsLoading(true)
            intentarEnviar(ListaTerminadas, Respuestas - 1)
        }
    }

    useEffect(() => {
        setPreguntas(JSON.parse(Preguntas))
    }, [])
    
    return(
        <View pointerEvents={isLoading ? "none" : "auto"}>
            <ScrollView style={{backgroundColor: "rgb(245,245,245)"}}>
                <View style={{height: 100, flexDirection: "row"}}>
                    <TouchableOpacity onPress={() => sendRespuestas()} style={{flex: 1, justifyContent: "center", alignItems: "center", elevation: 3, marginVertical: 5, marginHorizontal: 5, borderRadius: 5}}>
                        <Icon name="file-export" color={`rgba(${Color},0.8)`} size={64}/>
                        {Respuestas 
                        ?
                        <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "flex-end", justifyContent: "flex-end"}}>
                            <View style={{borderColor: "white", backgroundColor: "forestgreen", borderWidth: 3, width: 30, height: 30, borderRadius: 60, marginTop: 60, marginRight: 10, marginBottom: 10}}>
                                <Text style={{color: "white", fontSize: 16, fontFamily: "Roboto-Bold", textAlign: "center"}}>{Respuestas}</Text>
                            </View>
                        </View>
                        :
                        null
                        }
                    </TouchableOpacity>
                    <Image style={{height: 80, width: 80, marginHorizontal: 10, marginVertical: 10}} resizeMode="contain" source={{uri: Imagen}}/>
                    <TouchableOpacity onPress={() => navigation.navigate("Responde", {index: 1, ID, TituloEncuesta, Color, Preguntas})} style={{flex: 1, justifyContent: "center", alignItems: "center", elevation: 3, marginVertical: 5, marginHorizontal: 5, borderRadius: 5}}>
                        <Icon name="play" color={`rgba(${Color},0.8)`} size={64}/>
                        {Incompletas 
                        && 
                        <View style={{position: "absolute", top: 0, bottom: 0, left: 0, right: 0, alignItems: "flex-end", justifyContent: "flex-end"}}>
                            <View style={{borderColor: "white", backgroundColor: "orange", borderWidth: 3, width: 30, height: 30, borderRadius: 60, marginTop: 60, marginRight: 10, marginBottom: 10}}>
                                <Text style={{color: "white", fontSize: 16, fontFamily: "Roboto-Bold", textAlign: "center"}}>1</Text>
                            </View>
                        </View>}
                    </TouchableOpacity>
                </View> 
                <View style={{height: 70, backgroundColor: `rgba(${Color},0.6)`, justifyContent: "center"}}>
                    <Text style={{fontSize: 18, fontFamily: "Roboto-Bold", paddingHorizontal: 20, color: 'white'}} ellipsizeMode="tail" numberOfLines={3}>{TituloEncuesta}</Text>
                </View>
                {preguntas.map((pregunta: any, index: number) => 
                    <View key={index} style={{borderBottomColor: "rgb(220,220,220)", borderBottomWidth: 2, marginBottom: 5}}>
                        <View style={{height: 50, justifyContent: "center"}}><Text style={{fontSize: 18, fontFamily: "Roboto-Medium", paddingHorizontal: 20}}>{index + 1}. {pregunta.Titulo}</Text></View>
                        {pregunta.Opciones.map((opcion: any, i: number) => <View key={i} style={{height: 35, flexDirection: "row", alignItems: "center", marginHorizontal: 25}}><View style={{height: 20, width: 20, borderWidth: 1, backgroundColor: "rgb(248,248,248)", borderRadius: 40}}></View><Text style={{fontFamily: "Roboto-Light", fontSize: 16, paddingLeft: 15}}>{opcion}</Text></View>)}
                    </View>
                )}
            </ScrollView>
            {isLoading && 
            <View style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center"}}>
                <View style={{borderRadius: 22, backgroundColor: "rgb(160,160,160)", borderColor: `rgba(${Color},0.4)`, borderWidth: 3, width: "80%", justifyContent: "center", alignItems: "center", elevation: 3}}>
                    <Text style={{textAlign: "center", fontSize: 20, fontFamily: "Roboto-Light", color: "white", marginTop: 15}}>
                        ¡Enviando respuestas guardadas!
                    </Text>
                    <View style={{alignItems: "center", justifyContent: "center", height: 100}}>
                        <ActivityIndicator size="large" color="white"/>
                    </View>
                </View>
            </View>}
        </View>
    )
}

Preview.navigationOptions = ({ navigation }: NavigationScreenProps) => {
    return {
        title: `Vista previa`
    }
}

export default Preview