/**
 * Layout de tabs para navegación inferior con soporte para temas y badges
 */

import React from 'react';
import { Redirect, Tabs } from 'expo-router';
import { View, Text, StyleSheet, ColorValue } from 'react-native';
import { useSelector } from 'react-redux';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import type { RootState } from '../../store/store';
import { isTeacherRole } from '../../utils/permissions';

export default function TabLayout() {
  const { studentCount } = useCart();
  const { colors } = useTheme();
  const { token, user } = useSelector((state: RootState) => state.auth);
  const canManageStudents = isTeacherRole(user);

  if (!token || !user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: canManageStudents ? undefined : null,
          title: 'Inicio',
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="students"
        options={{
          href: canManageStudents ? undefined : null,
          title: 'Estudiantes',
          tabBarLabel: 'Estudiantes',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="people" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ajustes',
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="settings" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          href: canManageStudents ? undefined : null,
          title: 'Carrito',
          tabBarLabel: 'Carrito',
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="cart" color={color} size={size} />
          ),
          tabBarBadge: studentCount > 0 ? studentCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: 10,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
          },
        }}
      />
    </Tabs>
  );
}

interface TabIconProps {
  name: 'home' | 'people' | 'person' | 'settings' | 'cart';
  color: ColorValue;
  size: number;
}

function TabIcon({ name, color, size }: TabIconProps) {
  const icons = {
    home: '🏠',
    people: '👨‍🎓',
    person: '👤',
    settings: '⚙️',
    cart: '🛒',
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={{ color, fontSize: size || 20 }}>
        {icons[name]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});