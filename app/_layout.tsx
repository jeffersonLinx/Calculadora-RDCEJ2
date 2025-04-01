import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#333',
            width: 250,
          },
          drawerActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          drawerInactiveTintColor: '#fff',
          drawerLabelStyle: {
            marginLeft: 20,
            fontSize: 16,
          },
          headerShown: false,
        }}>
        <Drawer.Screen
          name="tabs"
          options={{
            drawerLabel: 'Inicio',
            title: 'Calculadora Estadística',
            drawerItemStyle: { display: 'none' },
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="calculadoraFinita"
          options={{
            drawerLabel: 'Población Finita',
            title: 'Calculadora Población Finita',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="account-group" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="calculadoraInfinita"
          options={{
            drawerLabel: 'Población Infinita',
            title: 'Calculadora Población Infinita',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="infinity" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="calculadoraMedia"
          options={{
            drawerLabel: 'Media',
            title: 'Calculadora de Media',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="calculator" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="calculadoraModa"
          options={{
            drawerLabel: 'Moda',
            title: 'Calculadora de Moda',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="chart-bar" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="calculadoraDesviacionEstandar"
          options={{
            drawerLabel: 'Desviación Estándar',
            title: 'Calculadora de Desviación Estándar',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="chart-line-variant" size={24} color={color} />
            ),
          }}
        />
        <Drawer.Screen
          name="calculadoraMediana"
          options={{
            drawerLabel: 'Mediana',
            title: 'Calculadora de Mediana',
            drawerIcon: ({ color }) => (
              <MaterialCommunityIcons name="sort-numeric-ascending" size={24} color={color} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}