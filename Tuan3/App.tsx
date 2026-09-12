import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Header } from './components/Header';
import { CategoryChips } from './components/CategoryChips';
import { BookGrid } from './components/BookGrid';
import { FloatingCartButton } from './components/FloatingCartButton';
import { BOOKS } from './data';

export default function App() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <View style={styles.screen}>
      {/* 1. Header cố định trên cùng */}
      <Header />

      {/* 2. ScrollView chứa Chips + Grid — nhớ paddingBottom đủ lớn để
          FloatingCartButton không che mất sách cuối cùng */}
      <ScrollView contentContainerStyle={styles.content}>
        <CategoryChips />
        
        {/* Khoảng cách nhỏ để tách biệt phần Danh mục và Lưới sách */}
        <View style={{ height: 24 }} />
        
        <BookGrid 
          books={BOOKS} 
          onPressBook={(id) => setCartCount((prev) => prev + 1)} 
        />
      </ScrollView>

      {/* 3. Nút giỏ nổi — NGOÀI ScrollView */}
      <FloatingCartButton 
        count={cartCount} 
        onPress={() => console.log('Bấm mở giỏ hàng')} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 100 },
});