import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RadioButton } from "react-native-paper";
import Header from "./components/Header";

export default function SignUp() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [team, setTeam] = useState("");

    const router = useRouter();
//TODO: Connect backend to this page
    const handleSignUp = () => {
        setErrorMsg("");
        // standard error checks: are fields empty?
        if (username.length === 0 || email.length === 0 || password.length === 0 || team === "") {
            setErrorMsg("All fields must be filled.");
        } else {
            // TODO after setting up backend: standard errors avoided, so now check first if user exists 
            // if user exists, set another error message

            // else call to backend route to create a new user
            
            //reroute to login page, so user can sign in
            router.replace("/");
        }
       

    }

    return (
        <View style={styles.container}>

        <ScrollView contentContainerStyle={styles.scrollContent}>

        <Header/>

        <View style={styles.titleContainer}>
        <Text style={{
            fontSize: 30,
            color: "#3B1F12"
        }}> 
        Sign Up 
        </Text>
        </View>

            {/* Header */}

            {/* Sign Up form fields */}

             {/* Username */}
          <View style={styles.formContainer}>
            {/* Username Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder=""
                  placeholderTextColor="gray"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </View>
            </View>

             {/* Email */}
          <View style={styles.formContainer}>
            {/* Email Input */}
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
                  autoComplete="email"
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

            {/* radio button section to choose Team Cats or Team Dogs */}
            <View>
              <RadioButton.Group onValueChange={newValue => setTeam(newValue)} value={team}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.radioLabel}> Select Team: </Text>
                  <RadioButton value="cat" />
                  <Text style={styles.radioLabel}>Cat</Text>
                  <RadioButton value="dog" />
                  <Text style={styles.radioLabel}>Dog</Text>
                </View>

              </RadioButton.Group>

            </View>

            {/* Sign Up */}
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
              <Text style={styles.signUpButtonText}>Sign up</Text>
            </TouchableOpacity>
            {/* Error Message */}
            <Text style={{color: "red", fontSize: 20}}> {errorMsg} </Text>
            
          </View>

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
    titleContainer: {
        alignItems: "center",
        justifyContent: "center",
       marginBottom: 20
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 48,
        paddingTop: 60,
        paddingBottom: 40,
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
      radioLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#263238',
        // fontStyle: 'bold'
      },
      signUpButton: {
        height: 50,
        backgroundColor: "#3B1F12",
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      },
      signUpButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '400',
      },
});