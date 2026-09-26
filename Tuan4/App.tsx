import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import các màn hình và component
import { TabBar, TabKey } from './components/TabBar';
import { HomeScreen } from './screens/HomeScreen';
import { CartScreen } from './screens/CartScreen';
import { BookDetailScreen } from './screens/BookDetailScreen'; // <-- Nhớ import màn hình này

import { BOOKS, CART_ITEMS } from './data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  // Thêm state để nhớ xem người dùng đang bấm vào cuốn sách nào
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null); 

  const selectedBook = BOOKS.find((b) => b.id === selectedBookId) ?? null;

  const renderScreen = () => {
    // ƯU TIÊN 1: Nếu có cuốn sách đang được chọn, hiển thị màn hình Chi tiết sách
    if (selectedBookId !== null && selectedBook) {
      return (
        <BookDetailScreen
          book={selectedBook}
          onBack={() => setSelectedBookId(null)} // Bấm quay lại -> xóa state ID sách
          onAddToCart={() => console.log('Bấm thêm vào giỏ hàng')}
        />
      );
    }

    // ƯU TIÊN 2: Nếu không xem sách, hiển thị các Tab bình thường
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen 
            cartCount={CART_ITEMS.length} 
            onPressBook={(id) => setSelectedBookId(id)} // <-- Gắn ID sách vào state khi bấm
            onPressCart={() => setActiveTab('cart')}
          />
        );
      case 'cart':
        return <CartScreen items={CART_ITEMS} />;
      case 'category':
      case 'account':
        return (
          <View style={styles.placeholder}>
            <Text>Màn hình {activeTab} đang phát triển...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.body}>
        {renderScreen()}
        
        {/* Chỉ hiện TabBar khi KHÔNG ở trong màn hình chi tiết sách */}
        {!selectedBookId && <TabBar active={activeTab} onChange={setActiveTab} />}
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  body: { flex: 1 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});