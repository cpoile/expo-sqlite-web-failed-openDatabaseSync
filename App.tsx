import {useState, useEffect} from 'react';
import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, Button} from 'react-native';
import {SQLiteProvider, useSQLiteContext} from 'expo-sqlite';

export default function App() {
    const [mode, setMode] = useState<'async' | 'sync'>('async');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>expo-sqlite Web Demo</Text>

            <View style={styles.buttonContainer}>
                <View style={{marginRight: 10}}>
                    <Button
                        title="Async (Works)"
                        onPress={() => setMode('async')}
                        color={mode === 'async' ? '#007AFF' : '#999'}
                    />
                </View>
                <Button
                    title="Sync (Breaks)"
                    onPress={() => setMode('sync')}
                    color={mode === 'sync' ? '#007AFF' : '#999'}
                />
            </View>

            {mode === 'async' ? <AsyncDemo /> : <SyncDemo />}

            <StatusBar style="auto"/>
        </View>
    );
}

// Async version - Works without SharedArrayBuffer
function AsyncDemo() {
    return (
        <SQLiteProvider databaseName="test-async.db">
            <View style={styles.demoContainer}>
                <Text style={styles.subtitle}>✅ Async API (Working)</Text>
                <Text style={styles.description}>
                    Uses SQLiteProvider + getFirstAsync{'\n'}
                    No SharedArrayBuffer required{'\n'}
                    Works with React Strict Mode
                </Text>
                <AsyncMain/>
            </View>
        </SQLiteProvider>
    );
}

function AsyncMain() {
    const db = useSQLiteContext();
    const [version, setVersion] = useState('Loading...');

    useEffect(() => {
        db.getFirstAsync<{ 'sqlite_version()': string }>('SELECT sqlite_version()')
            .then((result) => {
                console.log('Async sqlite version:', result);
                setVersion(result?.['sqlite_version()'] || 'unknown');
            })
            .catch((error) => {
                console.error('Async error:', error);
                setVersion(`Error: ${error.message}`);
            });
    }, [db]);

    return <Text style={styles.result}>SQLite Version: {version}</Text>;
}

// Sync version - Requires SharedArrayBuffer (will error without COEP/COOP headers)
function SyncDemo() {
    return (
        <SQLiteProvider databaseName="test-sync.db">
            <View style={styles.demoContainer}>
                <Text style={styles.subtitle}>❌ Sync API (Broken -- unless you use the proxy)</Text>
                <Text style={styles.description}>
                    Uses SQLiteProvider + getFirstSync{'\n'}
                    Requires SharedArrayBuffer + COEP/COOP headers
                </Text>
                <SyncMain/>
            </View>
        </SQLiteProvider>
    );
}

function SyncMain() {
    const db = useSQLiteContext();
    const [version, setVersion] = useState('Attempting sync query...');

    useEffect(() => {
        try {
            const result = db.getFirstSync<{ 'sqlite_version()': string }>('SELECT sqlite_version()');
            console.log('Sync sqlite version:', result);
            setVersion(result?.['sqlite_version()'] || 'unknown');
        } catch (error: any) {
            console.error('Sync error:', error);
            setVersion(`Error: ${error.message}`);
        }
    }, [db]);

    return <Text style={styles.result}>SQLite Version: {version}</Text>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginBottom: 30,
    },
    demoContainer: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxWidth: 500,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        lineHeight: 20,
    },
    result: {
        fontSize: 16,
        fontWeight: '500',
        color: '#007AFF',
    },
});
