import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Modal, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const { width, height } = Dimensions.get('window');

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

export default function CalculadoraFinita(): JSX.Element {
  const [population, setPopulation] = useState('');
  const [marginError, setMarginError] = useState('5');
  const [confidenceLevel, setConfidenceLevel] = useState('1.965');
  const [sampleSize, setSampleSize] = useState<number | null>(null);
  const [pickerVisibleMargin, setPickerVisibleMargin] = useState(false);
  const [pickerVisibleConfidence, setPickerVisibleConfidence] = useState(false);

  // Hook de navegación para el drawer
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  // Función para agregar un número al valor de population
  const appendNumber = (num: string) => {
    setPopulation((prev) => prev + num);
  };

  // Función para limpiar el valor de population
  const clearPopulation = () => {
    setPopulation('');
    setSampleSize(null);
  };

  // Función para calcular el tamaño de la muestra
  const calculateSampleSize = () => {
    const N = parseFloat(population);
    const e = parseFloat(marginError) / 100;
    const z = parseFloat(confidenceLevel);

    if (isNaN(N) || isNaN(e) || isNaN(z) || N <= 0 || e <= 0 || z <= 0) {
      setSampleSize(null);
      return;
    }

    const numerator = N * Math.pow(z, 2) * 0.25;
    const denominator = Math.pow(e, 2) * (N - 1) + Math.pow(z, 2) * 0.25;
    const size = numerator / denominator;

    setSampleSize(Math.ceil(size));
  };

  // Botones de la calculadora
  const renderCalculatorButtons = () => {
    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'C', '='];

    return (
      <View style={estilos.calculatorContainer}>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn}
            style={[
              estilos.calculatorButton,
              btn === '=' && estilos.calculateButton,
              btn === 'C' && estilos.clearButton,
            ]}
            onPress={() => {
              if (btn === 'C') clearPopulation();
              else if (btn === '=') calculateSampleSize();
              else appendNumber(btn);
            }}
          >
            <Text style={estilos.calculatorButtonText}>{btn}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Renderizado de los pickers
  const renderPicker = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    visible: boolean,
    setVisible: (val: boolean) => void,
    options: { label: string; value: string }[]
  ) => {
    return (
      <View style={estilos.pickerContainer}>
        <Text style={estilos.pickerLabel}>{label}</Text>
        {Platform.OS === 'web' ? (
          // Picker directo para web
          <View style={estilos.pickerWrapperWeb}>
            <Picker
              selectedValue={value}
              style={estilos.pickerWeb}
              onValueChange={(itemValue) => setValue(itemValue)}
              itemStyle={estilos.pickerItem}
            >
              {options.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        ) : (
          // Modal para móviles
          <>
            <TouchableOpacity style={estilos.pickerButton} onPress={() => setVisible(true)}>
              <Text style={estilos.pickerButtonText}>
                {label.includes('Margen')
                  ? `${value}%`
                  : value === '1.645'
                  ? '90%'
                  : value === '1.965'
                  ? '95%'
                  : '99%'}
              </Text>
            </TouchableOpacity>
            <Modal
              transparent={true}
              visible={visible}
              animationType="fade"
              onRequestClose={() => setVisible(false)}
            >
              <TouchableOpacity
                style={estilos.modalOverlay}
                activeOpacity={1}
                onPress={() => setVisible(false)}
              >
                <View style={estilos.pickerModal}>
                  <Picker
                    selectedValue={value}
                    style={estilos.picker}
                    onValueChange={(itemValue) => {
                      setValue(itemValue);
                      setVisible(false);
                    }}
                    itemStyle={estilos.pickerItem}
                  >
                    {options.map((option) => (
                      <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                  </Picker>
                </View>
              </TouchableOpacity>
            </Modal>
          </>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={estilos.container}>
      <View style={estilos.header}>
        <TouchableOpacity style={estilos.menuButton} onPress={openDrawer}>
          <MaterialCommunityIcons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={estilos.title}>Calculadora de Tamaño de Muestra Finita</Text>
      </View>
      <View style={estilos.content}>
        <View style={estilos.formulaContainer}>
          <View style={estilos.formulaWrapper}>
            <Text style={estilos.formula}>n = </Text>
            <View style={estilos.fraction}>
              <Text style={estilos.numerator}>
                {population || 'N'} × {confidenceLevel || 'Z'}² × 0.25
              </Text>
              <View style={estilos.divider} />
              <Text style={estilos.denominator}>
                {marginError ? `${marginError}%` : 'E'}² × ({population || 'N'} - 1) +{' '}
                {confidenceLevel || 'Z'}² × 0.25
              </Text>
            </View>
          </View>
        </View>

        <Text style={estilos.populationDisplay}>Población (N): {population || '0'}</Text>

        {/* Pickers diferenciados por plataforma */}
        {renderPicker(
          'Margen de error',
          marginError,
          setMarginError,
          pickerVisibleMargin,
          setPickerVisibleMargin,
          [
            { label: '1%', value: '1' },
            { label: '3%', value: '3' },
            { label: '5%', value: '5' },
            { label: '7%', value: '7' },
            { label: '10%', value: '10' },
          ]
        )}

        {renderPicker(
          'Nivel de confianza',
          confidenceLevel,
          setConfidenceLevel,
          pickerVisibleConfidence,
          setPickerVisibleConfidence,
          [
            { label: '90% (Z=1.645)', value: '1.645' },
            { label: '95% (Z=1.965)', value: '1.965' },
            { label: '99% (Z=2.576)', value: '2.576' },
          ]
        )}

        {sampleSize !== null && population && marginError && confidenceLevel && (
          <Text style={estilos.result}>Tamaño de la muestra: {sampleSize} personas</Text>
        )}

        {renderCalculatorButtons()}
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
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  content: {
    width: width * 0.8,
    maxWidth: 400,
    padding: 15,
    backgroundColor: '#2a2a2a',
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
  formulaWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formula: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
  populationDisplay: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 15,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 5,
    fontWeight: '600',
  },
  pickerButton: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    paddingHorizontal: 10,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerModal: {
    width: width * 0.7,
    maxWidth: 300,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerWrapperWeb: {
    borderRadius: 8,
    borderColor: '#555',
    borderWidth: 1,
    backgroundColor: '#333',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    width: '100%',
    height: Platform.OS === 'web' ? 40 : 200,
    color: '#fff',
  },
  pickerWeb: {
    width: '100%',
    height: 40,
    backgroundColor: '#333',
    color: '#fff',
  },
  pickerItem: {
    fontSize: 16,
    color: '#fff',
  },
  result: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 15,
    fontWeight: 'bold',
    textAlign: 'center',
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
    backgroundColor: '#e0e0e0', // Restaurado al color original
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
  calculatorButtonText: {
    fontSize: 20,
    color: '#333', // Color del texto ajustado para contraste con el fondo claro
    fontWeight: 'bold',
  },
});