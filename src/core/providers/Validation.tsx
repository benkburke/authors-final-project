import React from 'react';

const ValidationContext = React.createContext({
  clientValidationMessages: [],
  updateClientValidationMessages: () => {
    return;
  }
} as { clientValidationMessages: string[]; updateClientValidationMessages: (messages: string[]) => void });

export const ValidationProvider = (props: { children: React.ReactNode }) => {
  const [clientValidationMessages, updateClientValidationMessages] = React.useState<string[]>([]);

  return (
    <ValidationContext.Provider value={{ clientValidationMessages, updateClientValidationMessages }}>
      {props.children}
    </ValidationContext.Provider>
  );
};

export function useValidation() {
  const { clientValidationMessages, updateClientValidationMessages } = React.useContext(ValidationContext);

  return { clientValidationMessages, updateClientValidationMessages };
}
