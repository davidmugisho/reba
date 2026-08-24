import { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';

/**
 * Fades its child in and lets it settle upward a little.
 *
 * Built on React Native's own Animated rather than a library: it is one
 * dependency fewer on a project that has to open inside Expo Go, and a
 * screening app does not need a physics engine to introduce a photograph.
 *
 * Everything is driven on the native thread, so the animation does not stutter
 * while the acuity test or the reflex reading is doing real work.
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 520,
  offset = 12,
  style,
}: {
  children: React.ReactNode;
  /** Stagger several of these to let a screen arrive in order. */
  delay?: number;
  duration?: number;
  /** How far it drifts up as it appears. */
  offset?: number;
  style?: ViewStyle;
}) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      // Decelerating: quick to appear, unhurried to settle.
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress, delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] }) },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
