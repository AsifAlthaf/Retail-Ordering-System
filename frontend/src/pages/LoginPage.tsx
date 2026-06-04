import React, { useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, Collapse,
  FormControl, FormHelperText, IconButton, InputAdornment,
  InputLabel, OutlinedInput, Stack, Typography, Link,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';
import notify from '../utils/notify';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched]         = useState({ email: false, password: false });
  const [loading, setLoading]         = useState(false);
  const [loginError, setLoginError]   = useState('');

  const emailError    = touched.email    ? validateEmail(email) : '';
  const passwordError = touched.password ? validatePassword(password) : '';
  const isValid       = !validateEmail(email) && !validatePassword(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setLoginError('');
    if (!isValid) return;
    try {
      setLoading(true);
      await login(email, password);
      notify.success('Welcome back!');
      navigate('/');
    } catch (err: any) {
      setLoginError(err?.message ?? 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-bg">
      <Box
        sx={{
          width: '100%',
          maxWidth: 920,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          animation: 'scaleIn 0.4s ease both',
        }}
      >
        {/* Left panel — branding */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 5,
            background: 'linear-gradient(145deg, #0d1421 0%, #111827 40%, #1a1040 100%)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative blobs */}
          <Box sx={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(99,102,241,0.12)', filter: 'blur(40px)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(139,92,246,0.10)', filter: 'blur(36px)', pointerEvents: 'none' }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 6 }}>
              <Box
                sx={{
                  width: 38, height: 38, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 900, fontSize: 16, color: '#fff',
                  boxShadow: '0 0 20px rgba(99,102,241,0.5)',
                }}
              >
                R
              </Box>
              <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                RetailOS
              </Typography>
            </Box>

            <Typography variant="overline" sx={{ color: '#6366f1', letterSpacing: '0.12em', fontSize: 10.5 }}>
              OPERATIONS PLATFORM
            </Typography>
            <Typography variant="h3" sx={{ mt: 1, color: '#f1f5f9', fontWeight: 900, lineHeight: 1.15, fontSize: { md: '28px', lg: '34px' } }}>
              Manage every order,<br />product & coupon
            </Typography>
            <Typography sx={{ mt: 2, color: '#64748b', fontSize: 14, lineHeight: 1.75, maxWidth: 340 }}>
              Real-time order tracking, inventory control, and discount management — built for retail teams that move fast.
            </Typography>

            {/* Feature list */}
            <Stack spacing={1.5} sx={{ mt: 4 }}>
              {['Role-based access control', 'Live inventory management', 'Coupon & discount engine', 'Email order notifications'].map(f => (
                <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{f}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Typography sx={{ fontSize: 11, color: '#334155', position: 'relative', zIndex: 1 }}>
            Secured with JWT · RetailOS v2
          </Typography>
        </Box>

        {/* Right panel — form */}
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            background: '#111827',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.25, mb: 4 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>R</Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>RetailOS</Typography>
          </Box>

          <Box sx={{ mb: 0.5 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <LockOutlinedIcon sx={{ fontSize: 18, color: '#6366f1' }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#f1f5f9', fontWeight: 800 }}>Welcome back</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13.5, color: '#64748b' }}>
              Sign in to your account to continue
            </Typography>
          </Box>

          <Collapse in={!!loginError} unmountOnExit sx={{ mt: 2 }}>
            <Alert severity="error" onClose={() => setLoginError('')} sx={{ mb: 0 }}>
              {loginError}
            </Alert>
          </Collapse>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <Stack spacing={2.25}>
              <FormControl fullWidth error={!!emailError}>
                <InputLabel htmlFor="login-email">Email address</InputLabel>
                <OutlinedInput
                  id="login-email"
                  label="Email address"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setLoginError(''); }}
                  onBlur={() => setTouched(t => ({ ...t, email: true }))}
                />
                {emailError && <FormHelperText>{emailError}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={!!passwordError}>
                <InputLabel htmlFor="login-password">Password</InputLabel>
                <OutlinedInput
                  id="login-password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(v => !v)} edge="end" size="small">
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {passwordError && <FormHelperText>{passwordError}</FormHelperText>}
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={!loading ? <ArrowForwardIcon /> : undefined}
                fullWidth
                sx={{ mt: 0.5, py: 1.4 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
              </Button>
            </Stack>
          </Box>

          <Typography sx={{ mt: 3, fontSize: 13.5, color: '#64748b', textAlign: 'center' }}>
            New here?{' '}
            <Link
              component="button"
              type="button"
              onClick={e => { e.preventDefault(); navigate('/signup'); }}
              sx={{ fontWeight: 700, color: '#6366f1', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Create an account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
