import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

// —— Brand palette ——
const PALETTE = {
  bg: '#c6a481',          // page background (tan)
  card: '#f4e9df',        // card background (light cream)
  text: '#3a2a1f',        // main text (deep brown)
  subtext: '#6e5648',
  line: '#dcc8b7',
  btn: '#3b2418',         // primary button (dark brown)
  btnText: '#ffffff',
  accent: '#a4643a',      // secondary accent (warm brown/orange)
  danger: '#c83a2c',      // delete
  inputBg: '#ffffff',
};

type User = { username: string; email: string; team: 'Cats' | 'Dogs'; avatarUri?: string };

export default function SettingsScreen() {
  const [user, setUser] = useState<User>({ username: '', email: '', team: 'Cats' });
  const [pwOpen, setPwOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);      // ⬅️ NEW: delete confirm modal
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });

  useEffect(() => {
    // TODO: fetch real user later
    setUser({ username: 'kassandra', email: 'kass@example.com', team: 'Cats' });
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow photo access to upload a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.9,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setUser({ ...user, avatarUri: result.assets[0].uri });
    }
  };

  const save = async () => {
    // TODO: PUT /api/users/me
    Alert.alert('Saved', 'Changes saved locally (backend not wired yet).');
  };

  const resetPassword = async () => {
    if (!pw.next || pw.next !== pw.confirm) {
      Alert.alert('Check password', 'New passwords do not match.');
      return;
    }
    // TODO: POST /api/users/reset-password
    setPw({ current: '', next: '', confirm: '' });
    setPwOpen(false);
    Alert.alert('Password updated', 'Password reset stubbed (backend not wired yet).');
  };

  // Small, consistent brand button
  const BrandButton = ({
    title,
    onPress,
    kind = 'primary',
  }: {
    title: string;
    onPress: () => void;
    kind?: 'primary' | 'secondary' | 'danger';
  }) => {
    const style =
      kind === 'danger'
        ? styles.btnDanger
        : kind === 'secondary'
        ? styles.btnSecondary
        : styles.btnPrimary;
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [style, pressed && { opacity: 0.9 }]}>
        <Text style={styles.btnText}>{title}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.page}>
      <View style={styles.card}>
        <Text style={styles.title}>Account Settings</Text>

        {/* Avatar + upload (extra breathing room & centered) */}
        <View style={styles.avatarWrap}>
          {user.avatarUri ? (
            <Image source={{ uri: user.avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarEmpty]}>
              <Text style={{ color: PALETTE.subtext }}>No Photo</Text>
            </View>
          )}
          <View style={styles.uploadWrap}>
            <BrandButton title="Upload profile photo" onPress={pickImage} kind="secondary" />
          </View>
        </View>

        {/* Inputs */}
        <Text style={styles.label}>Username</Text>
        <TextInput
          value={user.username}
          onChangeText={(t) => setUser({ ...user, username: t })}
          autoCapitalize="none"
          style={styles.input}
          placeholder="Your username"
          placeholderTextColor={PALETTE.subtext}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          keyboardType="email-address"
          value={user.email}
          onChangeText={(t) => setUser({ ...user, email: t })}
          autoCapitalize="none"
          style={styles.input}
          placeholder="name@example.com"
          placeholderTextColor={PALETTE.subtext}
        />

        {/* Team segmented */}
        <Text style={styles.label}>Team</Text>
        <View style={styles.segment}>
          <Pressable
            onPress={() => setUser({ ...user, team: 'Cats' })}
            style={[styles.segmentBtn, user.team === 'Cats' ? styles.segmentActive : undefined]}
          >
            <Text style={[styles.segmentText, user.team === 'Cats' ? styles.segmentTextActive : undefined]}>
              Cats
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setUser({ ...user, team: 'Dogs' })}
            style={[styles.segmentBtn, user.team === 'Dogs' ? styles.segmentActive : undefined]}
          >
            <Text style={[styles.segmentText, user.team === 'Dogs' ? styles.segmentTextActive : undefined]}>
              Dogs
            </Text>
          </Pressable>
        </View>

        {/* Actions */}
        <View style={{ gap: 10, marginTop: 8 }}>
          <BrandButton title="Save changes" onPress={save} />
          <BrandButton title="Reset password" onPress={() => setPwOpen(true)} kind="secondary" />
          <BrandButton title="Delete account" onPress={() => setConfirmOpen(true)} kind="danger" />{/* ⬅️ open modal */}
        </View>
      </View>

      {/* Password reset modal */}
      <Modal visible={pwOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.title, { marginBottom: 8 }]}>Reset Password</Text>

            <Text style={styles.label}>Current password</Text>
            <TextInput secureTextEntry value={pw.current} onChangeText={(t) => setPw({ ...pw, current: t })} style={styles.input} />
            <Text style={styles.label}>New password</Text>
            <TextInput secureTextEntry value={pw.next} onChangeText={(t) => setPw({ ...pw, next: t })} style={styles.input} />
            <Text style={styles.label}>Confirm new password</Text>
            <TextInput secureTextEntry value={pw.confirm} onChangeText={(t) => setPw({ ...pw, confirm: t })} style={styles.input} />

            <View style={{ gap: 10, marginTop: 10 }}>
              <BrandButton title="Save" onPress={resetPassword} />
              <BrandButton title="Cancel" onPress={() => setPwOpen(false)} kind="secondary" />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete confirmation modal — reliable on Web + native */}
      <Modal visible={confirmOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={[styles.title, { marginBottom: 8 }]}>Delete Account</Text>
            <Text style={{ color: PALETTE.subtext, marginBottom: 12 }}>
              This will permanently remove your account. This action cannot be undone.
            </Text>

            <Pressable
              onPress={() => {
                // TODO: DELETE /api/users/me
                setConfirmOpen(false);
                Alert.alert('Deleted', 'Account deletion stubbed (backend not wired yet).');
              }}
              style={({ pressed }) => [styles.btnDanger, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.btnText}>Delete</Text>
            </Pressable>

            <View style={{ height: 10 }} />

            <Pressable
              onPress={() => setConfirmOpen(false)}
              style={({ pressed }) => [styles.btnSecondary, pressed && { opacity: 0.9 }]}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: PALETTE.bg,
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 40,             // ⬅️ pushes avatar/button away from top edge
    gap: 10,
    borderWidth: 1,
    borderColor: PALETTE.line,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: PALETTE.text,
  },
  label: {
    marginTop: 6,
    marginBottom: 4,
    fontSize: 14,
    color: PALETTE.subtext,
  },
  input: {
    backgroundColor: PALETTE.inputBg,
    borderWidth: 1,
    borderColor: PALETTE.line,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: PALETTE.text,
  },
  avatarWrap: {
    alignItems: 'center',
    gap: 12,
    marginTop: 12,              // ⬅️ extra breathing room
    marginBottom: 12,
  },
  uploadWrap: {                 // ⬅️ centers & adds space above the button
    alignItems: 'center',
    marginTop: 6,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: PALETTE.line,
  },
  avatarEmpty: {
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: PALETTE.btn,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnSecondary: {
    backgroundColor: PALETTE.accent,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  btnDanger: {
    backgroundColor: PALETTE.danger,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  btnText: {
    color: PALETTE.btnText,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: '#eadbcc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
    overflow: 'hidden',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: PALETTE.btn,
  },
  segmentText: {
    color: PALETTE.text,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: PALETTE.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
});
