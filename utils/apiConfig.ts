import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { isWeb } from './platform';

/**
 * Get the base API URL based on environment
 * Priority:
 * 1. EXPO_PUBLIC_API_URL environment variable
 * 2. Constants.extra.apiUrl from app.json
 * 3. Default based on platform
 */
export function getApiBaseUrl(): string {
  // Check environment variable first
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Check app.json extra config
  const fromConstants = (Constants?.expoConfig as any)?.extra?.apiUrl as string | undefined;
  if (fromConstants) {
    return fromConstants;
  }

  // Default based on platform
  if (isWeb) {
    // On web, try to use the same host but different port
    // This allows web app to connect to backend on same machine
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      // If running on localhost, use localhost:8000
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000';
      }
      // Otherwise, try to use the same hostname with port 8000
      return `http://${hostname}:8000`;
    }
    return 'http://localhost:8000';
  }

  // For mobile (iOS/Android)
  // Use localhost for emulator/simulator
  // For physical devices, you'll need to use your computer's IP address
  if (Platform.OS === 'ios') {
    // iOS Simulator can use localhost
    return 'http://localhost:8000';
  } else {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:8000';
  }
}

/**
 * Check if backend is reachable
 */
export async function checkBackendConnection(): Promise<boolean> {
  try {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/user/login/`, {
      method: 'OPTIONS', // Use OPTIONS to check connection without side effects
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.status !== 0; // If status is 0, connection failed
  } catch (error) {
    return false;
  }
}

/**
 * Get full API URL for an endpoint
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
}

