import { KeycloakService } from 'keycloak-angular';
import { CrudService } from '../services/crud.service';

export function initializeKeycloak(keycloak: KeycloakService, crudService: CrudService): () => Promise<boolean> {
    return () =>
    getKeyCloakConf(crudService).then(res => {
        return keycloak.init({
            config: {
                url: res && res.url ? res.url : '',
                realm: res && res.realm ? res.realm : '',
                clientId: res && res.clientId ? res.clientId : '',
            },
            initOptions: {
                onLoad: res && res.onLoad ? res.onLoad : 'login-required',
                checkLoginIframe: res && res.checkLoginIframe ? res.checkLoginIframe : true,
                checkLoginIframeInterval: res && res.checkLoginIframeInterval ? res.checkLoginIframeInterval : 25
            },
            loadUserProfileAtStartUp: res && res.loadUserProfileAtStartUp ? res.loadUserProfileAtStartUp : true
        });
      });
}

export function getKeyCloakConf(crudService: CrudService): Promise<any> {
    return  new Promise((resolve, reject) => {
        crudService.getKeyCloakAuthConfiguration().subscribe(response => {
        resolve(response);
      }, err => {
        resolve(null);
      });
    });
  }
