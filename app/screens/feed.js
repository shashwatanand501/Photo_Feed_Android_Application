import React from 'react';
import {Text,View} from 'react-native';
import PhotoList from '../components/photoList';

class feed extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            photo_feed: [],    
            refresh: false,
            loading: true
        }
    }

    componentDidMount = () =>{
    }
    render(){
        return(
            <View style={{flex:1}}>
                <View style={{height:70,paddingTop:30,backgroundColor:'white',borderColor:0.5,justifyContent:'center',alignItems:'center'}}>
                    <Text>feed</Text>
                </View>
                <PhotoList isuser = {false} userId={this.state.userId} navigation={this.props.navigation}/>   
            </View>
        )
    }
}

export default feed;