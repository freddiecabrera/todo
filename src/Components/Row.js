import React, { Component } from 'react';
import { StyleSheet, View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';
import Interactable from 'react-native-interactable';

const Height = Dimensions.get('window').height;
const Width = Dimensions.get('window').width;

class Row extends Component {
  constructor(props) {
    super(props);
    this._deltaX = new Animated.Value(0);
  }

  trashAction() {
      const { trashAction, itemIndex, rowData } = this.props;
      trashAction(rowData, itemIndex);
      this.refs['row' + itemIndex].snapTo({ index: 1 });
  }

  checkAction() {
      const { itemIndex, rowData, checkAction } = this.props;
      checkAction(rowData, itemIndex);
      this.refs['row' + itemIndex].snapTo({ index: 1 });
  }

  nextRoute(todo, rowData) {
      this.props.goToTodos(todo);
  }

  render() {
    const { deleteList, itemIndex, rowData, goToTodos } = this.props;
    return (
      <View style={styles.container}>

        <View style={[styles.rowContainer, { right: 0 }]}>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={this.trashAction.bind(this)}>
            <Animated.Image source={require('../../assets/img/trash.png')} style={
              [styles.buttonImage, {
                opacity: this._deltaX.interpolate({
                  inputRange: [-150, -115],
                  outputRange: [1, 0],
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp'
                }),
                transform: [{
                  scale: this._deltaX.interpolate({
                    inputRange: [-150, -115],
                    outputRange: [1, 0.7],
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp'
                  })
                }]
              }
            ]} />
          </TouchableOpacity>
        </View>

        {this.props.type === 'Trash' ? <View style={[styles.rowContainer, { left: 0 }]}>
          <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={this.checkAction.bind(this)}>
            <Animated.Text  style={
              [styles.buttonText, {
                opacity: this._deltaX.interpolate({
                  inputRange: [50, 75],
                  outputRange: [0, 1],
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp'
                }),
                transform: [{
                  scale: this._deltaX.interpolate({
                    inputRange: [50, 75],
                    outputRange: [0.7, 1],
                    extrapolateLeft: 'clamp',
                    extrapolateRight: 'clamp'
                  })
                }]
              }
            ]}>
            Recover
            </Animated.Text>
          </TouchableOpacity>
        </View> : null}

        <Interactable.View
          ref={'row'+itemIndex}
          horizontalOnly={true}
          snapPoints={[
            this.props.type === 'Trash' ? {x: 75, damping: 1-this.props.damping, tension: this.props.tension} : {},
            {x: 0, damping: 1-this.props.damping, tension: this.props.tension},
            {x: -150, damping: 1-this.props.damping, tension: this.props.tension}
          ]}
          dragToss={0.01}
          animatedValueX={this._deltaX}>
          <View style={styles.rowContentContainer}>
            {goToTodos ? 
                <TouchableOpacity style={{ justifyContent: 'center', width: Width, height: Height * 0.07}} onPress={this.nextRoute.bind(this, rowData)}> 
                    {this.props.children}
                </TouchableOpacity>
                :
                <View> 
                    {this.props.children}
                </View>}
          </View>
        </Interactable.View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white'
  },
  rowContainer: { 
    position: 'absolute', 
    height: Height * 0.07, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  rowContentContainer: { 
    left: 0, 
    right: 0, 
    height: Height * 0.07, 
    backgroundColor: 'white', 
    alignItems: 'flex-start', 
    justifyContent: 'center',
    paddingLeft: Width * 0.05 
  },
  button: {
    width: Width * 0.16,
    height: Height * 0.07,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: Width * 0.03,
    color: 'white'
  },
  buttonImage: {
    width: Height * 0.03,
    height: Height * 0.03
  }
});

export default Row;