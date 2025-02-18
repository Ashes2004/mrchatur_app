import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";

const Browser = () => {
  const [canGoBack, setCanGoBack] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const webViewRef = useRef(null);

  // Check Internet Connection
  useEffect(() => {
    const checkConnection = async () => {
      const netInfo = await NetInfo.fetch();
      setIsConnected(netInfo.isConnected);
    };

    checkConnection();

    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Handle Back Button
  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  // No Internet Screen
  if (!isConnected) {
    return (
      <View style={styles.noInternetContainer}>
        <Ionicons name="wifi-off" size={50} color="#ff3b30" />
        <Text style={styles.noInternetText}>No Internet Connection</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ uri: "https://mrchatur.com/" }}
        style={{ flex: 1 }}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        onLoadStart={() => {
          console.log("Loading started");
          setIsLoading(true);
        }}
        onLoadEnd={() => {
          console.log("Loading ended");
          setIsLoading(false);
        }}
       
        startInLoadingState={true}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  noInternetContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8FA",
  },
  noInternetText: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF3B30",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)", // Light overlay to indicate loading
    zIndex: 1,
  },
});

export default Browser;
