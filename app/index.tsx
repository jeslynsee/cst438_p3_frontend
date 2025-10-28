import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSignIn = () => {
    setErrorMsg("");
    console.log('Sign in with:', username, password);
    // Authentication logic should come from a route in Spring Boot
    // if authenticated, have router push to home/feed page
    // else error message

    if (username.length === 0 || password.length === 0) {
      setErrorMsg("Username and password both required")
    }
  };

  const rerouteToSignUp = () => {
   router.replace("/sign-up");
  };

  return (
    <View style={styles.container}>
      
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* Logo/Header */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoIconBox}>
                {/* <View style={styles.logoIcon} /> */}
                <Image
                source={require("../assets/images/clawsnpaws_icon.png")}
                style={styles.logoIcon}
                />
              </View>
              <Text style={styles.logoText}>Claws and Paws</Text>
            </View>
          </View>

         
          {/* Username/Password Inputs */}
          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="rgba(38, 50, 56, 0.6)"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="rgba(38, 50, 56, 0.6)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  autoComplete="password"
                />
              </View>
            </View>

            {/* Sign In */}
            <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
              <Text style={styles.signInButtonText}>Sign in</Text>
            </TouchableOpacity>
            <Text style={{color: "red"}}> {errorMsg} </Text>
            
          </View>

          {/* Sign Up Rerouting */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={rerouteToSignUp}>
              <Text style={styles.signUpLink}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
  
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEBFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 48,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 84,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIconBox: {
    width: 48,
    height: 47,
    // borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 75,
    height: 75,
    borderRadius: 14,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '600',
    color: "#A3512F",
    letterSpacing: 0.5,
  },
  tabSection: {
    marginBottom: 60,
  },
  tabButtons: {
    flexDirection: 'row',
    gap: 26,
    marginBottom: 17,
  },
  tabText: {
    fontSize: 18,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '400',
  },
  tabIndicatorContainer: {
    position: 'relative',
    width: '100%',
    height: 2,
  },
  tabIndicatorBg: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#C4C4C4',
    borderRadius: 5,
  },
  tabIndicator: {
    position: 'absolute',
    width: 57,
    height: 2,
    backgroundColor: '#0779B8',
    borderRadius: 5,
    left: 0,
  },
  tabIndicatorRight: {
    left: 84,
  },
  formContainer: {
    marginBottom: 40,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  inputLabel: {
    position: 'absolute',
    top: -7,
    left: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 4,
    fontSize: 16,
    fontWeight: '500',
    color: '#263238',
    zIndex: 1,
  },
  inputContainer: {
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(38, 50, 56, 0.16)',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 16,
    color: 'rgba(38, 50, 56, 0.6)',
    letterSpacing: 0.16,
  },
  signInButton: {
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
  },
  forgotPassword: {
    alignSelf: 'center',
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  socialSection: {
    marginBottom: 40,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#000000',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  socialButton: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#656F78',
    borderRadius: 5,
    gap: 8,
  },
  googleIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285F4',
  },
  googleIconInner: {
    width: 12,
    height: 12,
    margin: 2,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  microsoftIcon: {
    width: 16,
    height: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  microsoftSquare: {
    width: 7,
    height: 7,
    margin: 0.5,
  },
  microsoftRed: {
    backgroundColor: '#F1511B',
  },
  microsoftGreen: {
    backgroundColor: '#80CC28',
  },
  microsoftBlue: {
    backgroundColor: '#00ADEF',
  },
  microsoftYellow: {
    backgroundColor: '#FBBC09',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#656F78',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#656F78',
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '500',
    color: '#656F78',
    textDecorationLine: 'underline',
  },
});