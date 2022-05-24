/* eslint-disable linebreak-style */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['root'],
};
const pReducer = persistReducer(persistConfig, rootReducer);
const composeEnhancers = composeWithDevTools({});
const store = createStore(
  pReducer,
  {},
  composeEnhancers(applyMiddleware(thunk))
);
const persistor = persistStore(store);
export { store, persistor };
