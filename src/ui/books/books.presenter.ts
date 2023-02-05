import { MessagesPresenter } from 'core/messages/messages.presenter';
import { inject, injectable } from 'inversify';
import { computed, makeObservable } from 'mobx';
import { BooksRepository } from './books.repo';

@injectable()
export class BooksPresenter extends MessagesPresenter {
  @inject(BooksRepository)
  booksRepo: BooksRepository;

  newBookName: string | null = null;

  get viewModel() {
    return this.booksRepo.messagePm;
  }

  constructor() {
    super();

    makeObservable(this, {
      viewModel: computed
    });
  }

  reset = () => {
    this.newBookName = '';
  };
}
