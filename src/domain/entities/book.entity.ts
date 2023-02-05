import { injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

@injectable()
export class Book {
  title: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }
}
