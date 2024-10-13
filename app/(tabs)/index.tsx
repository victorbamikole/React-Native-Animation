import { Image, StyleSheet, Platform, View } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { useEffect } from "react";
import {
  Gesture,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

const SIZE = 100.0;
const CIRCLE_RADIUS = SIZE * 2;

const handleRotation = (progress: Animated.SharedValue<number>) => {
  "worklet";
  return `${progress.value * 2 * Math.PI}rad`;
};

type ContextType = {
  translateX: number;
  translateY: number;
};
export default function HomeScreen() {
  const progress = useSharedValue(1);
  const scale = useSharedValue(2);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const reanaimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
      borderRadius: 20, //(progress.value * SIZE) / 2
      transform: [{ scale: scale.value }, { rotate: handleRotation(progress) }],
    };
  }, []);

  // useEffect(() => {
  //   progress.value = withRepeat(withSpring(0.5), -1, true);
  //   scale.value = withRepeat(withSpring(1), -1, true);
  // }, []);

  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (event, context) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
      translateY.value = event.translationY + context.translateY;
    },
    onEnd: () => {
      const distance = Math.sqrt(translateX.value ** 2 + translateY.value ** 2);
      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });

  const tapGesture = Gesture.Tap().onStart(() => {
    console.log("Tap!");
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Animated.View
            style={[
              {
                height: SIZE,
                width: 100,
                backgroundColor: "blue",
                borderRadius: 20,
              },
              rStyle,
            ]}
          />
        </PanGestureHandler>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: CIRCLE_RADIUS,
    borderWidth: 5,
    borderColor: "blue",
  },
});
