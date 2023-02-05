import { useInjection } from 'core/providers/injection';
import { observer } from 'mobx-react';
import { BooksPresenter } from './books.presenter';

export const Books = observer(() => {
  const presenter = useInjection(BooksPresenter);

  return (
    <>
      <h1>Books</h1>
      {presenter.viewModel}
    </>
  );
});
