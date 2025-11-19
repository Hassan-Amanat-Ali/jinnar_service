import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "../firebase/config";
import { toast } from "react-hot-toast";

// Initialize Firebase Cloud Messaging
let messaging = null;

try {
  messaging = getMessaging(app);
} catch (error) {
  console.error("Error initializing Firebase Messaging:", error);
}

/**
 * Request notification permission and get FCM token
 * @returns {Promise<string|null>} FCM token or null if permission denied
 */
export const requestNotificationPermission = async () => {
  try {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications");
      return null;
    }

    // Check if messaging is initialized
    if (!messaging) {
      console.error("Firebase Messaging is not initialized");
      return null;
    }

    // Check current permission status
    if (Notification.permission === "denied") {
      console.log("Notification permission previously denied");
      return null;
    }

    // Request permission if not already granted
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      
      if (permission !== "granted") {
        console.log("Notification permission not granted");
        return null;
      }
    }

    console.log("Notification permission granted");
    
    // Get FCM token
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    
    if (!vapidKey) {
      console.warn("VAPID key not found. Please add VITE_FIREBASE_VAPID_KEY to your .env file");
      console.warn("You can generate a VAPID key in Firebase Console > Project Settings > Cloud Messaging > Web Push certificates");
      return null;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: vapidKey,
      });

      if (token) {
        console.log("FCM Token obtained successfully");
        return token;
      } else {
        console.log("No registration token available. Make sure:");
        console.log("1. Cloud Messaging API is enabled in Google Cloud Console");
        console.log("2. VAPID key is correct in .env file");
        console.log("3. Service worker is registered correctly");
        return null;
      }
    } catch (tokenError) {
      // Handle specific Firebase errors
      if (tokenError.code === 'messaging/token-subscribe-failed') {
        console.error("FCM Token subscribe failed. This usually means:");
        console.error("1. Firebase Cloud Messaging API is not enabled in Google Cloud Console");
        console.error("2. VAPID key is invalid or expired");
        console.error("3. Firebase project configuration mismatch");
        console.error("\nPlease visit: https://console.cloud.google.com/apis/library/fcm.googleapis.com");
      } else if (tokenError.code === 'messaging/permission-blocked') {
        console.error("Notification permissions are blocked by the user");
      } else {
        console.error("Error getting FCM token:", tokenError);
      }
      return null;
    }
  } catch (error) {
    console.error("Error in requestNotificationPermission:", error);
    return null;
  }
};

/**
 * Setup foreground message listener
 * @param {Function} callback - Callback function to handle incoming messages
 */
export const setupForegroundMessageListener = (callback) => {
  if (!messaging) {
    console.error("Firebase Messaging is not initialized");
    return () => {};
  }

  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    
    // Show toast notification
    if (payload.notification) {
      toast.success(payload.notification.title, {
        description: payload.notification.body,
        duration: 5000,
      });
    }
    
    // Call custom callback if provided
    if (callback) {
      callback(payload);
    }
  });

  return unsubscribe;
};

/**
 * Get current FCM token (without requesting permission)
 * @returns {Promise<string|null>} FCM token or null
 */
export const getCurrentToken = async () => {
  try {
    if (!messaging) {
      return null;
    }

    if (Notification.permission !== "granted") {
      return null;
    }

    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    
    if (!vapidKey) {
      return null;
    }

    const token = await getToken(messaging, { vapidKey });
    return token || null;
  } catch (error) {
    console.error("Error getting current token:", error);
    return null;
  }
};
