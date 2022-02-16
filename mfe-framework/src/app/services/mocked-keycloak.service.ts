import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class MockedKeycloakService extends KeycloakService {
  init() {
    return Promise.resolve(true);
  }

  getUsername() {
    return 'admin User';
  }

  // getKeycloakInstance(){
  //   return {  authServerUrl : 'http://keycloak-keycloak.router.default.svc.cluster.local.167.254.204.64.nip.io/auth'
  // }
  // }

  loadUserProfile(){
    return new Promise((resolve, reject) => {
      const userDetails = {username: 'admin',
      firstName: 'admin User',
      email: 'admin.user@fujitsu.com',
      emailVerified: false,
      attributes: {}
    };
      resolve(userDetails);
    });
  }

  logout() {
    return Promise.resolve();
  }

  getKeycloakInstance() {
    return {
      loadUserInfo: () => {
        let callback;
        Promise.resolve().then(() => {
          callback({
            userName: 'admin'
           });
        });
        return {
          success: (fn) => callback = fn
        };
      },
      authServerUrl : 'http://keycloak-keycloak.router.default.svc.cluster.local.167.254.204.64.nip.io/auth'
    } as any;
  }
}
