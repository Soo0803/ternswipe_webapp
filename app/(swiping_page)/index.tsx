import React, { useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import WebCardSwiper, { WebCardSwiperRef } from '../../components/WebCardSwiper';
import { isWeb } from '../../utils/platform';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const CARD_W = width - 32;
const CARD_H = height * 0.68;

type CardT = {
  id: string;
  images: number[]; // require() returns a number
  title?: string;
  subtitle?: string;
};

const CARDS: CardT[] = [
  {
    id: '1',
    images: [
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean4.jpg'),
      require('../../swipingpageimage/ocean6.jpeg'),
    ],
    title: 'Office Park',
  },
  {
    id: '2',
    images: [
      require('../../swipingpageimage/ocean2.jpg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '3',
    images: [
      require('../../swipingpageimage/ocean3.jpg'),
      require('../../swipingpageimage/ocean6.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Atrium',
  },
  {
    id: '4',
    images: [
      require('../../swipingpageimage/ocean4.jpg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '5',
    images: [
      require('../../swipingpageimage/ocean5.avif'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '6',
    images: [
      require('../../swipingpageimage/ocean6.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '7',
    images: [
      require('../../swipingpageimage/ocean7.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '8',
    images: [
      require('../../swipingpageimage/ocean8.jpg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '9',
    images: [
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '10',
    images: [
      require('../../swipingpageimage/ocean3.jpg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '10',
    images: [
      require('../../swipingpageimage/ocean3.jpg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '6',
    images: [
      require('../../swipingpageimage/ocean6.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '7',
    images: [
      require('../../swipingpageimage/ocean7.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '8',
    images: [
      require('../../swipingpageimage/ocean8.jpg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '9',
    images: [
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '10',
    images: [
      require('../../swipingpageimage/ocean3.jpg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
  {
    id: '10',
    images: [
      require('../../swipingpageimage/ocean3.jpg'),
      require('../../swipingpageimage/ocean1.jpeg'),
      require('../../swipingpageimage/ocean1.jpeg'),
    ],
    title: 'Glass Tower',
  },
];

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

export default function Discover() {
  const mobileSwiperRef = useRef<Swiper<CardT>>(null);
  const webSwiperRef = useRef<WebCardSwiperRef>(null);

  const handleSwipeLeft = (index: number) => {
    console.log('Nope:', CARDS[index].id);
  };

  const handleSwipeRight = (index: number) => {
    console.log('Liked:', CARDS[index].id);
  };

  const swipeLeft = () => {
    if (isWeb) {
      webSwiperRef.current?.swipeLeft();
    } else {
      mobileSwiperRef.current?.swipeLeft();
    }
  };

  const swipeRight = () => {
    if (isWeb) {
      webSwiperRef.current?.swipeRight();
    } else {
      mobileSwiperRef.current?.swipeRight();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="paper-plane-outline" size={26} />
        <TouchableOpacity onPress={() => console.log('Open filters')}>
          <Ionicons name="options-outline" size={26} />
        </TouchableOpacity>
      </View>

      {isWeb ? (
        <WebCardSwiper
          ref={webSwiperRef}
          cards={CARDS}
          renderCard={(card: CardT) => (card ? <Card data={card} /> : <View />)}
          keyExtractor={(c: CardT) => c.id}
          cardIndex={0}
          stackSize={2}
          disableTopSwipe
          disableBottomSwipe
          verticalSwipe={false}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: { label: styles.nopeLabel, wrapper: styles.nopeWrapper },
            },
            right: {
              title: 'LIKE',
              style: { label: styles.likeLabel, wrapper: styles.likeWrapper },
            },
          }}
          containerStyle={{ overflow: 'visible' }}
          cardVerticalMargin={12}
        />
      ) : (
        <Swiper
          ref={mobileSwiperRef}
          cards={CARDS}
          renderCard={(card: CardT) => (card ? <Card data={card} /> : <View />)}
          keyExtractor={(c: CardT) => c.id}
          cardIndex={0}
          stackSize={2}
          stackScale={10}
          stackSeparation={14}
          backgroundColor="transparent"
          disableTopSwipe
          disableBottomSwipe
          verticalSwipe={false}
          onSwipedRight={handleSwipeRight}
          onSwipedLeft={handleSwipeLeft}
          overlayLabels={{
            left: {
              title: 'NOPE',
              style: { label: styles.nopeLabel, wrapper: styles.nopeWrapper },
            },
            right: {
              title: 'LIKE',
              style: { label: styles.likeLabel, wrapper: styles.likeWrapper },
            },
          }}
          containerStyle={{ overflow: 'visible' }}
          cardVerticalMargin={12}
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.nopeBtn]}
          onPress={swipeLeft}
        >
          <Ionicons name="close" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.likeBtn]}
          onPress={swipeRight}
        >
          <Ionicons name="heart" size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
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

  actions: {
    position: 'absolute',
    bottom: 18,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  actionBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  nopeBtn: {},
  likeBtn: {},

  nopeWrapper: { position: 'absolute', top: 40, left: 30, transform: [{ rotate: '-20deg' }] },
  likeWrapper: { position: 'absolute', top: 40, right: 30, transform: [{ rotate: '20deg' }] },
  nopeLabel: { borderWidth: 3, borderColor: '#ef4444', color: '#ef4444', fontSize: 24, padding: 6 },
  likeLabel: { borderWidth: 3, borderColor: '#22c55e', color: '#22c55e', fontSize: 24, padding: 6 },
});