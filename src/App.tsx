import * as React from 'react';
import { observer } from 'mobx-react';
import { useInjection } from './core/providers/Injection';
import { AppPresenter } from './app.presenter';
import { Navigation } from './ui/navigation/NavigationComponent';
import { Home } from './ui/home/HomeComponent';
import { LoginRegister } from './ui/authentication/LoginRegisterComponent';
import { MessagesRepository } from './core/messages/MessagesRepository';

export const App = observer((props) => {
  const presenter = useInjection(AppPresenter);
  const messagesRepository = useInjection(MessagesRepository);

  React.useEffect(() => {}, []);

  const renderedComponents = [
    {
      id: 'homeLink',
      component: <Home key="homePage" />
    }
  ];

  return (
    <div className="container">
      {presenter.currentRoute.routeId === 'loginLink' ? (
        <>
          <LoginRegister />
        </>
      ) : (
        <div className="w3-row">
          <div className="w3-col s4 w3-center">
            <Navigation />
          </div>
          <div className="w3-col s8 w3-left">
            {renderedComponents.map((current) => {
              return presenter.currentRoute.routeId === current.id && current.component;
            })}
          </div>
        </div>
      )}
    </div>
  );
});
