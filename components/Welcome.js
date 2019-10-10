import React, { Component } from 'react';
import { Text, View, Image, Dimensions } from 'react-native';


export default class Welcome extends Component {

  static navigationOptions = {
    header:null
  }

  constructor(props){
    super(props);
    this.handleWhiteChange = this.handleWhiteChange.bind(this);
    this.handleBlackChange = this.handleBlackChange.bind(this);
    this.state = {
      white: '',
      black: '',
    }
  }

  handleWhiteChange(e){
   this.setState({"white":e.nativeEvent.text});
  }

  handleBlackChange(e){
   this.setState({"black":e.nativeEvent.text});
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
      <Text style={{fontSize:40}}>2 Player Chess</Text>
      <Image source={{uri: "https://simplerdevelopment.com/assets/king-white.png"}} style={{width: (Dimensions.get('window').width*.60), height: 75,top:100}} resizeMode="contain" />
	    <Text onPress={()=> navigate('Board')} style={styles.btn}>Start Game</Text>
      <Text onPress={()=> navigate('Pieces')} style={{top:300}} >Piece Info</Text>
      </View>
    );
  }
}



const styles = {
	label:{
		marginTop:20,
		fontSize:25
	},
  btn:{
  	top:200,
  	borderWidth:1,
  	borderRadius:5,
  	borderColor:"blue",
  	padding:5,
  	fontSize:25
  },
  container:{
		alignItems: 'center',
	 	top: 50,
  	}
}
