import { injectable } from 'inversify';

@injectable()
export class Config {
  public apiUrl: string;

  constructor() {
    this.apiUrl = 'https://api.logicroom.co/secure-api/bburke@greencheckverified.com';
  }
}
