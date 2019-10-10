import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Dimensions, TouchableHighlight,Alert } from 'react-native';
let _ = require('lodash'),
flip = require('flipout');
import Spaces from "./Spaces.js"
import styles from './Styles'

class Board extends Component {
	constructor(props){
		super(props)
		this.state = {
			board:require('./board.json'),
			pieces:require('./pieces.json'),
			possible:[],
			spaces:null,
			turn:"white",
			spacesRefreshIndex:0,
		}
		this.baseState = this.state;
		this.vert = ["a","b","c","d","e","f","g",'h'];
		this.pieceSelect = this.pieceSelect.bind(this);
		this.pieceMove = this.pieceMove.bind(this);

	}

	 bestCopyEver(src) {
	  return Object.assign({}, src);
	}


	pieceSelect(piece,turn){
		if(turn == piece.color){
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
				var p1 = this.vert[Number(y)+1]+String(x);
			 	var p1Check  = _.find(this.state.pieces, ['position', p1]);
				if(!p1Check){
					possible.push(p1);
					var p2 = this.vert[Number(y)+2]+String(x);
				 	var p2Check  = _.find(this.state.pieces, ['position', p2]);
					if(!p2Check){
						possible.push(p2);
					}
				}
			} else{
				var p1 = this.vert[Number(y)-1]+String(x);
			 	var p1Check  = _.find(this.state.pieces, ['position', p1]);
				if(!p1Check){
					possible.push(p1);
					var p2 = this.vert[Number(y)-2]+String(x);
				 	var p2Check  = _.find(this.state.pieces, ['position', p2]);
					if(!p2Check){
						possible.push(p2);
					}
				}
			}
		} else{
			if(piece.color == "white"){
				var moveCheckSpace = this.vert[Number(y)+1]+String(x);
			} else{
				var moveCheckSpace = this.vert[Number(y)-1]+String(x);
			}

			var moveCheck = _.find(this.state.pieces, ['position', moveCheckSpace]);
			if(!moveCheck){
				possible.push(moveCheckSpace);
			}
		}
			if(piece.color == "white"){
				var moveCheckSpace = this.vert[Number(y)+1]+String(x);
				var killCheck1 = this.vert[Number(y)+1]+String(Number(x)+1);
				var killCheck2 = this.vert[Number(y)+1]+String(Number(x)-1);
			} else{
				var moveCheckSpace = this.vert[Number(y)-1]+String(x);
				var killCheck1 = this.vert[Number(y)-1]+String(Number(x)-1);
				var killCheck2 = this.vert[Number(y)-1]+String(Number(x)+1);
			}
			killCheck1 = _.find(this.state.pieces, ['position', killCheck1]);
			killCheck2 = _.find(this.state.pieces, ['position', killCheck2]);
			if(typeof(killCheck1) !== "undefined" && killCheck1.color !== piece.color){
				possible.push(killCheck1.position);
			}
			if(typeof(killCheck2) !== "undefined" && killCheck2.color !== piece.color){
				possible.push(killCheck2.position);
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
		possible = possible.concat(this.acrossPossible(piece));

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
		possible = possible.concat(this.validateDiagonal(piece));
		return possible;
	}


	queen(piece){
		var possible = [];
		possible = possible.concat(this.bishop(piece,"+",'+'));
		possible = possible.concat(this.rook(piece,"+",'+'));
		return possible;
	}
	
	validateDiagonal(piece){
		var y = Number(this.vert.indexOf(piece.position[0]))+1;
		var x = Number(piece.position[1]);
		var flag;
		var possible = [];
		var bl2tr = [];
		var tl2br = [];
		var spaces = [];
		var direction = {};
		for (var i = 0; i < this.state.board.length; i++) {
			spaces = spaces.concat(this.state.board[i]);
		}
		for (var i = 0; i < spaces.length; i++) {
			var space = spaces[i];
			var a = this.vert.indexOf(piece.position[0])+1, // 0 to 7
		   	    b = parseInt(piece.position[1]);       // 0 to 7
		
			var x = this.vert.indexOf(space[0])+1,   // 0 to 7
			    y = parseInt(space[1]);         // 0 to 7
			// test to see how it's moving
			if (a + b === x + y) {  
			    if(space == piece.position){
			    	bl2tr.push("current");
			    } else{
			    	bl2tr.push(space);
			    }
			} 
		}
		for (var i = 0; i < spaces.length; i++) {
			var space = spaces[i];
			var a = this.vert.indexOf(piece.position[0])+1, // 0 to 7
		   	    b = parseInt(piece.position[1]);       // 0 to 7
		
			var x = this.vert.indexOf(space[0])+1,   // 0 to 7
			    y = parseInt(space[1]);         // 0 to 7
			// test to see how it's moving
			if( a - x === b - y){
			 if(space == piece.position){
			    	tl2br.push("current");
			    } else{
			    	tl2br.push(space);
			    }
			}
		}

		var split = false;
		 direction["tr"] = [];
		 direction["bl"] = [];
		for (var i = 0; i < bl2tr.length; i++) {
			var cSpace = bl2tr[i];
			if(cSpace == "current"){
				split = true;
			} else{
				if(split == false){
					direction["tr"].push(cSpace);
				} else{
					direction["bl"].push(cSpace);
				}
			}
		}
		split = false;
		direction["tl"] = [];
		direction["br"] = [];
		for (var i = 0; i < tl2br.length; i++) {
			 cSpace = tl2br[i];
 			if(cSpace == "current"){
				split = true;
			} else{
				if(split == false){
					direction["tl"].push(cSpace);
				} else{
					direction["br"].push(cSpace);
				}
			}
		}
		var dKeys = Object.keys(direction);
		for (var i = 0; i < dKeys.length; i++) {
			var d = dKeys[i];
			var dArray = direction[d];
			if((d == "tr") || (d == "tl")) {
				dArray = dArray.reverse();
			}


			for(const pSpace of dArray){
				var pSpaceCheck = _.find(this.state.pieces, ['position', pSpace]);
				if(pSpaceCheck){

					if(pSpaceCheck.color !== piece.color){
						possible.push(pSpace);
					}
					break;
				} else{
					possible.push(pSpace);
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


	acrossPossible(piece){
		var possible = [];
		var results = [];
		var spaces = [];
		var lines = {};
		 lines['upDown'] = [];
		 lines['leftRight'] = [];
		var direction = {};
			direction["up"] = [];
			direction["down"] = [];
			direction["left"] = [];
			direction["right"] = [];
		for (var i = 0; i < this.state.board.length; i++) {
			spaces = spaces.concat(this.state.board[i]);
		}
		for (var i = 0; i < spaces.length; i++) {
			var space = spaces[i];
			var a = this.vert.indexOf(piece.position[0])+1, 
			    b = parseInt(piece.position[1]);       
			var x = this.vert.indexOf(space[0])+1,   
			    y = parseInt(space[1]);         
			if (a === x) {           
			   lines['leftRight'].push(space);
			} 
			if(b === y){
			    lines['upDown'].push(space);
			} 
		}

		var lKeys = Object.keys(lines);
		for (var i = 0; i < lKeys.length; i++) {
			lKey = lKeys[i];
			var split = false;
			for (var cSpace of  lines[lKey]) {
				if(cSpace == piece.position){
					cSpace = "current";
					split = true;
				}
				if(lKey == "upDown"){
					if(split == false){
						direction["up"].push(cSpace);
					} else{
						direction["down"].push(cSpace);
					}
				} else{
					if(split == false){
						direction["left"].push(cSpace);
					} else{
						direction["right"].push(cSpace);
					}
				}
			}
		}
		var dKeys = Object.keys(direction);
		for (var i = 0; i < dKeys.length; i++) {
			var dKey = dKeys[i];
			var directionArray = direction[dKey];
			if( dKey == "up" ){
				directionArray = directionArray.reverse();
			}
			if((dKey == "left") ){
				directionArray = directionArray.reverse();
			}
			for (var pSpace of directionArray) {
				if(pSpace == "g1"){
					console.log(dKey,"g1");
				}
				var pSpaceCheck = _.find(this.state.pieces, ['position', pSpace]);
	
				if(pSpaceCheck){
					if(pSpaceCheck.color !== piece.color){
						possible.push(pSpace);
					}
					break;
				}else{
					possible.push(pSpace);
				}
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

	newGame(){
		const reset = require('./reset.json');
		const pieces = Array.from(require('./pieces.json'));
		var positions = {};
		for (var i = 0; i < pieces.length; i++) {
			 pieces[i].position = reset[pieces[i].key];
		}
		this.setState(this.baseState,() => {
			this.setState({pieces:pieces},() => {
			});
		})
	}

	render() {
		return (
			<View key={this.state.spacesRefreshIndex} style={[styles.container,styles[this.state.turn],{backgroundColor:this.state.turn}]}>
			<Text style={[styles.turn, {color:this.state.turn == "white" ? "black" : "white"}]}>{flip(this.state.turn+"'s turn")}</Text>
			<Spaces 
			possible={this.state.possible} 
			board={this.state.board}
			pieces={this.state.pieces} 
			pieceMove={this.pieceMove}
			pieceSelect={this.pieceSelect}
			turn={this.state.turn}
			selected={this.state.selected}
			possible={this.state.possible}/>
			<Text style={[styles.turn, {color:this.state.turn == "white" ? "black" : "white"}]}>{this.state.turn+"'s turn"}</Text>
			<Text style={[styles.btn]} onPress={() => this.newGame()}>New Game</Text>		
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
	}

	render() {
	  const {navigate} = this.props.navigation;
	  const template = (
			<View style={{flex:1}}>
				<Board />
			      <Text style={styles.btn} onPress={()=> navigate('Pieces')}>Piece Info</Text>
			</View>
		);
		return template;
	}
}

