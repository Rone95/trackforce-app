import React, { useEffect, useState } from 'react';
import { Text, View, Button } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Geolocation from 'react-native-geolocation-service';
import PushNotification from 'react-native-push-notification';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const TrackForce = () => {
  const [location, setLocation] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscribeToLocationUpdates = () => {
      Geolocation.watchPosition(
        (position) => {
          setLocation(position);
          // Save position to your database or state
          console.log('Location:', position);
          showAlert('Location updated!', 'New location received.');
        },
        (error) => {
          console.error(error);
        },
        { enableHighAccuracy: true, interval: 10000, fastestInterval: 5000, distanceFilter: 10 }
      );
    };

    subscribeToLocationUpdates();

    return () => { Geolocation.stopObserving(); };
  }, []);

  const showAlert = (title, message) => {
    PushNotification.localNotification({
      title: title,
      message: message,
    });
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, 'user@example.com', 'password');
      setUser(userCredential.user);
      console.log('User signed in:', userCredential.user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <View>
      <Text>TrackForce App</Text>
      {user ? <Text>Welcome {user.email}</Text> : <Button title="Sign In" onPress={handleSignIn} />}
      {location && <Text>Location: {JSON.stringify(location)}</Text>}
    </View>
  );
};

export default TrackForce;