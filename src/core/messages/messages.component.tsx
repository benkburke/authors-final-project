import { observer } from 'mobx-react';
import { useInjection } from '../providers/injection';
import { useValidation } from '../providers/validation';
import { MessagesPresenter } from './messages.presenter';

export const Messages = observer(() => {
  const presenter = useInjection(MessagesPresenter);
  const { clientValidationMessages } = useValidation();

  return (
    <>
      {presenter.messages &&
        presenter.messages.map((item, i) => {
          return (
            <div style={{ backgroundColor: 'red' }} key={i}>
              {' - '}
              {item}
            </div>
          );
        })}
      {clientValidationMessages &&
        clientValidationMessages.map((item, i) => {
          return (
            <div style={{ backgroundColor: 'orange' }} key={i}>
              {' - '}
              {item}
            </div>
          );
        })}
    </>
  );
});
