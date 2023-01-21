import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed } from 'mobx';
import { MessagesRepository } from './messages.repo';

@injectable()
export abstract class MessagesPresenter {
  @inject(MessagesRepository)
  messagesRepository: MessagesRepository;

  showValidationWarning: boolean | null = null;

  get messages() {
    return this.messagesRepository.appMessages;
  }

  constructor() {
    makeObservable(this, {
      showValidationWarning: observable,
      messages: computed,
      unpackRepositoryPmToVm: action
    });
  }

  init = () => {
    this.showValidationWarning = false;
    this.reset();
  };

  unpackRepositoryPmToVm = (pm, userMessage) => {
    this.showValidationWarning = !pm.success;
    this.messagesRepository.appMessages = pm.success ? [userMessage] : [pm.serverMessage];
  };

  abstract reset: () => void;
}
