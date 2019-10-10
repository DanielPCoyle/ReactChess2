import React, { Component } from 'react';
import styles from './Styles'
import { StyleSheet, Text, View, Image, TouchableHighlight } from 'react-native';
let _ = require('lodash')

export default class Spaces extends Component {
		constructor(props){
			super(props)

		}

		render(){
		var  spaces = [];
		var  rowStart;
		var  itemStyle;
		var  pieceImg;
		var  squareStyle;
		for (const [rowIndex, row] of this.props.board.entries()) {
			spaces[rowIndex] = [];
			if (rowIndex%2 == 0){
				rowStart = 0;
			} else {
				rowStart = 1;
			}
			for(const [itemIndex, item] of row.entries()){
				let piece = _.find(this.props.pieces, ['position', item]) || null;
				squareStyle = [styles.itemContainer]
				if ((itemIndex+rowStart)%2 == 0){
				} else{
					squareStyle.push(styles.odd);
				}
				if(this.props.possible.indexOf(item) > -1){
					squareStyle.push(styles.possible);
				}

				if(piece){
					if(piece.position == this.props.selected){
						squareStyle.push(styles.selected);
					}
					pieceImg = "https://simplerdevelopment.com/assets/"+piece.piece+"-"+piece.color+".png";
					if(this.props.possible.indexOf(item) > -1){
						spaces[rowIndex].push(
							<View style={squareStyle} key={itemIndex}>
							<TouchableHighlight onPress={() => this.props.pieceMove(item,this.props.selected)} underlayColor='green'>
							<Image source={{uri: pieceImg}} style={{width: 40, height: 40}} />
							</TouchableHighlight>
							</View>);
					} else{
						spaces[rowIndex].push(
							<View style={squareStyle} key={itemIndex}>
							<TouchableHighlight onPress={() => this.props.pieceSelect(piece,this.props.turn)} underlayColor='orange'>
							<Image source={{uri: pieceImg}} style={{width: 40, height: 40}} />
							</TouchableHighlight>
							</View>);
					}
				} else{
					if(this.props.possible.indexOf(item) > -1){
						spaces[rowIndex].push(
							<TouchableHighlight key={itemIndex}  onPress={() => this.props.pieceMove(item,this.props.selected)} underlayColor='green'>
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
}