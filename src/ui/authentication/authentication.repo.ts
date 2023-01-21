import { HttpGateway } from 'core/http.gateway';
import { inject, injectable } from 'inversify';
import { action, makeObservable } from 'mobx';
import { MessagePacking } from '../../core/messages/message-packing';
import { Router } from '../../routing/router';
import { UserModel } from './user.model';

@injectable()
export class AuthenticationRepository {
  @inject(Router)
  router: Router;

  @inject(HttpGateway)
  dataGateway: HttpGateway;

  @inject(UserModel)
  userModel: UserModel;

  constructor() {
    makeObservable(this, {
      login: action
    });
  }

  login = async (email, password) => {
    const loginDto = await this.dataGateway.post('/login', {
      email: email,
      password: password
    });

    if (loginDto.success) {
      this.userModel.email = email;
      this.userModel.token = loginDto.result.token;
    }

    return MessagePacking.unpackServerDtoToPm(loginDto);
  };

  register = async (email, password) => {
    const registerDto = await this.dataGateway.post('/register', {
      email: email,
      password: password
    });

    return MessagePacking.unpackServerDtoToPm(registerDto);
  };

  logOut = async () => {
    this.userModel.email = '';
    this.userModel.token = '';
  };
}
