import { inject, injectable } from 'inversify';
import { computed, makeObservable } from 'mobx';
import { BooksRepository } from './books.repo';

@injectable()
export class BooksPresenter {
  @inject(BooksRepository)
  booksRepository: BooksRepository;

  newBookName: string | null = null;

  get viewModel() {
    return this.booksRepository.messagePm;
  }

  constructor() {
    makeObservable(this, {
      viewModel: computed
    });
  }

  reset = () => {
    this.newBookName = '';
  };
}
