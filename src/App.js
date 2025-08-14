import { Provider } from 'react-redux';
import AppRouter from './routers/AppRouter';
import { store, persistor } from "./utilities/store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AppRouter />
    </PersistGate>
  </Provider>
)

export default App;
