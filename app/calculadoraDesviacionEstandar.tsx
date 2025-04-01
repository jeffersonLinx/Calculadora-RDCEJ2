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

export default function CalculadoraDesviacionEstandar(): JSX.Element {
  const [data, setData] = useState(''); // Lista de números como string (e.g., "1, 2, 3, 4")
  const [standardDeviation, setStandardDeviation] = useState<number | null>(null);

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
    setStandardDeviation(null);
  };

  // Función para calcular la desviación estándar muestral
  const calculateStandardDeviation = () => {
    const numbers = data
      .split(/[, ]+/)
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));

    if (numbers.length < 2) {
      setStandardDeviation(null);
      return;
    }

    const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
    const sumSquaredDiff = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0);
    const variance = sumSquaredDiff / (numbers.length - 1);
    const stdDev = Math.sqrt(variance);

    setStandardDeviation(stdDev);
  };

  // Función para obtener los componentes de la fórmula dinámicamente
  const getFormulaComponents = () => {
    const numbers = data
      .split(/[, ]+/)
      .map((num) => parseFloat(num.trim()))
      .filter((num) => !isNaN(num));

    if (numbers.length === 0) {
      return { sumSquaredDiff: '∑ (xᵢ - x̄)²', nMinus1: 'n - 1' };
    }

    const mean = numbers.reduce((acc, val) => acc + val, 0) / numbers.length;
    const sumSquaredDiff = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0).toFixed(2);
    const nMinus1 = numbers.length - 1;

    return { sumSquaredDiff, nMinus1 };
  };

  const { sumSquaredDiff, nMinus1 } = getFormulaComponents();

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
              else if (btn === '=') calculateStandardDeviation();
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
        <Text style={estilos.title}>Calculadora de Desviación Estándar</Text>
      </View>
      <View style={estilos.content}>
        <View style={estilos.formulaContainer}>
          <View style={estilos.formulaWrapper}>
            <Text style={estilos.formula}>s = </Text>
            <View style={estilos.fraction}>
              <Text style={estilos.numerator}>{sumSquaredDiff}</Text>
              <View style={estilos.divider} />
              <Text style={estilos.denominator}>{nMinus1}</Text>
            </View>
          </View>
          <Text style={estilos.formulaSqrt}>√</Text>
        </View>
        <Text style={estilos.subtitle}>
          Donde: s = desviación estándar, xᵢ = cada valor, x̄ = media, n = número de valores
        </Text>

        <View style={estilos.textboxContainer}>
          <Text style={estilos.textboxLabel}>Datos:</Text>
          <Text style={estilos.textboxInput}>
            {data || 'Ingrese valores (e.g., 1, 2, 3, 4)'}
          </Text>
        </View>

        {renderCalculatorButtons()}

        {standardDeviation !== null && (
          <Text style={estilos.result}>Desviación estándar: {standardDeviation.toFixed(2)}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  formulaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formula: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff', // Texto blanco
  },
  fraction: {
    alignItems: 'center',
  },
  numerator: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  denominator: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#fff',
    marginVertical: 3,
  },
  formulaSqrt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: -10,
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