import React,{useState,useEffect} from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {View,Text,StyleSheet,Image,TextInput,TouchableOpacity} from 'react-native'
import logo from '../assets/logo.png'
import api from '../service/api'



export default function Login({navigation}){
    const [user,setUser] = useState('')
    useEffect(()=>{
        AsyncStorage.getItem('user').then(user=>{
            if(user){
                navigation.navigate('Main',{user})
            }
        })
    },[])
    
    async function handleLogin(){
        const response = await api.post('/devs',{username : user})

        const { _id } = response.data
        await AsyncStorage.setItem('user', _id)
        navigation.navigate('Main',{user: _id})
    }
    
    return (
        <View style={estilo.container}>
           <Image source={logo}/>
           <TextInput 
           autoCapitalize="none"
           autoCorrect={false}
           placeholder="Digite seu usuario no GitHub "
           placeholderTextColor="#999"
           style={estilo.input}
           value={user}
           onChangeText={setUser}
           />
           <TouchableOpacity onPress={handleLogin} style={estilo.button}>
               <Text style={estilo.buttonText}>Enviar</Text>
           </TouchableOpacity>
        </View>
    )
}

const estilo = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f5f5f5',
        justifyContent:'center',
        alignItems:"center",
        padding:30
    },
    input:{
       height:46,
       alignSelf:"stretch",
       backgroundColor:'#FFF',
       borderWidth:1,
       borderColor:'#ddd',
       borderRadius:4,
       marginTop:20,
       paddingHorizontal:15

    },
    button:{
        height:46,
        alignSelf:'stretch',
        backgroundColor:'#DF4723',
        borderRadius:4,
        marginTop:10,
        justifyContent:"center",
        alignItems:"center"
    },
    buttonText:{
        color:'#FFF',
        fontWeight:"bold",
        fontSize:16,
        
    }
})