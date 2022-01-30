import React, { useEffect, useState } from 'react'
import {View, Text} from 'react-native'

export default CallTimer = (props) => {

    const [minute, setMinute] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect (() => {
        countTimer()
    },  [])

    const countTimer = () => {
        var time = props.time
        var timeLeft = 0
       
          var timeCounter = setInterval(() =>  {
            var d = new Date(); //get current time
            var seconds = time * 60 //d.getMinutes() * 60 + d.getSeconds(); //convet current mm:ss to seconds for easier caculation, we don't care hours.
            var secondsLeft = seconds - timeLeft
            var minutes = Math. floor(secondsLeft / 60);
            var secs = secondsLeft % 60
            timeLeft = timeLeft + 1
            // var fiveMin = 60 * 5; //five minutes is 300 seconds!
            // var timeleft = fiveMin - seconds % fiveMin; // let's say now is 01:30, then current seconds is 60+30 = 90. And 90%300 = 90, finally 300-90 = 210. That's the time left!
            // var result = parseInt(timeleft / 60) + ':' + timeleft % 60; //formart seconds back into mm:ss 
            if(timeLeft == (time * 60)){
              clearInterval(timeCounter)
              props.onTimerEnd()
           
            }
            setMinute(minutes)
            setSeconds(secs)
        }, 1000)
        
      }

      return (
          <View>
              <Text style={{fontSize: 18, color: '#fff'}}>{`${minute}:${seconds}`}</Text>
          </View>
      )
}