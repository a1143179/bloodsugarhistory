import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GoogleIcon from '@mui/icons-material/Google';
import { Box, Grid, Paper, Typography, Button, useTheme, useMediaQuery, Divider, Stack, Avatar, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';

const GoogleLogin = () => {
  const { loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const isTestMobile = typeof window !== 'undefined' && window.Cypress && window.localStorage.getItem('forceMobile') === 'true';
  const isMobile = useMediaQuery(theme.breakpoints.down('md')) || isTestMobile;
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e) => {
    setLoading(true);
    try {
        await loginWithGoogle(e, rememberMe);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      data-testid="login-page-root"
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        position: 'relative',
      }}
    >
      {isMobile && loading && (
        <Box
          data-testid="login-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'rgba(0,0,0,0.4)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'all', // Block all interaction
          }}
        >
          <CircularProgress color="primary" size={64} thickness={5} />
        </Box>
      )}
      <Paper
        elevation={8}
        sx={{
          maxWidth: 900,
          width: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%', mb: 2, mt: 2, justifyContent: 'center' }}>
          {!isMobile && (
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <LocalHospitalIcon sx={{ fontSize: 32, color: 'white' }} />
            </Avatar>
          )}
          <Box>
            <Typography variant="h4" fontWeight={700} color="text.primary" gutterBottom>
              {t('appTitle')}
            </Typography>
            {!isMobile && (
              <Typography variant="subtitle1" color="text.secondary">
                {t('appDescription')}
              </Typography>
            )}
          </Box>
        </Stack>
        <Divider sx={{ width: { xs: '90%', sm: '80%' }, mb: 3 }} />
        <Grid container spacing={4} sx={{ 
          width: '100%',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 2,
          p: 2
        }}>
          <Grid item xs={12} md={6} order={isMobile ? 2 : 1} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2, display: { xs: 'block', md: 'block' }, textAlign: 'left' }}>
              {t('whatYoullGet')}
            </Typography>
            <Stack spacing={2} sx={{ width: 'fit-content' }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <GoogleIcon color="success" />
                <Typography variant="body1">{t('trackBloodSugar')}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <GoogleIcon color="success" />
                <Typography variant="body1">{t('viewTrends')}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <GoogleIcon color="success" />
                <Typography variant="body1">{t('exportData')}</Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={6} order={isMobile ? 1 : 2}>
            <Typography variant="h6" fontWeight={600} color="primary" sx={{ mb: 2, display: { xs: 'none', md: 'block' }, textAlign: 'left' }}>
              {t('welcomeBack')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: { xs: 'block', md: 'block' } }}>
              {t('signInToAccess')}
            </Typography>
            
            {/* Stable Google Sign-In Button */}
            <Button
              variant="outlined"
              color="primary"
              startIcon={
                <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <g fill="none" fillRule="evenodd">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </g>
                </svg>
              }
              onClick={handleLogin}
              className="google-signin-button"
              sx={{ 
                py: 1.5, 
                fontWeight: 600, 
                fontSize: '1rem', 
                mb: 2,
                width: { xs: '100%', md: '280px' },
                bgcolor: 'white',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'grey.50',
                  borderColor: 'primary.dark'
                }
              }}
              data-testid="google-signin-button"
              disabled={loading}
            >
              {t('signInWithGoogle')}
            </Button>

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  color="primary"
                  inputProps={{ 'data-testid': 'remember-me-checkbox' }}
                />
              }
              label={t('rememberMe')}
              sx={{ 
                mb: 1, 
                userSelect: 'none',
                alignItems: 'flex-start',
                '& .MuiFormControlLabel-label': {
                  mt: 0.5
                }
              }}
            />
            {/* Make secure auth text plain */}
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="primary.main">
                {t('secureAuth')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ width: { xs: '90%', sm: '80%' }, mt: 4, mb: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          {t('byContinuing')}{' '}
          <Box component="a" href="/terms" color="primary.main" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
            {t('termsOfService')}
          </Box>{' '}
          {t('and')}{' '}
          <Box component="a" href="/privacy" color="primary.main" sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
            {t('privacyPolicy')}
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

export default GoogleLogin; 