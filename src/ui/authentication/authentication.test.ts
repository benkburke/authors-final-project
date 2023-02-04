import { HttpGateway } from 'core/http.gateway';
import 'reflect-metadata';
import { RouterGateway } from 'routing/router.gateway';
import { GetFailedRegistrationStub } from 'test-tools/get-failed-registration.stub';
import { GetFailedUserLoginStub } from 'test-tools/get-failed-user-login.stub';
import { GetSuccessfulRegistrationStub } from 'test-tools/get-successful-registration.stub';
import { GetSuccessfulUserLoginStub } from 'test-tools/get-successful-user-login.stub';
import { Router } from '../../routing/router';
import { RouterRepository } from '../../routing/router.repo';
import { AppTestHarness } from '../../test-tools/app-test-harness';
import { LoginRegisterPresenter } from './login-register.presenter';
import { UserModel } from './user.model';

let appTestHarness: AppTestHarness | null = null;
let loginRegisterPresenter: LoginRegisterPresenter | null = null;
let userModel: UserModel | null = null;

let onRouteChange: (() => void) | null = null;

describe('init', () => {
  beforeEach(() => {
    appTestHarness = new AppTestHarness();
    appTestHarness.init();

    userModel = appTestHarness.container.get(UserModel);

    onRouteChange = () => {};
  });

  it('should be a null route', () => {
    if (!appTestHarness) {
      return;
    }

    expect(appTestHarness.routerRepository.currentRoute.routeId).toBe(null);
  });

  describe('bootstrap', () => {
    beforeEach(() => {
      appTestHarness!.bootStrap(onRouteChange);
    });

    it('should start at null route', () => {
      if (!appTestHarness) {
        return;
      }

      expect(appTestHarness.routerRepository.currentRoute.routeId).toBe(null);
    });

    describe('routing', () => {
      it('should block wildcard *(default) routes when not logged in', () => {
        if (!appTestHarness) {
          return;
        }

        appTestHarness.router.goToId('defaultLink');

        expect(appTestHarness.routerGateway.goToId).toHaveBeenLastCalledWith(
          'loginLink',
          undefined,
          undefined
        );
      });

      it('should block secure routes when not logged in', () => {
        if (!appTestHarness) {
          return;
        }

        appTestHarness.router.goToId('appHomeLink');

        expect(appTestHarness.routerGateway.goToId).toHaveBeenLastCalledWith(
          'loginLink',
          undefined,
          undefined
        );
      });

      it('should allow public route when not logged in', () => {
        if (!appTestHarness) {
          return;
        }

        appTestHarness.router.goToId('authorPolicyLink');

        expect(appTestHarness.routerGateway.goToId).toHaveBeenLastCalledWith(
          'authorPolicyLink',
          undefined,
          undefined
        );
      });
    });

    describe('register', () => {
      let setupRegister = async (registerStub) => {
        if (!appTestHarness) {
          return;
        }

        appTestHarness.dataGateway.post = jest.fn().mockImplementation((path) => {
          return Promise.resolve(registerStub());
        });

        loginRegisterPresenter = appTestHarness.container.get(LoginRegisterPresenter);
        await loginRegisterPresenter.register();
      };

      it('should show successful user message on successful register', async () => {
        if (!userModel || !loginRegisterPresenter) {
          return;
        }

        await setupRegister(GetSuccessfulRegistrationStub);
        expect(userModel.email).toBe(null);
        expect(userModel.token).toBe(null);
        expect(loginRegisterPresenter.showValidationWarning).toBe(false);
        expect(loginRegisterPresenter.messages![0]).toBe('User registered');
      });

      it('should show failed server message on failed register', async () => {
        if (!userModel || !loginRegisterPresenter) {
          return;
        }

        await setupRegister(GetFailedRegistrationStub);
        expect(userModel.email).toBe(null);
        expect(userModel.token).toBe(null);
        expect(loginRegisterPresenter.showValidationWarning).toBe(true);
        expect(loginRegisterPresenter.messages![0]).toBe(
          'Failed: credentials not valid must be (email and >3 chars on password).'
        );
      });
    });

    describe('login', () => {
      it('should start at loginLink', async () => {
        if (!appTestHarness) {
          return;
        }

        expect(appTestHarness.routerRepository.currentRoute.routeId).toBe(null);
      });

      it('should go to appHomeLink on successful login (and populate userModel)', async () => {
        if (!appTestHarness || !userModel) {
          return;
        }

        await appTestHarness.setupLogin(GetSuccessfulUserLoginStub);
        expect(appTestHarness.dataGateway.post).toHaveBeenCalledWith('/login', {
          email: 'a@b.com',
          password: '123'
        });
        expect(userModel.email).toBe('a@b.com');
        expect(userModel.token).toBe('a@b1234.com');
        expect(appTestHarness.dataGateway.post).toHaveBeenCalledWith('/login', {
          email: 'a@b.com',
          password: '123'
        });
        expect(appTestHarness.routerGateway.goToId).toHaveBeenLastCalledWith(
          'appHomeLink',
          undefined,
          undefined
        );
        expect(appTestHarness.routerRepository.currentRoute.routeId).toBe('appHomeLink');
      });

      it('should update private route when successful login', async () => {
        if (!appTestHarness) {
          return;
        }

        await appTestHarness.setupLogin(GetSuccessfulUserLoginStub);

        appTestHarness.router.goToId('appHomeLink');

        expect(appTestHarness.routerGateway.goToId).toHaveBeenCalledWith('appHomeLink', undefined, undefined);
        expect(appTestHarness.routerRepository.currentRoute.routeId).toBe('appHomeLink');
      });

      it('should not update route when failed login', async () => {
        if (!appTestHarness) {
          return;
        }

        await appTestHarness.setupLogin(GetFailedUserLoginStub);

        appTestHarness.router.goToId('appHomeLink');

        expect(appTestHarness.routerGateway.goToId).toHaveBeenCalledWith('appHomeLink', undefined, undefined);
        expect(appTestHarness.routerRepository.currentRoute.routeId).toBe('loginLink');
      });

      it('should show failed user message on failed login', async () => {
        if (!appTestHarness || !userModel) {
          return;
        }

        loginRegisterPresenter = await appTestHarness.setupLogin(GetFailedUserLoginStub);
        expect(userModel.email).toBe(null);
        expect(userModel.token).toBe(null);
        expect(loginRegisterPresenter.showValidationWarning).toBe(true);
        expect(loginRegisterPresenter.messages![0]).toBe('Failed: no user record.');
      });

      it('should clear messages on route change', async () => {
        if (!appTestHarness) {
          return;
        }

        loginRegisterPresenter = await appTestHarness.setupLogin(GetFailedUserLoginStub);

        expect(loginRegisterPresenter.messages![0]).toBe('Failed: no user record.');

        appTestHarness.router.goToId('appHomeLink');

        expect(loginRegisterPresenter.messages!.length).toBe(0);
      });

      it('should logout', async () => {
        if (!appTestHarness || !userModel) {
          return;
        }

        loginRegisterPresenter = await appTestHarness.setupLogin(GetSuccessfulUserLoginStub);

        expect(userModel.token).toBe('a@b1234.com');

        loginRegisterPresenter.logOut();

        expect(userModel.token).toBe('');
        expect(appTestHarness.routerGateway.goToId).toHaveBeenCalledWith('loginLink', undefined, undefined);
      });
    });
  });
});
