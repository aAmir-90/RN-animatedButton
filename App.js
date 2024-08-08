import {View, Text, TouchableOpacity} from 'react-native';
import React, {useRef, useState} from 'react';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
const AnimatedBtn = Animated.createAnimatedComponent(TouchableOpacity);
const App = () => {
  const [recordingStarted, setRecordingStarted] = useState(false);
  const size = useSharedValue(1);
  const interval = useRef(null);
  const [timer, setTimer] = useState(0);

  const startTimer = () => {
    setRecordingStarted(true);
    interval.current = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    setRecordingStarted(false);
    clearInterval(interval.current);
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: size.value}],
    };
  });
  const gesture = Gesture.LongPress()
    .onStart(() => {
      runOnJS(startTimer)();
      size.value = withRepeat(withTiming(1.5, {duration: 300}), -1, true);
    })
    .onEnd(() => {
      runOnJS(stopTimer)();
      size.value = withTiming(1, {duration: 300});
    });

  const formatTime = time => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };
  return (
    <GestureHandlerRootView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {timer > 0 && (
        <Text
          style={{
            fontSize: 50,
            fontWeight: '600',
            color: 'black',
            marginBottom: 50,
          }}>
          {formatTime(timer)}
        </Text>
      )}
      <GestureDetector gesture={gesture}>
        {/* use <Animated.View > </Animated.View> for longPress animation */}
        <AnimatedBtn
          style={[
            {
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: '#fa2a62',
              justifyContent: 'center',
              alignItems: 'center',
            },
            animatedStyle,
          ]}
          onPress={() => {
            if (recordingStarted) {
              stopTimer();
              size.value = withTiming(1, {duration: 300});
            } else {
              startTimer();
              size.value = withRepeat(
                withTiming(1.5, {duration: 300}),
                -1,
                true,
              );
            }
          }}>
          {recordingStarted && (
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                backgroundColor: 'white',
                elevation: 5,
              }}></View>
          )}
        </AnimatedBtn>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default App;