import { Container, interfaces } from 'inversify';
import React from 'react';

const InversifyContext = React.createContext<{ container: Container | null }>({ container: null });

type Props = {
  container: Container;
  children: React.ReactNode;
};

export const InjectionProvider: React.FC<Props> = (props) => {
  return (
    <InversifyContext.Provider value={{ container: props.container }}>
      {props.children}
    </InversifyContext.Provider>
  );
};

export function useInjection<T>(identifier: interfaces.ServiceIdentifier<T>) {
  const { container } = React.useContext(InversifyContext);

  if (!container) {
    throw new Error('IOC Container is not initialized');
  }

  return container.get<T>(identifier);
}
