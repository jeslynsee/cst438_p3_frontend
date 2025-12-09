import { Redirect, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import useGithubAuth from '../hooks/useGithubAuth';
import useGoogleAuth from '../hooks/useGoogleAuth';
import Header from "./components/Header";
import { useSession } from "./context/userContext";

export default function Login() {
  const { signIn, isLoading, session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const { response: githubResponse, promptAsync: promptGithub } = useGithubAuth();
  const { request: googleRequest, response: googleResponse, promptAsync: promptGoogle } = useGoogleAuth();

  const [isReady, setIsReady] = useState(false);

  // useEffect handles problem we had where once user is logged in and tries to exit out of and restart app, gets directed back to login
  // isReady flag helps us know when session should be checked, so it isn't done early, and we don't keep redirecting here
  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

   // wait for storage to load
   if (!isReady) {
    return null; 
  }
 // storage is loaded, now we know if user session stored, to redirect to feed, so logged in user isn't stuck on login page
  if (session) {
    return <Redirect href="/(tabs)/feed" />;
  }

  const handleSignIn = async () => {
    setErrorMsg("");

    if (email.length === 0 || password.length === 0) {
      setErrorMsg("Username and password both required");
      return;
    }

    console.log("Attempting sign in with username " + email + " and password " + password);
    // Authentication logic should come from a route in Spring Boot
    // if authenticated, have router push to home/feed page
    // else error message

    try {
      const response = await fetch("https://catsvsdogs-e830690a69ba.herokuapp.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
        });

        if (response.status === 200) {
          Alert.alert("Login successful!");
          const data = await response.json();
          await signIn(data.user);
          router.replace("/(tabs)/feed");
        } else {
          setErrorMsg("Login credentials invalid. Try again.");
        }

    } catch (e) {

      console.log("Error being caught in login process: " + e);

    }
    
  };

  // function taking user to sign up form if they don't have account already
  const rerouteToSignUp = () => {
   router.push("/sign-up");
  };

  return (
    <View style={styles.container}>
      
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* This is our logo/header */}

          <Header/>

          {/* Username/Password Inputs */}
          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="gray"
                  value={email}
                  onChangeText={setEmail}
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
                  placeholderTextColor="gray"
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
            {/* Error Message */}
            <Text style={{color: "red", fontSize: 20}}> {errorMsg} </Text>
            
          </View>

           {/* Social Login Section */}
           <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or sign in with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialButtons}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => promptGoogle()}
              >
                <View style={styles.googleIcon}>
                <View style={styles.googleIconInner} />
                </View>
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => promptGithub()}
                >
                <View style={styles.githubIcon}>
                  <View style={styles.githubIconInner} />
                </View>
                <Text style={styles.socialButtonText}>Github</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Rerouting */}
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Don&apos;t have an account? </Text>
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
    backgroundColor: "#C4A484",
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
    marginRight: 20
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
    top: -20,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: '500',
    color: '#263238',
    zIndex: 1,
    // fontStyle: 'bold'
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
    backgroundColor: "#3B1F12",
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
  socialSection: {
    marginBottom: 40,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  googleIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIconInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
  },
  githubIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#24292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  githubIconInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#656F78',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  signUpLink: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F52BA',
    textDecorationLine: 'underline',
  },
});