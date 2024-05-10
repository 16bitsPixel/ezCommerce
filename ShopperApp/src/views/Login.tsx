/*
#######################################################################
#
# Copyright (C) 2020-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
import React from 'react';
import { TextField, Button, Card, CardContent, Typography, Container, Box, Divider } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { LoginContext } from '../context/Login'
import Link from 'next/link';

export function Login() {
  const loginContext = React.useContext(LoginContext)
  const [user, setUser] = React.useState({email: '', password: ''});
  const { view, setView } = React.useContext(LoginContext);
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleInputChange = (event: any) => {
    const {value, name} = event.target;
    const u = user;
    if (name == 'email') {
      u.email = value;
    } else {
      u.password = value;
    }
    setUser(u);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    const query = {query: `query login{login(email: "${user.email}" password: "${user.password}") { name, accessToken }}`}
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          alert(`${json.errors[0].message}`)
        } else {
          loginContext.setAccessToken(json.data.login.accessToken)
          loginContext.setUserName(json.data.login.name)
        }
      })
      .catch((e) => {
        alert(e)
      });
  };

  const changeTo = router.locale === 'en' ? 'es' : 'en'

  if (loginContext.accessToken.length < 1 && view === 'Login') {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" >
            ezCommerce
          </Typography>
        </Box>
        <Card variant="outlined" sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h4" component="h2" gutterBottom>
              {t('login')}
            </Typography>
            <form onSubmit={onSubmit}>
              <Typography variant="subtitle1" component="h2" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
                {t('email-placeholder')}
              </Typography>
              <TextField
                type="email"
                name="email"
                aria-label={t('email-placeholder') || 'Email Address'}
                placeholder={t('email-placeholder') || 'Email Address'}
                margin="normal"
                fullWidth
                onChange={handleInputChange}
                required
                sx={{ mt: 0 }}
              />
              <Typography variant="subtitle1" component="h2" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
                {t('password-placeholder')}
              </Typography>
              <TextField
                type="password"
                name="password"
                aria-label={t('password-placeholder') || 'Password'}
                placeholder={t('password-placeholder') || 'Password'}
                margin="normal"
                fullWidth
                onChange={handleInputChange}
                required
                sx={{ mt: 0 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2, bgcolor: '#f6db00', color: 'black', '&:hover': {bgcolor: '#f6c900'}, padding: '10px 0'}}
              >
                {t('login')}
              </Button>
              <Link href="/" locale={changeTo} passHref>
                <Button fullWidth variant="text">{t('change-locale', { changeTo })}</Button>
              </Link>
            </form>
          </CardContent>
        </Card>
        <Box sx={{ mt: 4, textAlign: 'center', position: 'relative', mb: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography
            variant="subtitle1"
            sx={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'background.paper',
              px: 1
            }}
          >
            {t('new-to-ecommerce')}
          </Typography>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              mt: 2, 
              mb: 2, 
              color: 'black', 
              borderColor: 'black', 
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                borderColor: 'black'
              }
            }}
            onClick={() => setView('Signup')}
          >
            {t('switch-signup')}
          </Button>
        </Box>
      </Container>
    );
  }
  else {
    return null
  }
}