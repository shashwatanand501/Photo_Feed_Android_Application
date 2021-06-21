import React from 'react';
import {TouchableOpacity,TextInput,KeyboardAvoidingView,FlatList,StyleSheet,Text,View,Image} from 'react-native';
import {f,auth,database,storage} from '../../config/config';
import UserAuth from '../components/auth';


class comment extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loggedin: false,
            comments_list:[]
        }
        
    }

    checkParams = () => {
        //
        var params = this.props.navigation.state.params;
        if(params){
            if(params.userId){
                this.setState({
                    userId:params.photoId
                });
                this.fetchComments(params.userId);
            }
        }
    }

    addCommentToList = (comments_list,data,comment) => {
        var that = this;
        var commentObj=data[comment];
        database.ref('users').child(commentObj.author).child('username').once('value').then(function(snapshot){
            
            const exists = (snapshot.val !=null);
            if(exists) data =snapshot.val();

                comments_list.push({
                    id:comment,
                    comment:commentObj.comment,
                    posted:that .timeConverter(commentObj.posted),
                    author:data,
                    authorId:comment.author
                });
                that.setState({
                    refresh:false,
                    loading:false
                });

        }).catch(error => console.log(error));
    }

    fetchComments = (photoId) => {
        var that= this;
        database.ref('comments').child(photoId).orderByChild('posted').once('value').then(function(snapshot){
            const exists = (snapshot.val()!== null);
            if(exists){
                data =snapshot.val();
                var comments_list= that.state.comments_list;

                for(var comment in data){
                    that.addCommentToList(comments_list,data,comment);
                }

            }else{
                TouchList.setState({
                    comments_list:[]
                })
            }
        }).catch(error => console.log(error));
    }


    s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      };
      uniqueId = () => {
        return (
          this.s4() + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4() + "-" + this.s4()
        );
      };
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
        if(ivterval>1){
            return interval+ 'Month'+this.pluralCheck(interval);
        }
        interval=Math.floor(seconds/ 86400);
        if(ivterval>1){
            return interval+ 'Day'+this.pluralCheck(interval);
        }
        interval=Math.floor(seconds/ 3600);
        if(ivterval>1){
            return interval+ 'Hour'+this.pluralCheck(interval);
        }
        interval=Math.floor(seconds/ 60);
        if(ivterval>1){
            return interval+ 'minute'+this.pluralCheck(interval);
        }
        return Math.floor(seconds)+ 'second'+this.pluralCheck(seconds);
    }

    componentDidMount = () => {
        var that =this;
        f.auth().onAuthStateChanged(function(user){
            if(user){
                //Logged in
                that.setState({
                    loggedin: true
                })
            }else{
                //not Logged in
                that.setState({
                    loggedin: false
                });
            }
        });
        this.checkParams();
    }

    postComment=()=>{
    
        var comment = this.state.comment;
        if(comment !=''){
            var imageId=this.state.photoId;
            var userId= f.auth().currentUser.uid;
            var commentId = this.uniqueId();
            var dateTime = Date.now();
            var timestamp = Math.floor(dateTime/1000);

            this.setState({
                comment:''
            });
            var commentObj ={
                posted:timestamp,
                author:userId,
                comment:comment
            };

            database.ref('/comments/'+'/'+commentId).set(commentObj);

        }else{
            alert('Please enter any comment');
        }
    }

    reloadComment = () => {
        this.setState({
            comments_list: []
        });
        this.fetchComments(this.state.photoId);
    }
    
    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flexDiection:'row',height:70,paddingTop:30,backgroundColor:'white',borderColor:0.5,justifyContent:'center',justifyContent:'space-between',alignItems:'center'}}>
                            <TouchableOpacity 
                            style ={{width:100}}
                            onPress={()=> this.props.navigation.goBack()} >
                                <Text style ={{fontSize:12,fontWeight:'bold',paddingLeft:10}} >Go Back</Text>
                            </TouchableOpacity>
                            <Text>Comments</Text>
                            <Text style ={{width:100}}>?</Text>

                        </View>
                        {this.state.comments_list.length == 0 ? (
                            //no comment is there
                            <Text>No comments</Text>
                        ):(
                            //are comments
                        <FlatList 
                        refreshing={this.this.state.comments_list}
                        keyExtractor={(item,index)=> index.toString()}
                        style={{flex:1,backgroundColor:'#eee'}}
                        renderItem={({item,index})=>(
                            <View key={index} style={{width:'100%',overflow:'hidden',marginBottom:5,justifyContent:'space-between',borderBottomWidth:1,borderColor:'grey'}}>
                                <View style={{padding:5,width:'100%',flexDirection:'row',justifyContent:''}}>
                                    <Text>{item.posted}</Text>
                                    <TouchableOpacity 
                                    onPress={()=> this.props.navigation.navigatte('user',{userId:item.authorId})}
                                    >
                                        <Text>{item.author}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{padding:5}} >
                                    <Text>{item.comment}</Text>
                                </View>
                            </View>
                        )}
                        />
                        )}
                { this.state.loggedin == true ? (
                    //are logged in
                    <KeyboardAvoidingView behavior='padding' enabled style={{borderTopColor:'grey',borderWidth:1,padding:10,marginBottom:15}} >
                        <Text style={{fontWeight:'bold'}}>
                            Post comment
                        </Text>
                        <View>
                            <TextInput 
                            editable={true}
                            placeholder={'enter your comment here...'}
                            onChangeText={(text)=> this.setState({comment:text})}
                            value={this.state.comment}
                            style={{marginVertical:10,height:50,padding:5,borderColor:'white',borderRadius:3,color:'black'}}
                            />
                            <TouchableOpacity
                            onPress={()=> this.postComment()}
                            style={{paddingHorizontal:10,paddingVertical:10, backgroundColor:'blue',borderRadius:5}}>
                                <Text style={{color:'white'}}>Post</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                ) : (
                    //not logged in
                    <UserAuth message={"Please login to comment"} moveScreen={true} navigation={this.props.navigation}  />    
                )}

             
            </View>

        )
        
    }
}

export default comment;
