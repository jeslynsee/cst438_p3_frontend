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
    <View style={styles.page}>
      
        <ScrollView contentContainerStyle={styles.content}>

            <Header/>

{/*Will add code tp call database to display post and use other features in future*/}

        </ScrollView>
    </View>
  );
}

const colors = {
  bg:"#E9D8C8", card:"#F3E7DA", dark:"#3B261A", mid:"#9B6A44",
  cream:"#EDE1D5", white:"#FFFFFF", red:"#C84B3A"
};
const styles = StyleSheet.create({
  page:{ flex:1, backgroundColor:colors.bg },
  content:{ padding:16, paddingBottom:28 },
  heading:{ fontSize:28, fontWeight:"900", color:colors.dark, marginBottom:14 }
});