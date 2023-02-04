import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class Config {
  public apiUrl: string;

  constructor() {
    this.apiUrl = 'https://api.logicroom.co/secure-api/bburke@greencheckverified.com';
  }
}
