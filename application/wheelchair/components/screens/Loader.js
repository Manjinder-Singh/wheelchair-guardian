import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';

const logo = require('../../Assets/wheel.gif'); 

const Loader = () => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    scaleAnimation.start();

    return () => {
      scaleAnimation.stop();
    };
  }, []);

  const scaleInterpolate = scaleValue.interpolate({
    inputRange: [1, 1.2],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <View style={styles.loader}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
        <Animated.Text style={[styles.text, { transform: [{ scale: scaleInterpolate }] }]}>Wheelchair Guardian</Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 5,
  },
  loader: {
    width: 150,
    height: 150,
    position: 'relative',
    textAlign: 'center',
    zIndex: 0,
    textTransform: 'uppercase',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderStyle: 'solid',
    borderColor: '#fff',
    opacity: 0,
  },
  circle1: {
    transform: [{ rotate: '0deg' }],
    animationDelay: '0s',
  },
  circle2: {
    transform: [{ rotate: '120deg' }],
    animationDelay: '0.2s',
  },
  circle3: {
    transform: [{ rotate: '240deg' }],
    animationDelay: '0.4s',
  },
  text: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    marginTop: -12,
    fontWeight: 'bold',
    fontSize: 24,
    color: '#fff',
    zIndex: 1,
    textAlign: 'center',
  },
});

export default Loader;
