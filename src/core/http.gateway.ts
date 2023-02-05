import { User } from 'domain/entities/user.entity';
import { inject, injectable } from 'inversify';
import { Config } from './config';

@injectable()
export class HttpGateway {
  @inject(Config)
  config: Config;

  @inject(User)
  user: User;

  get = async (path) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.user.token ?? ''
      }
    });
    const dto = response.json();
    return dto;
  };

  post = async (path, requestDto) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'POST',
      body: JSON.stringify(requestDto),
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.user.token ?? ''
      }
    });
    const dto = response.json();
    return dto;
  };

  delete = async (path) => {
    const response = await fetch(this.config.apiUrl + path, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.user.token ?? ''
      }
    });
    const dto = response.json();
    return dto;
  };
}
