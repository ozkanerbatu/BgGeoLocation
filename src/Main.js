import { View, Text } from 'react-native'
import React,{useEffect,useState} from 'react'
import { PermissionsAndroid } from 'react-native';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';


RNLocation.configure({
    distanceFilter: 100, // Meters
    desiredAccuracy: {
      ios: 'best',
      android: 'balancedPowerAccuracy',
    },
    // Android only
    androidProvider: 'auto',
    interval: 5000, // Milliseconds
    fastestInterval: 10000, // Milliseconds
    maxWaitTime: 5000, // Milliseconds
    // iOS Only
    activityType: 'other',
    allowsBackgroundLocationUpdates: false,
    headingFilter: 1, // Degrees
    headingOrientation: 'portrait',
    pausesLocationUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: false,
});


let locationSubscription = null;
let locationTimeout = null;




const Main = () => {

    useEffect(() => {

        const requestPremission = async () => {
            const backgroundgranted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                {
                  title: 'Arka PLan konum izni',
                  message:
                    'Konumu kullanmamiz lazim ',
                  buttonNeutral: 'sonra hatırlat',
                  buttonNegative: 'hayır',
                  buttonPositive: 'evet',
                },
              );
              if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
                ReactNativeForegroundService.add_task(() => {
                      RNLocation.requestPermission({
                        ios: 'whenInUse',
                        android: {
                          detail: 'fine',
                        },
                      }).then((granted) => {
                        console.log('Location Permissions:', granted);
                        // if has permissions try to obtain location with RN location
                        if (granted) {
                          locationSubscription && locationSubscription();
                          locationSubscription = RNLocation.subscribeToLocationUpdates(
                            ([locations]) => {
                              locationSubscription();
                              locationTimeout && clearTimeout(locationTimeout);
                              console.log(locations);
                              setLatitude(locations.latitude)
                              setLongitude(locations.longitude)
                            },
                          );
                        } else {
                          locationSubscription && locationSubscription();
                          locationTimeout && clearTimeout(locationTimeout);
                          console.log('no permissions to obtain location');
                        }
                      });
                    },
                    {
                      delay: 1000,
                      onLoop: true,
                      taskId: '123',
                      onError: (e) => console.log('Error logging:', e),
                    },
                  );
              }
        }
        requestPremission();
    }, [])


    const[latitude,setLatitude] =useState(0)
    const[longitude,setLongitude] =useState(0)



  return (
    <View>
      <Text>Latitude: {latitude}</Text>
      <Text>Longitude: {longitude}</Text>
    </View>
  )
}

export default Main