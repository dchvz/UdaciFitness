import React, {Component} from 'react'
import  { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminder, clearLocalNotification, setLocalNotification  } from '../utils/helpers'
import { submitEntry, removeEntry } from '../utils/api'
import UdaciSlider from './UdaciSlider'
import UdaciStepper from './UdaciStepper'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { connect } from 'react-redux'
import { addEntry } from '../actions'
import { purple, white } from '../utils/colors'
import {CommonActions} from '@react-navigation/native';

function SubmitBtn ({onPress}) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.androidSubmitBtn}
      onPress={onPress}
    >
      <Text style={styles.submitBtnText}>Submit</Text>
    </TouchableOpacity>
  )
}
// check the button styling again

class AddEntry extends Component {
  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  increment = (metric) => {
    const { step, max } = getMetricMetaInfo(metric)
    this.setState((state) => {
      const count = state[metric] + step
      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  decrement = (metric) => {
    this.setState((state) => {
      const count = state[metric] - getMetricMetaInfo(metric).step
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState((state) => {
      return {
        ...state,
        [metric]: value
      }
    })
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state
    this.props.dispatch(addEntry({
      [key]: entry
    }))
    this.setState(() => ({
      run: 0,
      bike: 0,
      swim: 0,
      sleep: 0,
      eat: 0
    }))
    this.toHome();
    submitEntry({key, entry})
    clearLocalNotification()
      .then(setLocalNotification)
  }

  reset = () => {
    const key = timeToString()
    this.props.dispatch(addEntry({
      [key]: getDailyReminder()
    }))
    this.toHome();
    removeEntry(key)
  }

  toHome = () => {
    this.props.navigation.dispatch(CommonActions.goBack())
  }


  render () {
    const metaInfo = getMetricMetaInfo()
    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline': 'md-happy'}
            size={100}
          />
          <Text>You already logged your information for today</Text>
          <TextButton onPress={this.reset} style={{padding: 10}}>
            Reset
          </TextButton>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {
          Object.keys(metaInfo).map((key) => {
            const { getIcon, type, ...rest} = metaInfo[key]
            const value = this.state[key]
            return (
              <View key = { key } style={styles.row}>
                { getIcon() }
                { type === 'slider'
                  ? <UdaciSlider
                  value = {value}
                  onChange = {(value) => this.slide(key, value)}
                  {...rest}
                  />
                  : <UdaciStepper
                  value = {value}
                  onIncrement = {() => this.increment(key)}
                  onDecrement = {() => this.decrement(key)}
                  {...rest}
                  />

                }
              </View>
            )
          })
        }
        <SubmitBtn onPress={this.submit}></SubmitBtn>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: white
  },
  iosSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    borderRadius: 7,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  androidSubmitBtn: {
    backgroundColor: purple,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    borderRadius: 2,
    alignSelf: 'flex-end',
    justifyContent: 'center'
  },
  submitBtnText: {
    color: white,
    fontSize: 22,
    textAlign: 'center'
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginRight: 30
  }
})

function mapStateToProps (state) {
  const key = timeToString()
  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)
