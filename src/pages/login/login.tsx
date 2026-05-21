import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/authSlice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError('');

    dispatch(loginUser({ email, password }))
      .unwrap()
      .catch((err) => {
        setError(err.message || 'Ошибка входа');
      });
  };

  return (
    <LoginUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
