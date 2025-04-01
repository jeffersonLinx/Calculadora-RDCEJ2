import { Image, StyleSheet, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';

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

export default function HomeScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const openDrawer = () => {
    navigation.openDrawer();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={openDrawer}>
          <MaterialCommunityIcons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>CALCULADORA PARA ESTADISTICA DESCRIPTIVA</Text>
      </View>
      <Image source={require('@/assets/images/tercera.png')} style={styles.image} />
      <View style={styles.iconContainer}>
        <FontAwesome5 name="calculator" size={40} color="blue" />
        <FontAwesome5 name="chart-bar" size={40} color="green" />
        <FontAwesome5 name="percentage" size={40} color="orange" />
        <FontAwesome5 name="square-root-alt" size={40} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#1a1a1a', // Fondo oscuro para coincidir con la imagen
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
    textAlign: 'center',
    color: 'white',
    flex: 1,
  },
  image: {
    width: 850,
    height: 450,
    resizeMode: 'contain',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
});