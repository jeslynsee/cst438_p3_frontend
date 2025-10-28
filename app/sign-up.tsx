import {
    Text,
    TextInput,
    View
} from 'react-native';

export default function SignUp() {
    return (
        <View style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
        }}>

            {/* Header */}
            <Text> Sign Up </Text>

            {/* Sign Up form fields */}
            <View> 
                <Text>Username: </Text>
                <TextInput/> 
            </View>

            <View> 
                <Text>Email: </Text>
                <TextInput/> 
            </View>

            <View> 
                <Text>Password: </Text>
                <TextInput/> 
            </View>

        </View>
    );
}