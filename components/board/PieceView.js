import React, { Component } from 'react';
import { Text, ScrollView, View, TextInput, Dimensions, TouchableHighlight, Image } from 'react-native';

export default class PieceView extends Component {
  constructor(props){
    super(props);
   
  }
	static navigationOptions = {
		title: 'Pieces',
	}

 render() {
  
  const uris ={
	pawn:"https://en.wikipedia.org/wiki/Pawn_(chess)",
	knight:"https://en.wikipedia.org/wiki/Knight_(chess)",
	rook:"https://en.wikipedia.org/wiki/Rook_(chess)",
	bishop:"https://en.wikipedia.org/wiki/Bishop_(chess)",
	queen:"https://en.wikipedia.org/wiki/Queen_(chess)",
	king:"https://en.wikipedia.org/wiki/King_(chess)",
  };

  const {navigate} = this.props.navigation;
  let nPieceSpace = this.props.navigation.state.params ?  this.props.navigation.state.params.space : null;
  const pieces = require("./pieces");
  let checked = [];
   let cards = [];
	for (const [i, piece] of pieces.entries()) {
    if(nPieceSpace && piece.piece == "king"){

    }else{
  		if(checked.indexOf(piece.piece) < 0){
  			checked.push(piece.piece);
  			let pieceImg = "https://simplerdevelopment.com/assets/"+piece.piece+"-"+piece.color+".png";
  			let button
        if(nPieceSpace){
          cards.push(
    			<View style={styles.card} key={i}>
    				<Image source={{uri: pieceImg}} style={{width: (Dimensions.get('window').width*.60), height: 75}} resizeMode="contain" />
    				<Text style={styles.headline}>{piece.piece}</Text>
    				<TouchableHighlight  onPress={()=> navigate('Web',{"uri":uris[piece.piece]})} underlayColor='green'>
    					<Text  style={styles.btn}>Piece Info</Text>
    				</TouchableHighlight>
            <TouchableHighlight  onPress={()=> navigate('Board',{"nPiece":[piece.piece,nPieceSpace:nPieceSpace]})} underlayColor='green'>
              <Text  style={[styles.btn, {backgroundColor:"blue", color:"white"}]}>Select</Text>
            </TouchableHighlight>
    			</View>
    			);
        } else{
          cards.push(
          <View style={styles.card} key={i}>
            <Image source={{uri: pieceImg}} style={{width: (Dimensions.get('window').width*.60), height: 75}} resizeMode="contain" />
            <Text style={styles.headline}>{piece.piece}</Text>
            <TouchableHighlight  onPress={()=> navigate('Web',{"uri":uris[piece.piece]})} underlayColor='green'>
              <Text  style={[styles.btn]}>Piece Info</Text>
            </TouchableHighlight>
          </View>
          );
        }
  		}
    }
	}
    return (
	 <View style={styles.container}>
	 <Text style={[styles.headline,styles.top(100)]}>Chess Pieces</Text>
      <ScrollView  horizontal={true}>
      	{cards}
      </ScrollView>
      </View>
    );
  }
}

const styles = {
	label:{
		fontSize:25
	},
  btn:{
  	borderWidth:1,
  	borderRadius:5,
  	borderColor:"blue",
  	padding:5,
  	fontSize:25,
    textAlign: 'center', 
    width: 100,
    marginBottom:10

  },
  container:{
  	},
  	card:{
  		flex:1,
  		alignItems:'center',
  		top:Dimensions.get('window').height*.30,
  		height: Dimensions.get('window').height
  	},
  	headline: {
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 0,
  },
  top(margin){
  	return {
  		top: margin
  	}
  }
}

