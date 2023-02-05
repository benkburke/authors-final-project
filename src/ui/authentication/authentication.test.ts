import { User } from 'domain/entities/user.entity';
import 'reflect-metadata';
import { GetFailedRegistrationStub } from 'test-tools/stubs/get-failed-registration.stub';
import { GetFailedUserLoginStub } from 'test-tools/stubs/get-failed-user-login.stub';
import { GetSuccessfulRegistrationStub } from 'test-tools/stubs/get-successful-registration.stub';
import { GetSuccessfulUserLoginStub } from 'test-tools/stubs/get-successful-user-login.stub';
import { AppTestHarness } from '../../test-tools/app-test-harness';
import { LoginRegisterPresenter } from './login-register.presenter';

let appTestHarness: AppTestHarness | null = null;
let loginRegisterPresenter: LoginRegisterPresenter | null = null;
let user: User | null = null;

let onRouteChange: (() => void) | null = null;

describe('init', () => {
  beforeEach(() => {
    appTestHarness = new AppTestHarness();
    appTestHarness.init();

    user = appTestHarness.container.get(User);

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
        if (!user || !loginRegisterPresenter) {
          return;
        }

        await setupRegister(GetSuccessfulRegistrationStub);
        expect(user.email).toBe(null);
        expect(user.token).toBe(null);
        expect(loginRegisterPresenter.showValidationWarning).toBe(false);
        expect(loginRegisterPresenter.messages![0]).toBe('User registered');
      });

      it('should show failed server message on failed register', async () => {
        if (!user || !loginRegisterPresenter) {
          return;
        }

        await setupRegister(GetFailedRegistrationStub);
        expect(user.email).toBe(null);
        expect(user.token).toBe(null);
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
        if (!appTestHarness || !user) {
          return;
        }

        await appTestHarness.setupLogin(GetSuccessfulUserLoginStub);
        expect(appTestHarness.dataGateway.post).toHaveBeenCalledWith('/login', {
          email: 'a@b.com',
          password: '123'
        });
        expect(user.email).toBe('a@b.com');
        expect(user.token).toBe('a@b1234.com');
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
        if (!appTestHarness || !user) {
          return;
        }

        loginRegisterPresenter = await appTestHarness.setupLogin(GetFailedUserLoginStub);
        expect(user.email).toBe(null);
        expect(user.token).toBe(null);
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
        if (!appTestHarness || !user) {
          return;
        }

        loginRegisterPresenter = await appTestHarness.setupLogin(GetSuccessfulUserLoginStub);

        expect(user.token).toBe('a@b1234.com');

        loginRegisterPresenter.logOut();

        expect(user.token).toBe('');
        expect(appTestHarness.routerGateway.goToId).toHaveBeenCalledWith('loginLink', undefined, undefined);
      });
    });
  });
});
