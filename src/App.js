import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import Navigator from './Navigation/Navigator';
import firebaseApp from './firebaseApp';
import Loader from './Components/Loader';

// Initial route constants
const LOGIN = 'Login';
const LISTS = 'Lists'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initialRoute: false,
            user_id: false
        }
    }

    componentWillMount() {
        // Check to see if user is logged to determine what the initial route is going to be
        AsyncStorage.getItem('token')
            .then(result => {                 
                this.setState({ initialRoute: result ? LISTS : LOGIN, user_id: result });
            }).catch(err => console.log('root err', err));
    }

    render() {        
        const { initialRoute, user_id } = this.state;
        return initialRoute ? <Navigator initialRouteParams={{ user_id }} initialRoute={initialRoute} /> : <Loader />;
    }
}

export default App;