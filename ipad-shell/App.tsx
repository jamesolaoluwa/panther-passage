import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import Constants from 'expo-constants'

/**
 * Thin full-screen shell. It does not reimplement Panther Passage; it loads the
 * deployed web app inside a WebView so the iPad demo shows the real product.
 *
 * Override the URL without editing code by setting `extra.webUrl` in app.json,
 * e.g. to point at a local preview server during development.
 */
const WEB_URL =
  (Constants.expoConfig?.extra as { webUrl?: string } | undefined)?.webUrl ??
  'https://panther-passage.onrender.com'

const BRAND = '#10281f'

export default function App() {
  const webRef = useRef<WebView>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  const reload = () => {
    setFailed(false)
    setLoading(true)
    webRef.current?.reload()
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe}>
        {failed ? (
          <View style={styles.center}>
            <Text style={styles.title}>Couldn’t reach Panther Passage</Text>
            <Text style={styles.body}>Check the connection, then try again.</Text>
            <TouchableOpacity style={styles.button} onPress={reload} accessibilityRole="button">
              <Text style={styles.buttonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            ref={webRef}
            source={{ uri: WEB_URL }}
            originWhitelist={['*']}
            contentMode="mobile"
            allowsBackForwardNavigationGestures
            bounces={false}
            overScrollMode="never"
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
            decelerationRate="normal"
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false)
              setFailed(true)
            }}
            style={styles.web}
          />
        )}
        {loading && !failed ? (
          <View style={styles.loader} pointerEvents="none">
            <ActivityIndicator size="large" color={BRAND} />
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f6f1e5' },
  safe: { flex: 1, backgroundColor: '#f6f1e5' },
  web: { flex: 1, backgroundColor: '#f6f1e5' },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  title: { fontSize: 22, fontWeight: '700', color: BRAND, textAlign: 'center' },
  body: { marginTop: 8, fontSize: 15, color: '#49514c', textAlign: 'center' },
  button: {
    marginTop: 20,
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: BRAND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: '#f6f1e5', fontSize: 16, fontWeight: '700' },
})
