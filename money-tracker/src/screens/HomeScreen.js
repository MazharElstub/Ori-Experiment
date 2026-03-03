import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { currentUser, logout, deleteAccount } = useAuth();
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  function handleLogout() {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            await deleteAccount();
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{currentUser?.name} 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarButton}
          onPress={() => setShowAccountMenu(v => !v)}
        >
          <Text style={styles.avatarText}>
            {currentUser?.name?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </TouchableOpacity>
      </View>

      {showAccountMenu && (
        <View style={styles.accountMenu}>
          <Text style={styles.accountEmail}>{currentUser?.email}</Text>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Text style={styles.menuItemText}>Log Out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
            <Text style={[styles.menuItemText, styles.destructive]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.comingSoonCard}>
          <Text style={styles.comingSoonEmoji}>🚧</Text>
          <Text style={styles.comingSoonTitle}>Your dashboard is coming soon</Text>
          <Text style={styles.comingSoonText}>
            We're building a powerful set of tools to help you understand and control your finances.
            Here's what's on the way:
          </Text>
        </View>

        <View style={styles.upcomingList}>
          <UpcomingFeature
            icon="💳"
            title="Expense Tracking"
            desc="Log every transaction and tag it by category — groceries, transport, dining, and more."
          />
          <UpcomingFeature
            icon="🏦"
            title="Account Management"
            desc="Connect your current accounts, savings, and credit cards in one unified view."
          />
          <UpcomingFeature
            icon="📊"
            title="Monthly Reports"
            desc="Beautiful charts that show your spending patterns and highlight areas to save."
          />
          <UpcomingFeature
            icon="🎯"
            title="Budget Goals"
            desc="Set monthly spending limits per category and get notified when you're close to the limit."
          />
          <UpcomingFeature
            icon="🔔"
            title="Smart Alerts"
            desc="Instant notifications for unusual spending, large transactions, and upcoming bills."
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function UpcomingFeature({ icon, title, desc }) {
  return (
    <View style={styles.featureCard}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureBody}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  accountMenu: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  accountEmail: {
    fontSize: 13,
    color: '#8E8E93',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#C6C6C8',
    marginHorizontal: 16,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 17,
    color: '#1C1C1E',
  },
  destructive: {
    color: '#FF3B30',
  },
  scroll: {
    padding: 20,
    gap: 16,
  },
  comingSoonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  comingSoonEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
  },
  upcomingList: {
    gap: 12,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  featureIcon: {
    fontSize: 28,
  },
  featureBody: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
});
