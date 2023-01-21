import { inject, injectable } from 'inversify';
import { UserModel } from 'ui/authentication/user.model';
import { Config } from './config';

@injectable()
export class FakeHttpGateway {
  @inject(Config)
  config: Config;

  @inject(UserModel)
  userModel: UserModel;

  get = async (path) => {};

  post = async (path, requestDto) => {};

  delete = async (path) => {};
}
