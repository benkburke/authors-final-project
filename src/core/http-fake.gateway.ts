import { User } from 'domain/entities/user.entity';
import { inject, injectable } from 'inversify';
import { Config } from './config';

@injectable()
export class FakeHttpGateway {
  @inject(Config)
  config: Config;

  @inject(User)
  user: User;

  get = async (path) => {};

  post = async (path, requestDto) => {};

  delete = async (path) => {};
}
