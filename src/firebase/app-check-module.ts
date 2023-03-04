import { CustomProvider } from 'firebase/app-check';

const token = '';

declare global {
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined
}

window.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;

const appCheckCustomProvider = new CustomProvider({
  getToken: () => {
    return new Promise((resolve, _reject) => {
      // TODO: Logic to exchange proof of authenticity for an App Check token and
      // expiration time.
      const appCheckToken = {
        token: token,
        expireTimeMillis: 60 * 1000
      };

      resolve(appCheckToken);
    });
  }
});

export default appCheckCustomProvider;