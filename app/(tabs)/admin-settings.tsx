import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import Header from "../components/Logged-In-Header";


export default function feed() {


  const router = useRouter();

  return (
    <View style={styles.container}>
      
        <ScrollView contentContainerStyle={styles.scrollContent}>

            <Header/>

{/*Will add code tp call database to display post and use other features in future*/}

        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4A484",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 35,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "flex-start",
  },
});