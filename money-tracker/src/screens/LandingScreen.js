import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LandingScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.hero}>
        <Text style={styles.logo}>💰</Text>
        <Text style={styles.appName}>ORI</Text>
        <Text style={styles.tagline}>Take control of your finances</Text>
      </View>

      <View style={styles.features}>
        <FeatureRow icon="📊" title="Track Spending" desc="See exactly where your money goes each month" />
        <FeatureRow icon="🏦" title="Manage Accounts" desc="Link and manage all your bank accounts in one place" />
        <FeatureRow icon="🎯" title="Set Budgets" desc="Create budgets and get alerts before you overspend" />
        <FeatureRow icon="📈" title="Insights" desc="Visual reports to understand your financial habits" />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.secondaryButtonText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FeatureRow({ icon, title, desc }) {
  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  hero: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  appName: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: 0.4,
  },
  tagline: {
    fontSize: 17,
    color: '#8E8E93',
    marginTop: 6,
  },
  features: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  featureIcon: {
    fontSize: 28,
    width: 36,
    textAlign: 'center',
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  featureDesc: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '400',
  },
});
