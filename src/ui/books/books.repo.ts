import { Config } from 'core/config';
import { HttpGateway } from 'core/http.gateway';
import { inject, injectable } from 'inversify';
import { makeObservable, observable } from 'mobx';
import { UserModel } from '../authentication/user.model';

@injectable()
export class BooksRepository {
  baseUrl: string | null = null;

  @inject(HttpGateway)
  dataGateway: HttpGateway;

  @inject(UserModel)
  userModel: UserModel;

  @inject(Config)
  config: Config;

  messagePm = 'UNSET';

  constructor() {
    makeObservable(this, { messagePm: observable });
  }

  load = () => {
    setTimeout(() => {
      this.messagePm = 'LOADED';
    }, 2000);
  };

  reset = () => {
    this.messagePm = 'RESET';
  };
}
