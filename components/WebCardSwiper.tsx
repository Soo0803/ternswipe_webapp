import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_W = width - 32;
const CARD_H = height * 0.68;
const SWIPE_THRESHOLD = 120;

type CardT = {
  id: string;
  images: number[];
  title?: string;
  subtitle?: string;
};

export type WebCardSwiperRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

type WebCardSwiperProps = {
  cards: CardT[];
  renderCard?: (card: CardT) => React.ReactNode;
  onSwipedLeft?: (index: number) => void;
  onSwipedRight?: (index: number) => void;
  keyExtractor?: (card: CardT) => string;
  cardIndex?: number;
  stackSize?: number;
  disableTopSwipe?: boolean;
  disableBottomSwipe?: boolean;
  verticalSwipe?: boolean;
  overlayLabels?: {
    left?: { title: string; style?: any };
    right?: { title: string; style?: any };
  };
  containerStyle?: any;
  cardVerticalMargin?: number;
};

function Card({ data }: { data: CardT }) {
  return (
    <View style={styles.cardShadow}>
      <View style={styles.card}>
        <ScrollView
          showsVerticalScrollIndicator
          bounces
          contentContainerStyle={{ borderRadius: 24, overflow: 'hidden' }}
        >
          {data.images.map((img: number, index: number) => (
            <Image
              key={index}
              source={img}
              style={styles.photo}
              resizeMode="cover"
            />
          ))}

          {data.title && (
            <View style={styles.info}>
              <Text style={styles.titleText}>{data.title}</Text>
              {data.subtitle && <Text style={styles.subtitleText}>{data.subtitle}</Text>}
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const WebCardSwiperComponent = React.forwardRef<WebCardSwiperRef, WebCardSwiperProps>(({
  cards,
  renderCard,
  onSwipedLeft,
  onSwipedRight,
  keyExtractor = (card) => card.id,
  cardIndex = 0,
  stackSize = 2,
  disableTopSwipe = false,
  disableBottomSwipe = false,
  verticalSwipe = false,
  overlayLabels,
  containerStyle,
  cardVerticalMargin = 12,
}, ref) => {
  const [currentIndex, setCurrentIndex] = useState(cardIndex);
  const [pan] = useState(new Animated.ValueXY());
  const [rotate] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(1));
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!verticalSwipe) {
          pan.setValue({ x: gestureState.dx, y: 0 });
          rotate.setValue(gestureState.dx / 20);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();
        const swipeDistance = gestureState.dx;
        const swipeVelocity = gestureState.vx;

        if (Math.abs(swipeDistance) > SWIPE_THRESHOLD || Math.abs(swipeVelocity) > 0.5) {
          const direction = swipeDistance > 0 ? 1 : -1;
          
          Animated.parallel([
            Animated.timing(pan, {
              toValue: { x: direction * width * 1.5, y: 0 },
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: false,
            }),
          ]).start(() => {
            if (direction > 0 && onSwipedRight) {
              onSwipedRight(currentIndex);
            } else if (direction < 0 && onSwipedLeft) {
              onSwipedLeft(currentIndex);
            }
            
            setCurrentIndex((prev) => {
              const nextIndex = prev + 1;
              if (nextIndex >= cards.length) {
                return prev;
              }
              return nextIndex;
            });
            
            pan.setValue({ x: 0, y: 0 });
            rotate.setValue(0);
            opacity.setValue(1);
          });
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
          Animated.spring(rotate, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const rotateCard = rotate.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ['-10deg', '0deg', '10deg'],
  });

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
  });

  const nopeOpacity = pan.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0],
    outputRange: [1, 0],
  });

  const swipeLeft = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: -width * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (onSwipedLeft) {
        onSwipedLeft(currentIndex);
      }
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= cards.length) {
          return prev;
        }
        return nextIndex;
      });
      pan.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
    });
  }, [currentIndex, cards.length, onSwipedLeft, pan, opacity]);

  const swipeRight = React.useCallback(() => {
    Animated.parallel([
      Animated.timing(pan, {
        toValue: { x: width * 1.5, y: 0 },
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (onSwipedRight) {
        onSwipedRight(currentIndex);
      }
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= cards.length) {
          return prev;
        }
        return nextIndex;
      });
      pan.setValue({ x: 0, y: 0 });
      opacity.setValue(1);
    });
  }, [currentIndex, cards.length, onSwipedRight, pan, opacity]);

  React.useImperativeHandle(ref, () => ({
    swipeLeft,
    swipeRight,
  }));

  if (currentIndex >= cards.length) {
    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.emptyText}>No more cards</Text>
      </View>
    );
  }

  const currentCard = cards[currentIndex];
  const nextCard = currentIndex + 1 < cards.length ? cards[currentIndex + 1] : null;

  return (
    <View style={[styles.container, containerStyle]}>
      {nextCard && (
        <View style={[styles.cardContainer, styles.nextCard]}>
          {renderCard ? renderCard(nextCard) : <Card data={nextCard} />}
        </View>
      )}
      
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.cardContainer,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { rotate: rotateCard },
            ],
            opacity: opacity,
          },
        ]}
      >
        {overlayLabels?.left && (
          <Animated.View
            style={[
              styles.overlay,
              styles.leftOverlay,
              overlayLabels.left.style?.wrapper,
              { opacity: nopeOpacity },
            ]}
          >
            <Text style={[styles.overlayText, overlayLabels.left.style?.label]}>
              {overlayLabels.left.title}
            </Text>
          </Animated.View>
        )}
        
        {overlayLabels?.right && (
          <Animated.View
            style={[
              styles.overlay,
              styles.rightOverlay,
              overlayLabels.right.style?.wrapper,
              { opacity: likeOpacity },
            ]}
          >
            <Text style={[styles.overlayText, overlayLabels.right.style?.label]}>
              {overlayLabels.right.title}
            </Text>
          </Animated.View>
        )}
        
        {renderCard ? renderCard(currentCard) : <Card data={currentCard} />}
      </Animated.View>
    </View>
  );
});

WebCardSwiperComponent.displayName = 'WebCardSwiper';

export default WebCardSwiperComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardContainer: {
    width: CARD_W,
    height: CARD_H,
    position: 'absolute',
  },
  nextCard: {
    transform: [{ scale: 0.95 }],
    zIndex: 0,
    opacity: 0.8,
  },
  cardShadow: {
    width: CARD_W,
    height: CARD_H,
    alignSelf: 'center',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    backgroundColor: 'transparent',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: CARD_H * 0.9,
  },
  info: {
    padding: 14,
    backgroundColor: '#fff',
  },
  titleText: { fontSize: 18, fontWeight: '700' },
  subtitleText: { marginTop: 4, color: '#666' },
  overlay: {
    position: 'absolute',
    top: 40,
    zIndex: 10,
    padding: 10,
    borderRadius: 5,
  },
  leftOverlay: {
    left: 30,
    transform: [{ rotate: '-20deg' }],
  },
  rightOverlay: {
    right: 30,
    transform: [{ rotate: '20deg' }],
  },
  overlayText: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 6,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});

