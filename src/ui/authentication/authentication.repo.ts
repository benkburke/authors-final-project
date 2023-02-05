import { HttpGateway } from 'core/http.gateway';
import { User } from 'domain/entities/user.entity';
import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { MessagePacking } from '../../core/messages/message-packing';
import { Router } from '../../routing/router';

@injectable()
export class AuthenticationRepository {
  @inject(Router)
  router: Router;

  @inject(HttpGateway)
  dataGateway: HttpGateway;

  @inject(User)
  user: User;

  constructor() {
    makeAutoObservable(this);
  }

  login = async (email, password) => {
    const loginDto = await this.dataGateway.post('/login', {
      email: email,
      password: password
    });

    if (loginDto.success) {
      this.user.email = email;
      this.user.token = loginDto.result.token;
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
    this.user.email = '';
    this.user.token = '';
  };
}
