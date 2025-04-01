import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const { width } = Dimensions.get('window');

// Define el tipo de las rutas del drawer
type RootDrawerParamList = {
  tabs: undefined;
  calculadoraFinita: undefined;
  calculadoraInfinita: undefined;
  calculadoraMedia: undefined;
  calculadoraModa: undefined;
  calculadoraDesviacionEstandar: undefined;
  calculadoraMediana: undefined;
};

export default function CalculadoraModa(): JSX.Element {
  const [data, setData] = useState(''); // Lista de números como string (e.g., "1, 2, 2, 3")
  const [mode, setMode] = useState<string | null>(null);

  // Hook de navegación para el drawer
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  // Función para agregar un número, coma o espacio al valor de data
  const appendValue = (value: string) => {
    setData((prev) => prev + value);
  };

  // Función para limpiar el valor de data
  const clearData = () => {
    setData('');
    setMode(null);
  };

  // Función para calcular la moda
  const calculateMode = () => {
    const numbers = data
      .split(/[, ]+/)
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));

    if (numbers.length === 0) {
      setMode(null);
      return;
    }

    const frequencyMap: { [key: number]: number } = {};
    numbers.forEach((num) => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    let maxFrequency = 0;
    for (const freq of Object.values(frequencyMap)) {
      if (freq > maxFrequency) maxFrequency = freq;
    }

    const modes = Object.keys(frequencyMap)
      .filter((key) => frequencyMap[parseFloat(key)] === maxFrequency)
      .map((key) => parseFloat(key));

    if (modes.length === Object.keys(frequencyMap).length && maxFrequency === 1) {
      setMode('No hay moda');
    } else {
      setMode(modes.join(', '));
    }
  };

  // Función para obtener la moda dinámica para la fórmula
  const getDynamicMode = () => {
    const numbers = data
      .split(/[, ]+/)
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));

    if (numbers.length === 0) {
      return 'Valor(es) con mayor frecuencia';
    }

    const frequencyMap: { [key: number]: number } = {};
    numbers.forEach((num) => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    let maxFrequency = 0;
    for (const freq of Object.values(frequencyMap)) {
      if (freq > maxFrequency) maxFrequency = freq;
    }

    const modes = Object.keys(frequencyMap)
      .filter((key) => frequencyMap[parseFloat(key)] === maxFrequency)
      .map((key) => parseFloat(key));

    if (modes.length === Object.keys(frequencyMap).length && maxFrequency === 1) {
      return 'No hay moda aún';
    }

    return modes.join(', ');
  };

  const dynamicMode = getDynamicMode();

  // Botones de la calculadora
  const renderCalculatorButtons = () => {
    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', ',', 'C', '='];

    return (
      <View style={estilos.calculatorContainer}>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn}
            style={[
              estilos.calculatorButton,
              btn === '=' && estilos.calculateButton,
              btn === 'C' && estilos.clearButton,
              btn === ',' && estilos.commaButton,
            ]}
            onPress={() => {
              if (btn === 'C') clearData();
              else if (btn === '=') calculateMode();
              else appendValue(btn);
            }}
          >
            <Text style={estilos.calculatorButtonText}>{btn}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.header}>
        <TouchableOpacity style={estilos.menuButton} onPress={openDrawer}>
          <MaterialCommunityIcons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={estilos.title}>Calculadora de la Moda</Text>
      </View>
      <View style={estilos.content}>
        <View style={estilos.formulaContainer}>
          <Text style={estilos.formula}>Moda = {dynamicMode}</Text>
        </View>
        <Text style={estilos.subtitle}>
          Donde: Moda = el valor o valores que aparecen más veces en los datos
        </Text>

        <View style={estilos.textboxContainer}>
          <Text style={estilos.textboxLabel}>Datos:</Text>
          <Text style={estilos.textboxInput}>
            {data || 'Ingrese valores (e.g., 1, 2, 2, 3)'}
          </Text>
        </View>

        {renderCalculatorButtons()}

        {mode !== null && (
          <Text style={estilos.result}>Moda: {mode}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#1a1a1a', // Fondo oscuro para coincidir con las otras pantallas
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  menuButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco para contraste con el fondo oscuro
    textAlign: 'center',
    flex: 1,
  },
  content: {
    width: width * 0.8,
    maxWidth: 400,
    padding: 15,
    backgroundColor: '#2a2a2a', // Fondo más claro para el contenido
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  formulaContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  formula: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#ccc', // Texto gris claro para el subtítulo
    marginBottom: 15,
    textAlign: 'center',
  },
  textboxContainer: {
    width: '100%',
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#333', // Fondo oscuro para el input
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  textboxLabel: {
    fontSize: 16,
    color: '#ccc', // Texto gris claro para etiquetas
    fontWeight: '600',
    marginRight: 5,
  },
  textboxInput: {
    fontSize: 16,
    color: '#fff', // Texto blanco para el input
    fontWeight: '500',
    flex: 1,
  },
  calculatorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  calculatorButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  calculateButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#F44336',
  },
  commaButton: {
    backgroundColor: '#2196F3',
  },
  calculatorButtonText: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
  },
  result: {
    fontSize: 16,
    color: '#fff', // Texto blanco para el resultado
    marginVertical: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});