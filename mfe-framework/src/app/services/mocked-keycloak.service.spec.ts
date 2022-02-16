import { TestBed } from '@angular/core/testing';

import { MockedKeycloakService } from './mocked-keycloak.service';

describe('MockedKeycloakService', () => {
  let service: MockedKeycloakService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MockedKeycloakService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
