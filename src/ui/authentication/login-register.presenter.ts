import { MessagesPresenter } from 'core/messages/messages.presenter';
import { inject, injectable } from 'inversify';
import { action, makeObservable, observable } from 'mobx';
import { Router } from 'routing/router';
import { AuthenticationRepository } from './authentication.repo';

@injectable()
export class LoginRegisterPresenter extends MessagesPresenter {
  @inject(AuthenticationRepository)
  authenticationRepository: AuthenticationRepository;

  @inject(Router)
  router: Router;

  email: string | null = null;

  password: string | null = null;
  option: string | null = null;

  constructor() {
    super();

    makeObservable(this, {
      email: observable,
      option: observable,
      password: observable,
      logOut: action,
      login: action,
      register: action,
      reset: action
    });

    this.init();
  }

  reset = () => {
    this.email = '';
    this.password = '';
    this.option = 'login';
  };

  login = async () => {
    const loginPm = await this.authenticationRepository.login(this.email, this.password);

    this.unpackRepositoryPmToVm(loginPm, 'User logged in');

    if (loginPm.success) {
      this.router.goToId('appHome');
    }
  };

  register = async () => {
    const registerPm = await this.authenticationRepository.register(this.email, this.password);

    this.unpackRepositoryPmToVm(registerPm, 'User registered');
  };

  logOut = async () => {
    this.authenticationRepository.logOut();
    this.router.goToId('login');
  };
}
