import { observer } from 'mobx-react';
import { useInjection } from '../providers/Injection';
import { useValidation } from '../providers/Validation';
import { MessagesPresenter } from './MessagesPresenter';

export const Messages = observer((props) => {
  const presenter = useInjection(MessagesPresenter);
  let [uiMessages] = useValidation();

  return (
    <>
      {props.presenter.messages &&
        props.presenter.messages.map((item, i) => {
          return (
            <div style={{ backgroundColor: 'red' }} key={i}>
              {' - '}
              {item}
            </div>
          );
        })}
      {uiMessages &&
        uiMessages.map((item, i) => {
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
