import React,{useEffect,useState} from 'react'
import {SafeAreaView,Text,View,Image,StyleSheet,TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../service/api'
import logo from '../assets/logo.png'
import like from '../assets/like.png'
import dislike from '../assets/dislike.png'
import itsamatch from '../assets/itsamatch.png'

export default function Main({navigation}){
    const id = navigation.getParam('user')
    
    const [usuario,setUsuario]=useState([])
    const [matchDev,setMatchDev]=useEffect(true)
    useEffect(()=>{
      async function carregarUsuario(){
        const response = await api.get('/devs',{
            headers:{
                user:id
            }})
            setUsuario(response.data)
      }
      carregarUsuario()
  },[id])
  useEffect(()=>{
    const socket = io('http://10.0.2.2:3333',{
        query: {user :id}
    })
    socket.on('math',dev=>{
        setMatchDev(dev)
    })
    
  },[id])  
    
    async function handleLike(){
        const [user,...rest] = usuario 
        await api.post(`/devs/${user._id}/likes`,null,{
            headers:{user:id}
        })
        setUsuario(rest)
    }
    async function handleDislike(){
        const [user,...rest] = usuario 
        await api.post(`/devs/${user._id}/dislikes`,null,{
            headers:{user:id}
        })
        setUsuario(rest)
    }
    async function handleLogout(){
        await AsyncStorage.clear()
        navigation.navigate('Login')
    }


    return(
       <SafeAreaView>
           <TouchableOpacity onPress={handleLogout}>
               <Image style={estilo.logo} source={logo}/>
           </TouchableOpacity>
            <View style={estilo.cardsContainer}>
                {usuario.length==0 ? 
                <Text style={estilo.empty}> Acabou:( </Text>
                : (
                    usuario.map((user,index)=>(
                        <View key={user._id} style={[estilo.card,{zIndex:usuario.length-index}]} >
                            <Image style={estilo.avatar} source={{uri:user.avatar}}></Image>
                            <View style={estilo.footer}>
                                <Text style={estilo.nome}>{user.name}</Text>
                                <Text style={estilo.bio}>{user.bio}</Text>
                            </View>

                        </View>
                    ))
                )} 
                    
                

            </View>

            <View>
                    
          {usuario.length > 0 && (
              <View style={estilo.buttonsContainer}>
              <TouchableOpacity style={estilo.button} onPress={handleDislike}>
                  <Image source={dislike}/>
              </TouchableOpacity>
              <TouchableOpacity style={estilo.button} onPress={handleLike}>
                  <Image source={like}/>
              </TouchableOpacity>
            </View>
          ) }
        </View>
        {matchDev && (
            <View style={estilo.matchContainer}>
                <Image source={itsamatch}/>
                <Image style={estilo.matchAvatar} source={{uri:"https://avatars1.githubusercontent.com/u/7679729?v=4"}}/>
                <Text style={estilo.matchName}>Diego fernandes</Text>
                <Text style={estilo.matchBio}>Irmão do filipe deschamps</Text>
                <TouchableOpacity onPress={()=>setMatchDev(null)}>
                    <Text style={estilo.closeMatch}>Fechar</Text>

                </TouchableOpacity>
            </View>
        )}
        </SafeAreaView>
    )

}
const estilo = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f5f5f5',
        alignItems:"center",
        justifyContent:"space-between"

    },
    cardsContainer:{
        flex:1,
        alignSelf:"stretch",
        justifyContent:"center",
        maxHeight:500,

    },
    empty:{
        alignSelf:'center',
        margin: 50 ,
        color:'#999',
        fontSize:24,
        fontWeight:"bold",

    },
    logo:{
        margin:30
    },
    card:{
        borderWidth:1,
        borderColor:'#DDD',
        borderRadius:8,
        margin: 30,
        overflow:'hidden',
        position:"absolute",
        top:0,
        left:0,
        bottom:0,
    },
    avatar:{
        flex:1,
        height:300
    },
    footer:{
        backgroundColor:'#FFF',
        paddingHorizontal:20,
        paddingVertical:15,

    },
    nome:{
        fontSize:16,
        fontWeight:'bold',
        color:'#333'
    },
    bio:{
        fontSize:14,
        color:'#999',
        marginTop:5,
        lineHeight:18,
    },
    buttonsContainer:{
        flexDirection:'row',
        marginBottom:30,

    },
    button:{
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor:'#FFF',
        justifyContent:"center",
        alignItems:"center",
        marginHorizontal:20,
        elevation:2,
        shadowColor:'#000',
        shadowOpacity:0.05,
        shadowRadius:2,
        shadowOffset:{
            width:0,
            height:2,
        }

    }

})