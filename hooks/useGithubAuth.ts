import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/Ov23liUbTaB4he1bfxAS',
};

export default function useGithubAuth() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'Ov23liUbTaB4he1bfxAS',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({ 
        path: 'feed',      
      }),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log('GitHub OAuth code:', code);
    }
  }, [response]);

  return { request, response, promptAsync };
}