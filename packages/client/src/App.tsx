import { useSelector } from './store';

import { fetchUserThunk, selectUser } from './slices/userSlice';

const App = () => {
  const user = useSelector(selectUser);

  return (
    <div>
      {user ? (
        <div>
          <p>{user.first_name}</p>
          <p>{user.second_name}</p>
        </div>
      ) : (
        <p data-testid="user-not-found">Пользователь не найден!</p>
      )}
    </div>
  );
};

export default App;
