import React, { Component } from 'react';
import { Text, View, TextInput, Dimensions } from 'react-native';

export default class Welcome extends Component {
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
      	<Text style={styles.label}>Player 1's Name: {this.state.white}</Text>
	  	<TextInput
	      style={{ width:Dimensions.get("window").width, height: 40, borderColor: 'gray', borderWidth: 1 }}
	      onChange={this.handleWhiteChange} 
	    />

	    <Text style={styles.label}>Player 2's Name: {this.state.black}</Text>
	  	<TextInput
	      style={{ width:Dimensions.get("window").width, height: 40, borderColor: 'gray', borderWidth: 1 }}
         onChange={this.handleBlackChange} 
	       />
	    <Text onPress={()=> navigate('Board')} style={styles.btn}>Start Game</Text>
      <Text onPress={()=> navigate('Pieces')} style={{top:100}} >Piece Info</Text>
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
  	marginTop:20,
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
