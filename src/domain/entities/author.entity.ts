import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

@injectable()
export class Author {
  name: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }
}
