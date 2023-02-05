import { Config } from 'core/config';
import { HttpGateway } from 'core/http.gateway';
import { User } from 'domain/entities/user.entity';
import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

@injectable()
export class BooksRepository {
  baseUrl: string | null = null;

  @inject(HttpGateway)
  dataGateway: HttpGateway;

  @inject(User)
  user: User;

  @inject(Config)
  config: Config;

  messagePm = 'UNSET';

  constructor() {
    makeAutoObservable(this);
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
