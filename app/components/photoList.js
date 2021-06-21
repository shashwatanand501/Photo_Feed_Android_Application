import React from 'react';
import {TouchableOpacity,FlatList,StyleSheet,Text,View,Image} from 'react-native';
import {f,auth,database,storage} from '../../config/config';
import UserAuth from './auth';

class PhotoList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            photo_feed:[],
            refresh: false ,
            loadding:true,
            empty: false
        }
    }

    componentWillMount =()=>{
        const { isUser,userId}=this.props;
        if(isUser == true){
            //profile
            //userid
            this.loadFeed(userId);
        }else{
            this.loadFeed('');
        }
    }
    pluralCheck = (s) => {
        if(s==1){
            return ' ago';
        }else{
            return 's ago';
        }
    } 
    timeConverter = (timestamp)=> {
        var a = new Date(timestamp *1000);
        var seconds  =Math.floor((new Date()-a)/1000);

        var interval = Math.floor(seconds / 3153600);
        if(interval>1){
            return interval+ 'year'+this.pluralCheck(interval);
        }
        interval=Math.floor(seconds/ 2592000);
        if(interval>1){
            return interval+ 'Month'+this.pluralCheck(interval);
        }
        interval=Math.floor(seconds/ 86400);
        if(interval>1){
            return interval+ 'Day'+this.pluralCheck(interval);
        }
        interval=Math.floor(seconds/ 3600);
        if(interval>1){
            return interval+ 'Hour'+this.pluralCheck(interval);
        }
        interval=Math.floor(seconds/ 60);
        if(interval>1){
            return interval+ 'minute'+this.pluralCheck(interval);
        }
        return Math.floor(seconds)+ 'second'+this.pluralCheck(seconds);
    }

    addToFlatList = (photo_feed,data,photo) => {
        var that =this;
        var photoObj = data[photo];
                    database.ref('users').child(photoObj.author).child('username').once('value').then(function(snapshot){
                        const exists = (snapshot.val() !==null);
                    if(exists) data =snapshot.val();
                        photo_feed.push({
                            id:photo,
                            url:photoObj.url,
                            caption:photoObj.caption,
                            posted:that.timeConverter(photoObj.posted),
                            timestamp:photoObj.posted,
                            author: data,
                            authorId:photoObj.author
                        });

                        var myData = [].concat(photo_feed).sort((a,b) =>a.timestamp<b.timestamp);

                        that.setState({
                            refresh:false,
                            loading:false,
                            photo_feed:myData
                        });

                    }).catch(error => console.log(error));
    }

    loadFeed =(userId = '')=> {
        this.setState({
            refresh:true,
            photo_feed:[]
        });

        var that = this;
        var loadRef =database.ref('photos');
        if(userId != ''){
            loadRef = database.ref('users').child(userId).child('photos');
        }

        database.ref('photos').orderByChild('posted').once('value').then(function(snapshot){
            const exists = (snapshot.val() !==null);
            if(exists) {data =snapshot.val();
                var photo_feed = that.state.photo_feed;

                for(var photo in data){
                    that.addToFlatList(photo_feed,data,photo)
                }
            }else{
                that.setState({empty:true});
            }  
        }).catch(error => console.log(error));
    }

    loadNew = () => {
        this.setState({
            photo_feed:[5,6,7,8,9],
            refresh: false
        });
    }
    render(){
        return(
            <View style={{flex:1}}>
                { this.state.loading == true ? (
                    <View style={{flex:1,justifyContent: 'center',alignItems: 'center'}}>
                        { this.state.empty == true ? (
                            <Text>No photo found</Text>
                        ):(
                            <Text>Loading...</Text>
                        )}
                    </View>
                ) : (
                <FlatList 
                    refreshing={this.state.refresh}
                    onRefresh={this.loadNew}
                    data={this.state.photo_feed}
                    keyExtractor={(item,index) => index.toString()}
                    style = {{flex:1,backgroundColor:'#eee'}}
                    renderItem={({item,index})=>(
                        <View key ={index} style ={{width:'100%',overflow:'hidden',marginBottom:5,justifyContent:'space-between',borderBottomWidth:1,borderColor:'black'}}>
                    <View style={{padding:5, width:'100%',flexDirection:'row',justifyContent:'space-between'}}>
                        <Text>{item.posted}</Text>
                        <TouchableOpacity 
                         onPress={ () => this.props.navigation.navigate('User',{userId: item.authorId})}>
                           <Text>{item.author}</Text> 
                        </TouchableOpacity>         
                    </View>
                    <View>
                        <Image source={{uri:item.url}}
                        style={{resizeMode:'cover' ,width: '100%',height:275}}/>
                    </View>
                    <View style ={{padding:5}}>
                        <Text>{item.caption}</Text>
                        <TouchableOpacity 
                         onPress={ () => this.props.navigation.navigate('Comments',{photoId: item.id})}>
                            <Text style={{color:'blue',marginTop:10,textAlign:'center'}}>View comment...</Text>
                        </TouchableOpacity>
                    </View>
                </View>
             )}
         />
         )}
            </View>
        )
    }
}

export default PhotoList;