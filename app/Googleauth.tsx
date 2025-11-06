// import React from "react";
// import { Button, StyleSheet } from "react-native";
// import { useSession } from "@/hooks/ctx";
// import { router } from "expo-router";


// export default function AuthScreen() {
//   const { signIn } = useSession();

//   const handleSignIn = async () => {
//     await signIn();
//     router.replace("/");
//   };

//   return (

//         <Button
//           title="Sign In With Google"
//           onPress={handleSignIn}
//         />
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "space-around",
//     alignItems: "center",
//   },
// });