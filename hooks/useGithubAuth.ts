import { useAuthRequest } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useSession } from '../app/context/userContext';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
};

export default function useGithubAuth() {
  const { signIn } = useSession();
  const router = useRouter();
  
  const redirectUri = 'https://catsvsdogs-web-42f3d8a67c13.herokuapp.com/feed';

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Ov23liUbTaB4he1bfxAS',
      scopes: ['read:user', 'user:email'],
      redirectUri,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const code = response.params.code;
      console.log('Received GitHub code:', code);
      
      // Exchange code for user data
      fetch('https://catsvsdogs-e830690a69ba.herokuapp.com/api/auth/github/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(async data => {
          if (data.user) {
            Alert.alert('Success', 'GitHub login successful!');
            await signIn(data.user);
            router.replace('/(tabs)/feed');
          } else {
            Alert.alert('Error', data.error || 'GitHub authentication failed');
          }
        })
        .catch(err => {
          console.error('GitHub OAuth error:', err);
          Alert.alert('Error', 'Failed to authenticate with GitHub');
        });
    } else if (response?.type === 'error') {
      console.error('GitHub OAuth error:', response.error);
      Alert.alert('Error', 'GitHub authentication was cancelled or failed');
    }
  }, [response]);

  return { request, response, promptAsync };
}