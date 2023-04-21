import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRegister, selectIsAuth } from '../../redux/slices/auth';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import axios from '../../axios';

export const Registration = () => {
  const [imageUrl, setImageUrl] = React.useState('');
  const isAuth = useSelector(selectIsAuth);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors, isValid }, setValue} = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      avatarUrl: ''
    },
    mode: 'onChange'
  });

  const onSubmit = async(values) => {
    const data = await dispatch(fetchRegister(values));

    if (!data.payload) {
      return alert("Не удалось зарегистрироваться!")
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token)
    }
  }
  const handleChangeFile = async(event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append('image', file)
      const { data } = await axios.post('/avatar', formData);
      setImageUrl(data.url);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла')
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  if (isAuth) {
    return <Navigate to="/"/>
  }

  return (
    <Paper classes={{ root: styles.root }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Создание аккаунта
        </Typography>
        {imageUrl 
        ? <>
          <div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} src={`http://localhost:4444${imageUrl}`} alt="Avatar" />
          </div>
          <Button sx={{ marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <Button sx={{ marginBottom: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} variant="contained" onClick={() => {
            setValue('avatarUrl', `http://localhost:4444${imageUrl}`);
          }}>
            Подтвердить аватар
          </Button>
          </>
        :<div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </div>}
        <Button sx={{ marginBottom: "20px"}} onClick={() => document.querySelector('#avatarUrl').click()} variant="outlined" size="large" fullWidth>
            Загрузить аватар
        </Button>
        <input
          id="avatarUrl" 
          name="avatarUrl"
          type="file" 
          onChange={handleChangeFile}
          hidden 
           />
        <TextField 
          className={styles.field} 
          label="Полное имя"
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message} 
          { ...register('fullName', { required: 'Укажите полное имя'}) }
          fullWidth />
        <TextField 
          className={styles.field} 
          label="E-Mail" 
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          type="email"
          { ...register('email', { required: 'Укажите почту' })}
          fullWidth />
        <TextField 
          className={styles.field} 
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          { ...register('password', { required: 'Укажите пароль' })}  
          fullWidth />
        <Button disabled={!isValid} type='submit' size="large" variant="contained" fullWidth>
          Зарегистрироваться
        </Button>
      </form>
    </Paper>
  );
};
