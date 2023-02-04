import { HttpGateway } from 'core/http.gateway';
import { Container } from 'inversify';
import { RouterGateway } from 'routing/router.gateway';
import { AppPresenter } from '../app.presenter';
import { FakeHttpGateway } from '../core/http-fake.gateway';
import { IOC } from '../ioc';
import { Router } from '../routing/router';
import { FakeRouterGateway } from '../routing/router-fake.gateway';
import { RouterRepository } from '../routing/router.repo';
import { LoginRegisterPresenter } from '../ui/authentication/login-register.presenter';
import { SingleBooksResultStub } from './single-books-result.stub';

export class AppTestHarness {
  appPresenter: AppPresenter;
  container: Container;
  dataGateway: FakeHttpGateway;
  loginRegisterPresenter: LoginRegisterPresenter;
  router: Router;
  routerGateway: RouterGateway;
  routerRepository: RouterRepository;

  // 1. set up the app
  init() {
    this.container = new IOC().buildBaseTemplate();

    this.container.bind(HttpGateway).to(FakeHttpGateway).inSingletonScope();
    this.container.bind(RouterGateway).to(FakeRouterGateway).inSingletonScope();

    this.appPresenter = this.container.get(AppPresenter);
    this.router = this.container.get(Router);
    this.routerRepository = this.container.get(RouterRepository);
    this.routerGateway = this.container.get(RouterGateway);
    this.routerGateway.goToId = jest.fn().mockImplementation((routeId) => {
      // pivot
      this.router.updateCurrentRoute(routeId);
    });
  }

  // 2. bootstrap the app
  bootStrap(onRouteChange) {
    this.appPresenter.load(onRouteChange);
  }

  // 3. login or register to the app
  setupLogin = async (loginStub) => {
    this.dataGateway = this.container.get(HttpGateway);
    this.dataGateway.get = jest.fn().mockImplementation((path) => {
      return Promise.resolve(SingleBooksResultStub());
    });
    this.dataGateway.post = jest.fn().mockImplementation((path) => {
      return Promise.resolve(loginStub());
    });

    this.loginRegisterPresenter = this.container.get(LoginRegisterPresenter);
    this.loginRegisterPresenter.email = 'a@b.com';
    this.loginRegisterPresenter.password = '123';

    await this.loginRegisterPresenter.login();

    return this.loginRegisterPresenter;
  };
}
