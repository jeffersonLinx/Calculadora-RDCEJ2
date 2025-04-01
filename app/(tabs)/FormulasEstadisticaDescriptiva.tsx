import { StyleSheet, ScrollView, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';

// Define el tipo de las rutas del drawer
type RootDrawerParamList = {
  tabs: undefined;
  calculadoraFinita: undefined;
  calculadoraInfinita: undefined;
  calculadoraMedia: undefined;
  calculadoraModa: undefined;
  calculadoraDesviacionEstandar: undefined;
  calculadoraMediana: undefined;
  formulasEstadistica: undefined;
};

const { width } = Dimensions.get('window');

export default function FormulasScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  // Lista de fórmulas para iterar
  const formulas = [
    { title: 'Media', formula: 'x̄ = (∑ xᵢ) / n' },
    { title: 'Moda', formula: 'Valor más frecuente' },
    { title: 'Mediana', formula: 'Valor central (ordenado)' },
    { title: 'Desviación Estándar', formula: 's = √[∑ (xᵢ - x̄)² / (n - 1)]' },
    { title: 'Tamaño Muestra Finita', formula: 'n = (N * Z² * p * q) / [E² * (N - 1) + Z² * p * q]' },
    { title: 'Tamaño Muestra Infinita', formula: 'n = (Z² * p * q) / E²' },
  ];

  // Animación para las tarjetas
  const Card = ({ title, formula }: { title: string; formula: string }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.cardTitle}>{title}</Text>
          <View style={styles.formulaWrapper}>
            <Text style={styles.formulaText}>{formula}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2a2a2a']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
            <MaterialCommunityIcons name="menu" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <MaterialCommunityIcons name="math-compass" size={28} color="#4CAF50" style={styles.titleIcon} />
            <Text style={styles.title}>FÓRMULAS ESTADÍSTICAS</Text>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {formulas.map((item, index) => (
            <Card key={index} title={item.title} formula={item.formula} />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 30,
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
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleIcon: {
    marginRight: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
    paddingHorizontal: 5,
  },
  card: {
    width: (width * 0.9 - 30) / 3, // Calcula el ancho para 3 tarjetas por fila con espacio entre ellas
    height: 150, // Altura fija para todas las tarjetas
    backgroundColor: '#2a2a2a',
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    justifyContent: 'space-between', // Distribuye el contenido dentro de la tarjeta
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    textAlign: 'center',
  },
  formulaWrapper: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    flex: 1,
    justifyContent: 'center',
  },
  formulaText: {
    fontSize: 14,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});