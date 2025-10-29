import {
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
export default function Header() {
    return (
        <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIconBox}>
            {/* <View style={styles.logoIcon} /> */}
            <Image
            source={require("../../assets/images/clawsnpaws_icon.png")}
            style={styles.logoIcon}
            />
          </View>
          <Text style={styles.logoText}>Claws and Paws</Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
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
        fontSize: 35,
        fontWeight: '600',
        color: "#A3512F",
        letterSpacing: 0.5,
      },
});
