import { StyleSheet, Dimensions} from 'react-native';

export default StyleSheet.create({
	container: {
		flex: 1,
		marginTop:20,
		backgroundColor: '#fff',
		flexDirection: 'row',
		flexWrap: 'wrap'
	}, 
	itemContainer: {
		backgroundColor:'#b24708',
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
		textAlign:"center",
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
		backgroundColor:"blue",
		color:"white",
		padding:5,
		textAlign:"center",
		marginBottom:5,

	}
});