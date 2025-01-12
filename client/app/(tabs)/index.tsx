import { StyleSheet } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={{height: 10}} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.headline}>Neue Posts für dich</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgb(255, 255, 255)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  headline: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});
