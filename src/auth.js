import auth0 from 'auth0-js';

export default class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      audience: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/userinfo`,
      clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
      redirectUri: 'http://localhost:3000?callback=true',
      responseType: 'token id_token',
      scope: 'openid profile'
    });

    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.login = this.login.bind(this);
    this.setSession = this.setSession.bind(this);
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  login() {
    this.auth0.authorize();
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // set the time that the id token will expire at
    this.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
  }
}
