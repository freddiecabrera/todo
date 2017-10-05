import { StackNavigator } from 'react-navigation';
import routeConfig from './routeConfig';
import React, { Component } from 'react';

class Navigator extends Component {
    constructor(props) {
        super(props);
        this.StackNavigatorConfig = {
            initialRouteName: props.initialRoute,
            initialRouteParams: props.initialRouteParams,
            headerMode: 'none'
        };
    }

    render() {        
        const Stack = StackNavigator(routeConfig, this.StackNavigatorConfig); 
        return <Stack />
    }
}


export default Navigator;