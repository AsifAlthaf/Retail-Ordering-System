import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validation';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const emailError = touched.email ? validateEmail(email) : '';
  const passwordError = touched.password ? validatePassword(password) : '';
  const isValid = !validateEmail(email) && !validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setLoginError('');
    if (!isValid) return;

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (err: any) {
      setLoginError(err?.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 3, md: 6 },
        px: 2,
        background: '#ffffff',
      }}
    >
      <Container maxWidth="lg">
        <Card sx={{ borderRadius: 0, overflow: 'hidden', border: '1px solid #d0d0d0', boxShadow: 'none' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' } }}>
            <Box
              sx={{
                minHeight: { xs: 220, md: 620 },
                p: { xs: 3, md: 5 },
                color: 'white',
                backgroundImage: 'linear-gradient(145deg, rgba(0, 0, 0, 0.84), rgba(0, 0, 0, 0.74)), url(https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 2.2, opacity: 0.9 }}>
                  RETAIL OS
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, lineHeight: 1.15, fontWeight: 900 }}>
                  Trusted retail ordering for real operations.
                </Typography>
                <Typography sx={{ mt: 2, maxWidth: 420, opacity: 0.9 }}>
                  Manage products, orders, and coupons with reliable order history and live status updates.
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Secure sign-in powered by JWT.
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                Welcome back
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Sign in to access your dashboard and track every order.
              </Typography>

              <Collapse in={!!loginError} unmountOnExit>
                <Alert severity="error" onClose={() => setLoginError('')} sx={{ mb: 2 }}>
                  {loginError}
                </Alert>
              </Collapse>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={2.2}>
                  <FormControl fullWidth error={!!emailError}>
                    <InputLabel htmlFor="login-email">Email</InputLabel>
                    <OutlinedInput
                      id="login-email"
                      label="Email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setLoginError('');
                      }}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      autoComplete="email"
                    />
                    {emailError && <FormHelperText>{emailError}</FormHelperText>}
                  </FormControl>

                  <FormControl fullWidth error={!!passwordError}>
                    <InputLabel htmlFor="login-password">Password</InputLabel>
                    <OutlinedInput
                      id="login-password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setLoginError('');
                      }}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      autoComplete="current-password"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                            {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
                  </FormControl>

                  <Button type="submit" variant="contained" size="large" disabled={loading} endIcon={!loading ? <ArrowForwardIcon /> : undefined}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
                  </Button>
                </Stack>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                New customer?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/signup');
                  }}
                  sx={{ fontWeight: 700 }}
                >
                  Create your account
                </Link>
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
