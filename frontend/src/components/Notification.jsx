import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AsyncStorage from '@react-native-async-storage/async-storage';

dayjs.extend(relativeTime);

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnims = useRef({}).current;

  // Fetch notifications after getting email from AsyncStorage
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        if (!userEmail) {
          Alert.alert('Error', 'User email not found in storage');
          setLoading(false);
          return;
        }
        const response = await fetch(`http://192.168.29.37:8000/user-notifications/${userEmail}`);
        const data = await response.json();
        const fetched = data.notifications || [];
        setNotifications(fetched);
        setLoading(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to load notifications');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    // Initialize fade values for each notification
    notifications.forEach((note) => {
      if (!fadeAnims[note._id]) {
        fadeAnims[note._id] = new Animated.Value(1);
      }
    });
  }, [notifications]);

  const deleteNotification = async (id) => {
    try {
      // Call backend delete API
      const response = await fetch(`http://192.168.29.37:8000/user-notifications/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete notification');
      }

      // Animate fade out
      Animated.timing(fadeAnims[id], {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setNotifications((prev) => prev.filter((note) => note._id !== id));
        delete fadeAnims[id];
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderRightActions = (id) => (
    <View className="flex-row mt-1 mb-2">
      <TouchableOpacity
        className="bg-red-600 justify-center items-center w-16 rounded-r-md"
        onPress={() => deleteNotification(id)}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  const NotificationItem = ({ note, isLast }) => {
    // Convert UTC to local date before showing relative time
    const localDate = dayjs(note.created_at).local();

    return (
      <View>
        <Swipeable renderRightActions={() => renderRightActions(note._id)}>
          <Animated.View
            style={{ opacity: fadeAnims[note._id] || new Animated.Value(1) }}
            className="mb-1 p-4 rounded-xl shadow-md bg-slate-700 border border-slate-600"
          >
            <View>
              <Text className="text-sm text-blue-200 mt-1">{note.message}</Text>
              <Text className="text-xs text-blue-300 mt-2">
                {localDate.fromNow()}
              </Text>
            </View>
          </Animated.View>
        </Swipeable>
        {!isLast && <View className="h-px bg-slate-700 mx-4 my-2" />}
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-900">
        <ActivityIndicator size="large" color="#60A5FA" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-900">
      {/* Header */}
      <View className="bg-slate-800 p-4 shadow-md">
        <Text className="text-xl font-bold text-white">Notifications</Text>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1 p-4 pt-2">
        <Text className="text-blue-300 text-xs mb-2 px-1">
          {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
        </Text>

        {notifications.length > 0 ? (
          notifications.map((note, index) => (
            <NotificationItem
              key={note._id}
              note={note}
              isLast={index === notifications.length - 1}
            />
          ))
        ) : (
          <View className="flex-1 items-center justify-center py-16 bg-slate-800 rounded-xl shadow-lg border border-slate-700 mt-2">
            <MaterialIcons name="notifications-off" size={64} color="#60A5FA" />
            <Text className="text-blue-100 text-lg mt-4">No notifications</Text>
            <Text className="text-blue-300 text-sm text-center mt-2 px-6">
              You're all caught up!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
