// messages.tsx
import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ListRenderItem,
  StatusBar,
} from 'react-native';

type MessageRow = {
  id: string;
  name: string;
  lastMessage: string;
  avatar: string;        // uri or require('...')
  isCompany?: boolean;
  unread?: boolean;
};

const DATA: MessageRow[] = [
  {
    id: '1',
    name: 'Steve Jobless',
    lastMessage: "What's up homie",
    avatar: 'https://i.pravatar.cc/100?img=1',
    isCompany: true,
    unread: true,
  },
  {
    id: '2',
    name: 'John Un',
    lastMessage: 'Hey bro!',
    avatar: 'https://i.pravatar.cc/100?img=2',
    isCompany: true,
    unread: true,
  },
  {
    id: '3',
    name: 'Alex Madhal',
    lastMessage: 'u want a help for c++ proj?',
    avatar: 'https://i.pravatar.cc/100?img=3',
    unread: true,
  },
  {
    id: '4',
    name: 'Waka Waka',
    lastMessage: 'my broooo',
    avatar: 'https://i.pravatar.cc/100?img=4',
    isCompany: true,
    unread: true,
  },
  {
    id: '5',
    name: 'Magnum Elizabeth',
    lastMessage: 'sheeesssh',
    avatar: 'https://i.pravatar.cc/100?img=5',
    unread: true,
  },
];

const Pill = () => (
  <View style={styles.pill}>
    <Text style={styles.pillText}>COMPANY</Text>
  </View>
);

const UnreadDot = () => <View style={styles.unreadDot} />;

const MessageItem = memo(({ item, onPress }: { item: MessageRow; onPress?: () => void }) => {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={styles.rowWrapper}>
      <View style={styles.row}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.textCol}>
          <View style={styles.nameLine}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name}
            </Text>
            {item.isCompany ? <Pill /> : null}
          </View>
          <Text numberOfLines={1} style={styles.lastMessage}>
            {item.lastMessage}
          </Text>
        </View>
        {item.unread ? <UnreadDot /> : <View style={styles.unreadPlaceholder} />}
      </View>
    </TouchableOpacity>
  );
});

const Messages = () => {
  const renderItem: ListRenderItem<MessageRow> = ({ item }) => (
    <MessageItem
      item={item}
      onPress={() => {
        // navigation.navigate('Chat', { userId: item.id })
        console.log('Open chat with', item.name);
      }}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content"/>
      <Text style={styles.title}>MESSAGES</Text>
      <FlatList
        data={DATA}
        keyExtractor={(it) => it.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 12,
  },
  title: {
    fontSize: 22,
    letterSpacing: 1,
    textAlign: 'center',
    marginVertical: 10,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  rowWrapper: {
    borderRadius: 14,
    // Subtle card feel
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3, // Android
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  textCol: {
    flex: 1,
  },
  nameLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111',
    maxWidth: '70%',
  },
  lastMessage: {
    fontSize: 14,
    color: '#444',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#96AAD0',
    borderRadius: 999,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  unreadDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1877F2',
    marginLeft: 12,
  },
  unreadPlaceholder: {
    width: 12,
    height: 12,
    marginLeft: 12,
  },
});
