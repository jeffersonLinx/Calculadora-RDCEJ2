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

export default function CalculadoraInfinita(): JSX.Element {
  const [marginError, setMarginError] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('1.965'); // Valor predeterminado 95% (Z=1.965)
  const [sampleSize, setSampleSize] = useState<number | null>(null);
  const [pickerVisibleConfidence, setPickerVisibleConfidence] = useState(false);

  // Hook de navegación para el drawer
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  // Opciones para el picker de nivel de confianza
  const confidenceLevelOptions = [
    { label: '90% (Z=1.645)', value: '1.645' },
    { label: '95% (Z=1.965)', value: '1.965' },
    { label: '99% (Z=2.576)', value: '2.576' },
  ];

  // Función para agregar un número o porcentaje al valor de marginError
  const appendNumber = (num: string) => {
    setMarginError((prev) => prev + num);
  };

  // Función para limpiar el valor de marginError
  const clearMarginError = () => {
    setMarginError('');
    setSampleSize(null);
  };

  // Función para calcular el tamaño de la muestra infinita
  const calculateSampleSize = () => {
    const e = parseFloat(marginError) / 100; // Convertir porcentaje a decimal
    const z = parseFloat(confidenceLevel);
    const p = 0.5; // Proporción estándar (50%) para maximizar la varianza

    if (isNaN(e) || isNaN(z) || e <= 0 || z <= 0) {
      setSampleSize(null);
      return;
    }

    const size = (Math.pow(z, 2) * p * (1 - p)) / Math.pow(e, 2);
    setSampleSize(Math.ceil(size));
  };

  // Botones de la calculadora
  const renderCalculatorButtons = () => {
    const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '%', 'C', '='];

    return (
      <View style={estilos.calculatorContainer}>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn}
            style={[
              estilos.calculatorButton,
              btn === '=' && estilos.calculateButton,
              btn === 'C' && estilos.clearButton,
              btn === '%' && estilos.percentButton,
            ]}
            onPress={() => {
              if (btn === 'C') clearMarginError();
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

  // Renderizado del picker de nivel de confianza
  const renderConfidencePicker = () => {
    return (
      <View style={estilos.pickerContainer}>
        <Text style={estilos.pickerLabel}>Nivel de confianza:</Text>
        {Platform.OS === 'web' ? (
          // Picker directo para web
          <View style={estilos.pickerWrapperWeb}>
            <Picker
              selectedValue={confidenceLevel}
              style={estilos.pickerWeb}
              onValueChange={(itemValue) => setConfidenceLevel(itemValue)}
              itemStyle={estilos.pickerItem}
            >
              {confidenceLevelOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>
        ) : (
          // Modal para móviles
          <>
            <TouchableOpacity
              style={estilos.pickerButton}
              onPress={() => setPickerVisibleConfidence(true)}
            >
              <Text style={estilos.pickerButtonText}>
                {confidenceLevel === '1.645'
                  ? '90%'
                  : confidenceLevel === '1.965'
                  ? '95%'
                  : '99%'}
              </Text>
            </TouchableOpacity>
            <Modal
              transparent={true}
              visible={pickerVisibleConfidence}
              animationType="fade"
              onRequestClose={() => setPickerVisibleConfidence(false)}
            >
              <TouchableOpacity
                style={estilos.modalOverlay}
                activeOpacity={1}
                onPress={() => setPickerVisibleConfidence(false)}
              >
                <View style={estilos.pickerModal}>
                  <Picker
                    selectedValue={confidenceLevel}
                    style={estilos.picker}
                    onValueChange={(itemValue) => {
                      setConfidenceLevel(itemValue);
                      setPickerVisibleConfidence(false);
                    }}
                    itemStyle={estilos.pickerItem}
                  >
                    {confidenceLevelOptions.map((option) => (
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
        <Text style={estilos.title}>Calculadora de Tamaño de Muestra Infinita</Text>
      </View>
      <View style={estilos.content}>
        <View style={estilos.formulaContainer}>
          <View style={estilos.formulaWrapper}>
            <Text style={estilos.formula}>n = </Text>
            <View style={estilos.fraction}>
              <Text style={estilos.numerator}>
                {confidenceLevel || 'Z'}² × 0.5 × (1 - 0.5)
              </Text>
              <View style={estilos.divider} />
              <Text style={estilos.denominator}>
                {marginError ? `${marginError}` : 'E'}²
              </Text>
            </View>
          </View>
        </View>

        <View style={estilos.textboxContainer}>
          <Text style={estilos.textboxLabel}>Margen de error:</Text>
          <Text style={estilos.textboxInput}>
            {marginError ? `${marginError}` : 'Ingrese valor (e.g., 5)'}
          </Text>
        </View>

        {renderConfidencePicker()}

        {renderCalculatorButtons()}

        {sampleSize !== null && (
          <Text style={estilos.result}>Tamaño de la muestra: {sampleSize} personas</Text>
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
    backgroundColor: '#1a1a1a', // Fondo oscuro para coincidir con CalculadoraFinita
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    color: '#fff', // Texto blanco en el picker
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
  percentButton: {
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