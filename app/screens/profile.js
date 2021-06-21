import React from 'react';
import {TextInput,TouchableOpacity,FlatList,StyleSheet,Text,View,Image} from 'react-native';
import {f,auth,database,storage} from '../../config/config';
import PhotoList from '../components/photoList';

import UserAuth from "../components/auth.js";


class profile extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loggedin: false

        }
    }

    logoutUser = () => {
        f.auth().signOut();
        alert('Logged Out');

    }

    editProfile = () => {
        this.setState({editProfile:true})
    }

    saveProfile = () => {
        var name= this.state.name;
        var username= this.state.username;

        if(name !== ''){
            database.ref('users').child(this.state.userId).child('name').set(name);
        }if(username !== ''){
            database.ref('users').child(this.state.userId).child('username').set(username);
        }
        this.setState({editProfile:false});
    }

    fetchUserInfo = (userId) => {
        var that = this;
        database.ref('user').child(userId).once('value').then(function(snapshot){
            const exist = (snapshot.val() !==null);
            if(exist) data = snapshot.val();
                that.setState({
                    username:true,
                    userId:userId
                });
        });
    }



    componentDidMount = () => {
        var that =this;
        f.auth().onAuthStateChanged(function(user){
            if(user){
                //Logged in
                that.fetchUserInfo(user.uid);
                
            }else{
                //not Logged in
                that.setState({
                    loggedin: false
                })
            }
        })

    }

    render(){
        return(
            <View style={{flex:1}}>
                { this.state.loggedin == true ? (
                    //sre logged in
                    <View style={{flex:1}}>
                         <View style={{height:70,paddingTop:30,backgroundColor:'white',borderColor:0.5,justifyContent:'center',alignItems:'center'}}>
                            <Text>profile</Text>
                        </View>
                        <View style={{justifyContent:'space-between',alignItems:'center',flexDirection:'row',paddingVertical:10}}>
                            <Image source={{url: this.state.avatar}} style={{marginLeft:10,width:100,height:100,borderRadius:50}}/>
                            <View style={{marginRight:10}}>
                                <Text>{this.state.name}</Text>
                                <Text>{this.state.username}</Text>
                            </View>     
                        </View> 
                        {this.state.editProfile == true ? (
                        <View style={{alignItems:'center',justifyContent:'center',paddingBottom:20,borderBottomWidth:1}}>
                            <TouchableOpacity onPress={()=> this.setState({editProfile:false})} >
                                <Text style={{fontWeigh:'blod'}}>Cancel Editing</Text>
                            </TouchableOpacity>
                            <Text>Name</Text>
                            <TextInput 
                            editable={true}
                            placeholder={'Enter your name'}
                            onChangeText={(text)=> this.setState({name:text})}
                            value={this.state.name}
                            style={{width:250,marginVertical:10,padding:5,borderColor:'grey',borderWidth:1}}
                            />
                            <Text>UserName</Text>
                            <TextInput 
                            editable={true}
                            placeholder={'Enter your UserName'}
                            onChangeText={(text)=> this.setState({username:text})}
                            value={this.state.username}
                            style={{width:250,marginVertical:10,padding:5,borderColor:'grey',borderWidth:1}}
                            />
                            <TouchableOpacity 
                            style={{padding:10,backgroundColor:'blue'}}
                            onPress={()=> this.saveProfile()}>
                                <Text style={{fontWeigh:'blod'}}>Cancel Editing</Text>
                            </TouchableOpacity>
                            <Text style={{}} >Edit Save Changes</Text>
                        </View>

                        ) : (
                        <View style={{padding:20,borderBottomWidth:1}}>
                        <TouchableOpacity 
                        onPress={() =>this.logoutUser()}
                        style={{marginTop:10,marginHorizontal:40,paddingVertical:15,borderRadius:20,borderColor:'grey',borderWidth:1.5}}>
                            
                            <Text style={{textAlign:'center',color:'grey'}}>Logout</Text>
                        </TouchableOpacity>


                        <TouchableOpacity 
                        onPress={() =>this.editProfile()}
                        style={{marginTop:10,marginHorizontal:40,paddingVertical:15,borderRadius:20,borderColor:'grey',borderWidth:1.5}}>
                            <Text style={{textAlign:'center',color:'grey'}}>Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                         onPress={()=> this.props.navigation.navigate('Upload')}
                         style={{backgroundColor:'grey',marginTop:10,marginHorizontal:40,paddingVertical:35,borderRadius:20,borderColor:'grey',borderWidth:1.5}}>
                            <Text style={{textAlign:'center',color:'white'}}>Upload New </Text>
                        </TouchableOpacity>
                        </View> 
                    )}
                        <PhotoList isuser = {true} userId={this.state.userId} navigation={this.props.navigation}/>
                    </View> 

                ) : (
                    //not logged in
                    <UserAuth message={'Please login to view your profile'} />
                )}

             
            </View>

        )
        
    }
}

export default profile;
