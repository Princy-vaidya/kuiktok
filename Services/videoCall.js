import {NativeModules } from 'react-native'

const { Agora } = NativeModules; 
const {
  FPS30,
  AudioProfileDefault,
  AudioScenarioDefault,
  Adaptative,
} = Agora;                                      


export const config = {                            //Setting config of the app
    appid: 'dbe2df5ffd0d41478846823be5c13552',                  //App ID
    channelProfile: 0,                        //Set channel profile as 0 for RTC
    videoEncoderConfig: {                     //Set Video feed encoder settings
      width: 480,
      height: 720,
      bitrate: 1,
      frameRate: FPS30,
      orientationMode: Adaptative,
    },
    audioProfile: AudioProfileDefault,
    audioScenario: AudioScenarioDefault,
  };

export const APPID = "dbe2df5ffd0d41478846823be5c13552"