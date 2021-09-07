import React, {Component} from 'react'
import  { View, TouchableOpacity, Text } from 'react-native'
import { getMetricMetaInfo, timeToString, getDailyReminder  } from '../utils/helpers'
import { submitEntry, deleteEntry } from '../utils/api'
import UdaciSlider from './UdaciSlider'
import UdaciStepper from './UdaciStepper'
import DateHeader from './DateHeader'
import { Ionicons } from '@expo/vector-icons'
import TextButton from './TextButton'
import { connect } from 'react-redux'
import { addEntry, AddEntry } from '../actions'
import { connect } from 'react-redux'


function SubmitBtn ({onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <Text>Submit</Text>
    </TouchableOpacity>
  )
}

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
    submitEntry({key, entry})
  }

  reset = () => {
    const key = timeToString()
    this.props.dispatch(addEntry({
      [key]: getDailyReminder()
    }))
    deleteEntry(key)
  }

  render () {
    const metaInfo = getMetricMetaInfo()
    if (this.props.alreadyLogged) {
      return (
        <View>
          <Ionicons
            name='ios-happy-outline'
            size={100}
          />
          <Text>You already logged your information for today</Text>
          <TextButton onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }
    return (
      <View>
        <DateHeader date={(new Date()).toLocaleDateString()} />
        {
          Object.keys(metaInfo).map((key) => {
            const { getIcon, type, ...rest} = metaInfo[key]
            const value = this.state[key]
            return (
              <View key = { key }>
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

function mapStateToProps (state) {
  const key = timeToString()
  return {
    alreadyLogged = state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)
