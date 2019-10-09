import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableHighlight,Alert } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

let _ = require('lodash'),
flip = require('flipout');
const pieces = require("./pieces.json");




class Board extends Component {

	constructor(props){
		super(props)
		this.state = {
			board:require('./board.json'),
			pieces:props.pieces,
			possible:[],
			turn:props.turn,
		}
		this.vert = ["a","b","c","d","e","f","g",'h'];
	}



	pieceSelect(piece,filled){
		if(this.state.turn == piece.color){
			this.setState({"selected":piece.position});
			this.setState({"possible":this.possibleMoves(piece)+" "+piece.piece});
		} else {
			Alert.alert("Opps!", "It is not your turn",[{text: 'Ok Cool', onPress:null}] );
		}

	}

	pieceMove(space,piece){
		if(space !== piece){
			  piece = _.find(this.state.pieces, ['position', piece]);
			 const existing = this.state.pieces.filter(pieceObj => pieceObj.position !== space);
			 
			 var existingPiece = _.find(this.state.pieces, ['position', space]) || null;
				if(existingPiece && existingPiece.piece == "king"){
					Alert.alert("Oh Yeah!", this.state.turn+" Wins!");
				}

				if(piece.color == "white" && space.indexOf("h") > -1 && piece.piece == "pawn"){
					Alert.alert("Oh Yeah!", "You get another piece!");
				}

				if(piece.color == "black" && space.indexOf("a") > -1 && piece.piece == "pawn"){
					Alert.alert("Oh Yeah!", "You get another piece!", [{text: "Let's Do It", onPress(){ this.pickANewPiece() }} ]); 
				}
				
			if(existing.indexOf(piece) > -1){
				piece.position = space;
				piece.init = true;
				existing[existing.indexOf(piece)] = piece;
			}

			this.setState({"pieces":existing});
			this.setState({"possible":[]});
			if(this.state.turn == "white"){
				this.setState({"turn":"black"});
			} else{
				this.setState({"turn":"white"});
			}
		}
	}

	possibleMoves(piece){
		let position = piece.position,
		possible = [];
		y = this.vert.indexOf(position[0]),
		x = position[1];

		if(typeof(this[piece.piece]) == "function"){
			possible = this[piece.piece](piece);
		}

		this.setState({'possible':possible});
		return possible;
	}


	pawn(piece){
		var possible = [];
		var y = Number(this.vert.indexOf(piece.position[0]));
		var x = Number(piece.position[1]);
		if(piece.init !== true){
			if(piece.color == "white"){
				 possible.push(this.vert[Number(y)+1]+String(x));
				 possible.push(this.vert[Number(y)+2]+String(x));
			} else{
				possible.push(this.vert[Number(y)-1]+String(x));
				possible.push(this.vert[Number(y)-2]+String(x));
			}
		} else{
			if(piece.color == "white"){
				var moveCheckSpace = this.vert[Number(y)+1]+String(x);
				var killCheck1 = this.vert[Number(y)+1]+String(Number(x)+1);
				var killCheck2 = this.vert[Number(y)+1]+String(Number(x)-1);
			} else{
				var moveCheckSpace = this.vert[Number(y)-1]+String(x);
				var killCheck1 = this.vert[Number(y)-1]+String(Number(x)-1);
				var killCheck2 = this.vert[Number(y)-1]+String(Number(x)+1);
			}

			var moveCheck = _.find(this.state.pieces, ['position', moveCheckSpace]);
			if(!moveCheck){
				possible.push(moveCheckSpace);
			}
			killCheck1 = _.find(this.state.pieces, ['position', killCheck1]);
			killCheck2 = _.find(this.state.pieces, ['position', killCheck2]);
			if(typeof(killCheck1) !== "undefined" && killCheck1.color !== piece.color){
				possible.push(killCheck1.position);
			}
			if(typeof(killCheck2) !== "undefined" && killCheck2.color !== piece.color){
				possible.push(killCheck2.position);
			}
		}
		return possible;
	}

	knight(piece){
		var possible = [];
		var math = [
		[[y,"+",2],[x,"+",1]],
		[[y,"+",2],[x,"-",1]],
		[[y,"-",2],[x,"+",1]],
		[[y,"-",2],[x,"-",1]],
		[[y,"+",1],[x,"+",2]],
		[[y,"+",1],[x,"-",2]],
		[[y,"-",1],[x,"+",2]],
		[[y,"-",1],[x,"-",2]],
		];
		for (const [pi,problem] of math.entries()) {
			var nY = eval(y+problem[0][1]+problem[0][2]);
			var nX = eval(x+problem[1][1]+problem[1][2]);
			var checkPossible = this.vert[nY]+String(nX);
			for (const [row,spaces] of this.state.board.entries()) {
				if(spaces.indexOf(checkPossible) > -1){
					var occupied = _.find(this.state.pieces, ['position', checkPossible]);
					if(typeof(occupied) == "undefined" || (occupied && occupied.color !== piece.color)){
						possible.push(checkPossible);
					}
				}
			}
		}
		return possible;
	}

	rook(piece){
		var possible = [];
		possible = possible.concat(this.acrossPossible(piece, "yu"));
		possible = possible.concat(this.acrossPossible(piece, "yd"));
		possible = possible.concat(this.acrossPossible(piece, "xl"));
		possible = possible.concat(this.acrossPossible(piece, "xr"));
		possible = this.validateAcross(piece,[ ...new Set(possible) ],"u");
		possible = this.validateAcross(piece,possible,"d");
		possible = this.validateAcross(piece,possible,"l");
		possible = this.validateAcross(piece,possible,"r");
		return possible;
	}


	validateAcross(piece,possible,direction){
		var y = Number(this.vert.indexOf(piece.position[0]))+1;
		var x = Number(piece.position[1]);
		var remove = [];
		var flag;

		for (var i = 0; i < 9; i++) {
			if(direction == "u"){
				var yCheck = y + i;
				var space = this.vert[yCheck]+String(x);
			}
			if(direction == "d"){
				var yCheck = y - i;
				var space = this.vert[yCheck]+String(x);
			}
			else if(direction == "l"){
				var space = piece.position[0]+String(Number(x)-i);
			}
			else if(direction == "r"){
				var space = piece.position[0]+String(Number(x)+i);
			}

			if(this.isRealSpace(space) == true){
				var spaceCheck = _.find(this.state.pieces, ['position', space]);
				if(spaceCheck && flag !== true && space !== piece.position){
					flag = true;
					var pCheck = _.find(this.state.pieces, ['position', space]);
					if(pCheck.color == this.state.turn){
						remove.push(space);
					}
				}
				else if(flag == true){
					remove.push(space);
				}
			}
			
		}
		console.log(remove)
		possible = this.removeFromArray(possible,remove);
		console.log(possible);
		return possible;
	}
		removeFromArray(original, remove) {
		  return original.filter(value => !remove.includes(value));
		}

	king(piece){
		var y = this.vert.indexOf(piece.position[0]);
		var x = piece.position[1];
		var positions = [];
		var possible = [];
		positions.push(this.vert[1+Number(y)]+String(x));
		positions.push(this.vert[Number(y)-1]+String(x));
		positions.push(this.vert[y]+String(Number(x)+1));
		positions.push(this.vert[y]+String(Number(x)-1));
		positions.push(this.vert[1+Number(y)]+String(Number(x)+1));
		positions.push(this.vert[1+Number(y)]+String(Number(x)-1));
		positions.push(this.vert[Number(y)-1]+String(Number(x)+1));
		positions.push(this.vert[Number(y)-1]+String(Number(x)-1));
		for(const [direction,space] of positions.entries()){
			if(this.isRealSpace(space) == true){
				if(this.checkVacant(space,piece)){
					possible.push(space);
				}
			}
		}
		return possible;
	}

	bishop(piece){
		var possible = [];
		var lineA1 = this.diagonal(piece,"+",'+'),
			lineA2 = this.diagonal(piece,"-",'-'),
			lineB1 = this.diagonal(piece,"-",'+'),
			lineB2 = this.diagonal(piece,"+",'-');

		possible = possible.concat(lineA1); 
		possible = possible.concat(lineA2); 
		possible = possible.concat(lineB1);
		possible = possible.concat(lineB2); 
		return possible;
	}

	queen(piece){
		var possible = [];
		possible = possible.concat(this.bishop(piece,"+",'+'));
		possible = possible.concat(this.rook(piece,"+",'+'));
		return possible;
	}

	diagonal(piece,opperation,direction){
		var possible = [];
		var y = Number(this.vert.indexOf(piece.position[0]))+1;
		x = Number(piece.position[1]);
		var nY, nX;
		for (var i = 0; i < 9; i++) {
			if(opperation == "+" && direction == "+"){
				if(piece.color == "white"){
					nY = Number(y)+Number(i);
					nX = Number(x)+Number(i)+1;
				} else{
					nY = Number(y)-Number(i);
					nX = Number(x)-Number(i)+1;
				}
			} else if(opperation == "+" && direction == "-"){
				if(piece.color == "white"){
					nY = Number(y)+Number(i);
					nX = Number(x)-Number(i)-1;
				} else{
					nY = Number(y)-Number(i);
					nX = Number(x)+Number(i)-1;
				}
			} else if(opperation == "-" && direction == "+"){
				if(piece.color == "white"){
					nY = Number(y)-Number(i);
					nX = Number(x)+Number(i)-1;

				} else{
					nY = Number(y)+Number(i);
					nX = Number(x)-Number(i)+1;
				}
			} else if(opperation == "-" && direction == "-"){
				if(piece.color == "white"){
					nY = Number(y)-Number(i);
					nX = Number(x)-Number(i)+1;
				} else{
					nY = Number(y)+Number(i);
					nX = Number(x)+Number(i)+1;
				}
			} 
			var check = this.vert[nY]+String(nX);
			if(this.isRealSpace(check) && check !== piece.position){
				var pCheck = _.find(this.state.pieces, ['position', check]);
				if(pCheck){
					if(pCheck.color !== this.state.turn){
						possible.push(check);
					} else{
						possible.push("break");
					}
					
				} else{
						possible.push(check);
				}
			}
		}

		return possible;
	}

	isRealSpace(position){
		var check = false;
		for (var i = 0; i < this.state.board.length; i++) {
			if(this.state.board[i].indexOf(position) > -1){
				check = true;
			}
		}
		return check;
	}

	acrossPossible(piece, axis){
		var possible = [];
		var results = [];
		var y = this.vert.indexOf(piece.position[0])+1;
		var x = piece.position[1];
		var check = [];
		for (var i = 0; i < 16; i++) {
			if(axis == "yu"){
				 check.push(this.vert[Number(y)+i]+String(x));
			}
			if(axis == "yd"){
				 check.push(this.vert[Number(y)-i]+String(x));
			} 
			if(axis == "xl"){
			 	check.push(String(piece.position[0])+String(Number(x)-i));
			} 
			if(axis == "xr"){
			 	check.push(String(piece.position[0])+String(Number(x)+i));
			}
		}
		for (var index = 0; index < check.length; index++) {
			if(this.isRealSpace(check[index]) && check[index] !== piece.position){
				var pCheck = _.find(this.state.pieces, ['position', check[index]]);
				if(pCheck){
					if(pCheck.color !== this.state.turn){
						possible.push(check[index]);
					}
				} 
					possible.push(check[index]);
			}
		}
		return possible;
	}

	checkVacant(check,piece){
		for (const [row,spaces] of this.state.board.entries()) {
			if(spaces.indexOf(check) > -1){
				var occupied = _.find(this.state.pieces, ['position', check]);
				if(typeof(occupied) == "undefined"){
					return true;
				}
			}
		}
		return false;
	}


	spaces(){
		const  spaces = [];
		var  rowStart;
		var  itemStyle;
		var  pieceImg;
		var  squareStyle;
		for (const [rowIndex, row] of this.state.board.entries()) {
			spaces[rowIndex] = []; 
			if (rowIndex%2 == 0){
				rowStart = 0;
			} else {
				rowStart = 1;
			}
			for(const [itemIndex, item] of row.entries()){
				let piece = _.find(this.state.pieces, ['position', item]) || null;
				squareStyle = [styles.itemContainer]
				if ((itemIndex+rowStart)%2 == 0){
				} else{
					squareStyle.push(styles.odd);
				}
				if(this.state.possible.indexOf(item) > -1){
					squareStyle.push(styles.possible);
				}

				if(piece){
					if(piece.position == this.state.selected){
						squareStyle.push(styles.selected);
					}
					pieceImg = "https://simplerdevelopment.com/assets/"+piece.piece+"-"+piece.color+".png";
					if(this.state.possible.indexOf(item) > -1){
						spaces[rowIndex].push(
							<View style={squareStyle} key={itemIndex}>
							<TouchableHighlight onPress={() => this.pieceMove(item,this.state.selected)} underlayColor='green'>
							<Image source={{uri: pieceImg}} style={{width: 40, height: 40}} />
							</TouchableHighlight>
							</View>);
					} else{
						spaces[rowIndex].push(
							<View style={squareStyle} key={itemIndex}>
							<TouchableHighlight onPress={() => this.pieceSelect(piece)} underlayColor='orange'>
							<Image source={{uri: pieceImg}} style={{width: 40, height: 40}} />
							</TouchableHighlight>
							</View>);
					}
				} else{
					if(this.state.possible.indexOf(item) > -1){
						spaces[rowIndex].push(
							<TouchableHighlight key={itemIndex}  onPress={() => this.pieceMove(item,this.state.selected)} underlayColor='green'>
							<View style={squareStyle} >
							<Text>{item}</Text>
							</View>
							</TouchableHighlight>
							);
					} else{
						spaces[rowIndex].push(<View style={squareStyle} key={itemIndex}><Text>{item}</Text></View>);
					}
				}
			}
		}
		return spaces;
	}

	pickANewPiece(){
		return null;
	}


	render() {
		let spaces = this.spaces();
		return (
			<View style={[styles.container,styles[this.state.turn],{backgroundColor:this.state.turn}]}>
			<Text style={[styles.turn, {color:this.state.turn == "white" ? "black" : "white"}]}>{flip(this.state.turn+"'s turn")}</Text>
			{spaces}
			<Text style={[styles.turn, {color:this.state.turn == "white" ? "black" : "white"}]}>{this.state.turn+"'s turn"}</Text>
			</View>
			);
	}
}

export default class ChessBoard extends Component {

	static navigationOptions = {
		title: 'Board',
		header:null
	}

	constructor(props){
		super(props);
		this.state = {
			pieces : require('./pieces.json'),
			turn:"white",
		};
	}

	newGame(){
	}

	render() {
		const  template = (
			<View style={{flex:1}}>
			<Board pieces={this.state.pieces} turn={this.state.turn}/>
			<Text style={styles.btn} onPress={() => this.setState({pieces:{}})}>New Game</Text>
			</View>
			);
		return template;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop:20,
		backgroundColor: '#fff',
		alignItems: 'center',
		flexDirection: 'row',
		flexWrap: 'wrap'
	}, 
	itemContainer: {
		backgroundColor:'#220f11',
		width:Dimensions.get('window').width /8,
		height:60,
		padding:5
	},
	odd:{
		backgroundColor:'#e3d2a3'
	},
	piece:{
		borderWidth: 0.5,
		borderColor: '#d6d7da',
		backgroundColor:"white",
		color:'black',
		fontSize:10,
	},
	selected:{
		backgroundColor: "orange"
	},
	possible:{
		backgroundColor: "rgb(255, 255, 0)",
		borderColor:'black',
		borderWidth:1,
	},
	kill:{
		backgroundColor: "green",
		borderColor:'green',
		borderWidth:1,
	},
	white:{
		backgroundColor:"white",
	},
	black:{
		backgroundColor:"white",
	},
	turn:{
		width:Dimensions.get("window").width,
		fontSize:30,
	},
	turnUpsideDown:{
		width:Dimensions.get("window").width,
		fontSize:30,
	},
	btn:{
		borderWidth:1,
		borderRadius:5,
		borderColor:"blue",
		padding:5

	}
});