import * as React from 'react';
import { WebView } from 'react-native-webview';



export default class Web extends React.Component {
	static navigationOptions = {
	  title: 'Piece Info'
	}

	constructor(props){
		super(props)
	}

  render() {
    return <WebView source={{ uri: this.props.navigation.state.params.uri }} style={{ marginTop: 20 }} />;
  }
}