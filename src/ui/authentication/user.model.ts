import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

@injectable()
export class UserModel {
  email: string | null = null;
  token: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }
}
