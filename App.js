import { SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';




export default function App() {
  return (
    <View style={styles.container}>
      <SQLiteProvider databaseName="test.db">
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </SQLiteProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
