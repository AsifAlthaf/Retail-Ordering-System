import React, { useMemo, useState } from 'react';
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
  TextField,
  Typography,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validation';

interface SignUpForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  password: string;
  confirmPassword: string;
}

const INITIAL_FORM: SignUpForm = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  password: '',
  confirmPassword: '',
};

export default function SignUpPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const errors = useMemo(() => {
    const result: Partial<Record<keyof SignUpForm, string>> = {};
    if (!form.name.trim()) result.name = 'Full name is required.';
    const emailError = validateEmail(form.email);
    if (emailError) result.email = emailError;
    if (!/^\d{10}$/.test(form.phone.trim())) result.phone = 'Phone must be 10 digits.';
    if (!form.address.trim() || form.address.trim().length < 8) result.address = 'Address must be at least 8 characters.';
    if (!form.city.trim()) result.city = 'City is required.';
    if (!form.state.trim()) result.state = 'State is required.';
    if (!/^\d{6}$/.test(form.postalCode.trim())) result.postalCode = 'Postal code must be 6 digits.';
    const passwordError = validatePassword(form.password);
    if (passwordError) result.password = passwordError;
    if (form.confirmPassword !== form.password) result.confirmPassword = 'Passwords do not match.';
    return result;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const setField = <K extends keyof SignUpForm>(key: K, value: SignUpForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSignupError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isValid) {
      toast.warning('Please correct the highlighted fields.');
      return;
    }

    try {
      setLoading(true);
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        postalCode: form.postalCode.trim(),
      });
      toast.success('Account created successfully');
      navigate('/shop');
    } catch (err: any) {
      setSignupError(err?.message ?? 'Failed to create account. Please try again.');
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
        <Card sx={{ borderRadius: 0, border: '1px solid #d0d0d0', boxShadow: 'none' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' } }}>
            <Box
              sx={{
                minHeight: { xs: 220, md: 700 },
                p: { xs: 3, md: 5 },
                color: 'white',
                backgroundImage: 'linear-gradient(150deg, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.72)), url(https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1400&q=80)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography variant="overline" sx={{ letterSpacing: 2.2, opacity: 0.9 }}>
                  CREATE ACCOUNT
                </Typography>
                <Typography variant="h3" sx={{ mt: 1, lineHeight: 1.15, fontWeight: 900 }}>
                  Start shopping with full order tracking.
                </Typography>
                <Typography sx={{ mt: 2, maxWidth: 420, opacity: 0.92 }}>
                  Add your profile and delivery details once. Your future orders and status history stay linked to your account.
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.82 }}>
                Production-ready signup with contact and address fields.
              </Typography>
            </Box>

            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                Fill your details to enable accurate delivery and notifications.
              </Typography>

              <Collapse in={!!signupError} unmountOnExit>
                <Alert severity="error" onClose={() => setSignupError('')} sx={{ mb: 2 }}>
                  {signupError}
                </Alert>
              </Collapse>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(12, minmax(0, 1fr))' }, gap: 1.5 }}>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <TextField label="Full name" value={form.name} onChange={(e) => setField('name', e.target.value)} error={!!errors.name} helperText={errors.name} fullWidth />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <TextField label="Email" value={form.email} onChange={(e) => setField('email', e.target.value)} error={!!errors.email} helperText={errors.email} fullWidth />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <TextField label="Phone" value={form.phone} onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} error={!!errors.phone} helperText={errors.phone} fullWidth />
                  </Box>
                  <Box sx={{ gridColumn: '1 / -1' }}>
                    <TextField label="Address line" value={form.address} onChange={(e) => setField('address', e.target.value)} error={!!errors.address} helperText={errors.address} fullWidth />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
                    <TextField label="City" value={form.city} onChange={(e) => setField('city', e.target.value)} error={!!errors.city} helperText={errors.city} fullWidth />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
                    <TextField label="State" value={form.state} onChange={(e) => setField('state', e.target.value)} error={!!errors.state} helperText={errors.state} fullWidth />
                  </Box>
                  <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 4' } }}>
                    <TextField label="Postal code" value={form.postalCode} onChange={(e) => setField('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))} error={!!errors.postalCode} helperText={errors.postalCode} fullWidth />
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <FormControl fullWidth error={!!errors.password}>
                      <InputLabel htmlFor="signup-password">Password</InputLabel>
                      <OutlinedInput
                        id="signup-password"
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={form.password}
                        onChange={(e) => setField('password', e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                              {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                    </FormControl>
                  </Box>

                  <Box sx={{ gridColumn: { xs: '1 / -1', md: 'span 6' } }}>
                    <FormControl fullWidth error={!!errors.confirmPassword}>
                      <InputLabel htmlFor="signup-confirm-password">Confirm password</InputLabel>
                      <OutlinedInput
                        id="signup-confirm-password"
                        label="Confirm password"
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={(e) => setField('confirmPassword', e.target.value)}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirm((v) => !v)} edge="end">
                              {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      {errors.confirmPassword && <FormHelperText>{errors.confirmPassword}</FormHelperText>}
                    </FormControl>
                  </Box>
                </Box>

                <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ mt: 2.25 }} fullWidth>
                  {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
                </Button>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2.5 }}>
                Already have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                  sx={{ fontWeight: 700 }}
                >
                  Sign in
                </Link>
              </Typography>
            </CardContent>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
