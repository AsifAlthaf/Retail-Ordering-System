import React, { useMemo, useState } from 'react';
import {
  Alert, Box, Button, CircularProgress, Collapse,
  FormControl, FormHelperText, IconButton, InputAdornment,
  InputLabel, Link, OutlinedInput, Stack, TextField, Typography,
  LinearProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validateEmail, getPasswordRuleResults, isPasswordValid } from '../utils/validation';
import notify from '../utils/notify';

interface SignUpForm {
  name: string; email: string; phone: string;
  address: string; city: string; state: string;
  postalCode: string; password: string; confirmPassword: string;
}

const INITIAL_FORM: SignUpForm = {
  name: '', email: '', phone: '',
  address: '', city: '', state: '',
  postalCode: '', password: '', confirmPassword: '',
};

export default function SignUpPage() {
  const { signup } = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]             = useState<SignUpForm>(INITIAL_FORM);
  const [loading, setLoading]       = useState(false);
  const [signupError, setSignupError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [submitted, setSubmitted]       = useState(false);

  const passwordRules = useMemo(() => getPasswordRuleResults(form.password), [form.password]);
  const passwordStrength = passwordRules.filter(r => r.met).length; // 0–5
  const strengthColor = passwordStrength <= 1 ? '#ef4444' : passwordStrength <= 3 ? '#f59e0b' : '#10b981';
  const strengthLabel = passwordStrength === 0 ? '' : passwordStrength <= 2 ? 'Weak' : passwordStrength <= 3 ? 'Fair' : passwordStrength === 4 ? 'Good' : 'Strong';

  const errors = useMemo(() => {
    const e: Partial<Record<keyof SignUpForm, string>> = {};
    if (!form.name.trim())                              e.name = 'Full name is required.';
    const emailErr = validateEmail(form.email);
    if (emailErr)                                       e.email = emailErr;
    if (!/^\d{10}$/.test(form.phone.trim()))            e.phone = 'Phone must be 10 digits.';
    if (form.address.trim().length < 8)                 e.address = 'Address must be at least 8 characters.';
    if (!form.city.trim())                              e.city = 'City is required.';
    if (!form.state.trim())                             e.state = 'State is required.';
    if (!/^\d{6}$/.test(form.postalCode.trim()))        e.postalCode = 'Postal code must be 6 digits.';
    if (!isPasswordValid(form.password))                e.password = 'Password does not meet requirements.';
    if (form.confirmPassword !== form.password)         e.confirmPassword = 'Passwords do not match.';
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const setField = <K extends keyof SignUpForm>(key: K, value: SignUpForm[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSignupError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!isValid) { notify.warning('Please correct the highlighted fields.'); return; }
    try {
      setLoading(true);
      await signup({
        name: form.name.trim(), email: form.email.trim(),
        password: form.password, phone: form.phone.trim(),
        address: form.address.trim(), city: form.city.trim(),
        state: form.state.trim(), postalCode: form.postalCode.trim(),
      });
      notify.success('Account created! Welcome aboard.');
      navigate('/shop');
    } catch (err: any) {
      setSignupError(err?.message ?? 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key: keyof SignUpForm) => submitted ? errors[key] : undefined;

  return (
    <Box className="auth-bg" sx={{ alignItems: 'flex-start', py: 3 }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 960,
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '340px 1fr' },
          animation: 'scaleIn 0.4s ease both',
        }}
      >
        {/* Left brand panel */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            justifyContent: 'space-between',
            p: 4.5,
            background: 'linear-gradient(145deg, #0d1421 0%, #111827 40%, #1a1040 100%)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ position: 'absolute', top: -80, right: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(139,92,246,0.10)', filter: 'blur(50px)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 5 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '9px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 15, color: '#fff', boxShadow: '0 0 18px rgba(99,102,241,0.4)' }}>R</Box>
              <Typography sx={{ fontSize: 17, fontWeight: 800, color: '#f1f5f9' }}>RetailOS</Typography>
            </Box>
            <Typography variant="overline" sx={{ color: '#6366f1', letterSpacing: '0.12em', fontSize: 10.5 }}>CREATE YOUR ACCOUNT</Typography>
            <Typography variant="h5" sx={{ mt: 1, color: '#f1f5f9', fontWeight: 800, lineHeight: 1.25 }}>Start shopping with full order tracking</Typography>
            <Typography sx={{ mt: 2, color: '#64748b', fontSize: 13.5, lineHeight: 1.7 }}>
              Fill in your profile and delivery details once. All future orders are linked to your account with live status updates.
            </Typography>
            <Stack spacing={1.5} sx={{ mt: 4 }}>
              {['Auto-filled delivery details', 'Live order status tracking', 'Coupon & discount support', 'Order history & reorder'].map(f => (
                <Box key={f} sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box sx={{ width: 18, height: 18, borderRadius: '5px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CheckIcon sx={{ fontSize: 11, color: '#10b981' }} />
                  </Box>
                  <Typography sx={{ fontSize: 13, color: '#94a3b8', fontWeight: 500 }}>{f}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
          <Typography sx={{ fontSize: 11, color: '#334155', position: 'relative', zIndex: 1 }}>Secured with JWT · RetailOS v2</Typography>
        </Box>

        {/* Right form */}
        <Box sx={{ p: { xs: 3, md: 4 }, background: '#111827' }}>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#f1f5f9', mb: 0.5 }}>Create your account</Typography>
          <Typography sx={{ fontSize: 13.5, color: '#64748b', mb: 3 }}>Fill in your details for accurate delivery and notifications.</Typography>

          <Collapse in={!!signupError} unmountOnExit>
            <Alert severity="error" onClose={() => setSignupError('')} sx={{ mb: 2 }}>{signupError}</Alert>
          </Collapse>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2}>
              {/* Row 1: Name */}
              <TextField
                label="Full name" value={form.name}
                onChange={e => setField('name', e.target.value)}
                error={!!fieldError('name')} helperText={fieldError('name')} fullWidth
              />

              {/* Row 2: Email + Phone */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField
                  label="Email" value={form.email}
                  onChange={e => setField('email', e.target.value)}
                  error={!!fieldError('email')} helperText={fieldError('email')}
                />
                <TextField
                  label="Phone" value={form.phone}
                  onChange={e => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  error={!!fieldError('phone')} helperText={fieldError('phone')}
                  inputProps={{ inputMode: 'numeric' }}
                />
              </Box>

              {/* Row 3: Address */}
              <TextField
                label="Address line" value={form.address}
                onChange={e => setField('address', e.target.value)}
                error={!!fieldError('address')} helperText={fieldError('address')} fullWidth
              />

              {/* Row 4: City + State + Postal */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 2 }}>
                <TextField label="City" value={form.city} onChange={e => setField('city', e.target.value)} error={!!fieldError('city')} helperText={fieldError('city')} />
                <TextField label="State" value={form.state} onChange={e => setField('state', e.target.value)} error={!!fieldError('state')} helperText={fieldError('state')} />
                <TextField
                  label="Postal code" value={form.postalCode}
                  onChange={e => setField('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  error={!!fieldError('postalCode')} helperText={fieldError('postalCode')}
                  inputProps={{ inputMode: 'numeric' }}
                />
              </Box>

              {/* Row 5: Password */}
              <Box>
                <FormControl fullWidth error={!!fieldError('password')}>
                  <InputLabel htmlFor="signup-password">Password</InputLabel>
                  <OutlinedInput
                    id="signup-password" label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setField('password', e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(v => !v)} edge="end" size="small">
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  {fieldError('password') && <FormHelperText>{fieldError('password')}</FormHelperText>}
                </FormControl>

                {/* Password strength bar */}
                {form.password && (
                  <Box sx={{ mt: 1 }}>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 0.75 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Box
                          key={i}
                          sx={{
                            flex: 1, height: 3, borderRadius: 99,
                            background: i <= passwordStrength ? strengthColor : 'rgba(255,255,255,0.08)',
                            transition: 'background 250ms ease',
                          }}
                        />
                      ))}
                    </Box>
                    <Typography sx={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</Typography>
                    <Stack spacing={0.25} sx={{ mt: 0.75 }}>
                      {passwordRules.map(r => (
                        <Box key={r.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: r.met ? '#10b981' : '#334155', flexShrink: 0, transition: 'background 250ms ease' }} />
                          <Typography sx={{ fontSize: 11, color: r.met ? '#10b981' : '#475569', fontWeight: r.met ? 600 : 400, transition: 'color 250ms ease' }}>{r.label}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>

              {/* Row 6: Confirm */}
              <FormControl fullWidth error={!!fieldError('confirmPassword')}>
                <InputLabel htmlFor="signup-confirm">Confirm password</InputLabel>
                <OutlinedInput
                  id="signup-confirm" label="Confirm password"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={e => setField('confirmPassword', e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirm(v => !v)} edge="end" size="small">
                        {showConfirm ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {fieldError('confirmPassword') && <FormHelperText>{fieldError('confirmPassword')}</FormHelperText>}
              </FormControl>

              <Button type="submit" variant="contained" size="large" disabled={loading} fullWidth sx={{ py: 1.4 }}>
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Account'}
              </Button>
            </Stack>
          </Box>

          <Typography sx={{ mt: 3, fontSize: 13.5, color: '#64748b', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link
              component="button" type="button"
              onClick={e => { e.preventDefault(); navigate('/login'); }}
              sx={{ fontWeight: 700, color: '#6366f1', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
