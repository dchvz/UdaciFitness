import React, { Component } from "react";
import { Text, View } from 'react-native'
import { connect } from 'react-redux'
import { receiveEntries, addEntry } from '../actions'
import { timeToString, getDailyReminder } from '../utils/helpers'
import { fetchCalendarResults } from '../utils/api'

class History extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    fetchCalendarResults()
      .then((entries) => dispatch(receiveEntries(entries)))
      .then(({entries}) => {
        if (!entries[timeToString()]) {
          dispatch(addEntry({
            [timeToString()]: getDailyReminder()
          }))
        }
      })
      .catch(err => {
        console.log('the err is', err)
      })
  }
  render () {
    return (
      <View>
        <Text style={{marginTop: 50}}>{JSON.stringify(this.props)}</Text>
      </View>
    )
  }
}

function mapStateToProps(entries) {
  return {
    entries
  }
}

export default connect(mapStateToProps)(History)