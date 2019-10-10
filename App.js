import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './components/Welcome';
import Board from './components/board/Board';
import Welcome from './components/Welcome';
import Web from './components/Web';
import PieceView from './components/board/PieceView';
console.ignoredYellowBox = ['Warning: Each'];

const MainNavigator = createStackNavigator({
  Home: {screen: Welcome},
  Web: {screen: Web},
  Pieces: { screen: PieceView },
  Board: {screen: Board},
});


const App = createAppContainer(MainNavigator);

export default App;

