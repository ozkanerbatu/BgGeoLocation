import firestore from '@react-native-firebase/firestore';

export function sendData(Latitude, Longitude) {
  firestore()
    .collection('Locations')
    .add({
      Latitude: Latitude,
      Longitude: Longitude,
    })
    .then(() => {
      console.log('locations added!');
    });
}
