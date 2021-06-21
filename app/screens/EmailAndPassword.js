import React, { Component } from 'react';
import firebase from 'firebase'
import { View, Text, StyleSheet,TextInput,TouchableOpacity } from 'react-native';
import Logo from './Logo';
import SignUp from './Signup';

// create a component
class EmailAndPassword extends Component {
    state={
        email:'',
        password:'',
        error:'',
        loading:false
    }
    onBottomPress =() => {
        firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
        .then(this.onLoginSucess)
        .catch(err => {
            this.setState({
                error:err.message
            })
        })
    }
    onLoginSucess = () =>{
        this.setState({
            error:'',
            loading:false
        })
    }
    onSignup = () => {
        return SignUp
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Logo/>
                </View>
                 <TextInput
                    placeholder="Email" 
                    style={styles.input} 
                    value={this.state.email}
                    onChangeText={email=> this.setState({email})}
                     />
                 <TextInput 
                    placeholder="Password" 
                    style={styles.input}
                    secureTextEntry
                     value={this.state.password}
                     onChangeText={password => this.setState({password})}
                     />
                 <TouchableOpacity style={styles.buttonContainer} onPress={this.onBottomPress} >
                     <Text style={styles.buttonText}>Login</Text>
                 </TouchableOpacity>
                 <TouchableOpacity style={styles.buttonContainer} onPress={this.onSignup} >
                     <Text style={styles.buttonText}>SignUp</Text>
                 </TouchableOpacity>
                    <Text style={styles.errorText} >
                         {this.state.error}
                    </Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        marginBottom:'5%',
        marginLeft:'30%',
        marginRight:'30%',
        alignItems:'center',
        flex: 1,
        backgroundColor:'rgba(13,23,26,.8)', 
    },
    input:{
        height:40,
        backgroundColor:'rgba(255,255,255,.5)',
        alignItems:'center',
        paddingLeft:20,
        marginBottom:30,
        borderRadius:5,
        fontSize:15,
    },
    errorText:{
        fontSize:25,
        color:'red',
        alignSelf:'center',
        marginTop:10

    },
    buttonText:{
        alignContent:'center',
        textAlign:'center',
        color:'#fff',
        fontWeight:'bold',
        fontSize:20
    },
    buttonContainer:{
        backgroundColor:'#3B3B98',
        alignItems:'center',
        marginBottom:'5%',
        padding:15,
        borderRadius:8
    },
    logoContainer:{
        flex:1,
        alignItems: 'center',
        justifyContent:'center',
        marginBottom:20,
    },
});

export default EmailAndPassword;
