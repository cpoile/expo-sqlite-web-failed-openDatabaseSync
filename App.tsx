import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View} from 'react-native';
import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";

export default function App() {
    return (
        <>
            <SQLiteProvider databaseName="test.db">
                <View style={styles.container}>
                    <Text>Open up App.tsx to start working on your app!</Text>
                    <Main/>
                    <StatusBar style="auto"/>
                </View>
            </SQLiteProvider>
        </>
    );
}


export function Main() {
    const db = useSQLiteContext();
    console.log('sqlite version', db.getFirstSync('SELECT sqlite_version()'));
    return <View/>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
