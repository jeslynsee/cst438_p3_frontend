import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
export default function Header() {
  return (
    <View style={styles.headerWrapper}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/clawsnpaws_icon.png")}
          style={styles.logoIcon}
        />
        <Text style={styles.logoText}>Claws and Paws</Text>
      </View>
  
      <Text style={styles.feedTitle}>Feed</Text>
  
      <View style={styles.feedButtons}>
        <TouchableOpacity style={styles.feedButton} onPress={() => alert('Reset filter')}>
          <Text style={styles.feedButtonText}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedButton} onPress={() => alert('filter post to just show those made by followed accounts')}>
          <Text style={styles.feedButtonText}>Following</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedButton} onPress={() => alert('brings user to a page that displays')}>
          <Text style={styles.feedButtonText}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.feedButton} onPress={() => alert('Brings user to profile page')}>
          <Text style={styles.feedButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',          
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '#E9D8C8',
  },
  logoSection: {
    alignItems: 'flex-start',
    marginBottom: 84,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  logoIconBox: {
    width: 48,
    height: 47,
    // borderRadius: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  logoIcon: {
    width: 75,
    height: 75,
    borderRadius: 14,
    marginRight: 20
  },
  logoText: {
    fontSize: 25,
    fontWeight: '600',
    color: "#A3512F",
    letterSpacing: 0.5,
  },
  feedContainer: {
    width: '100%',
    flexDirection: 'row',             
    alignItems: 'center',           
    justifyContent: 'space-between', 
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#E9D8C8',
  },
  feedTitle: {
    fontSize: 24,
    alignItems: 'center',
    fontWeight: '700',
    color: '#3B1F12',
  },
  feedButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedButton: {
    backgroundColor: '#3B1F12',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'space-between', 
  },
  feedButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
