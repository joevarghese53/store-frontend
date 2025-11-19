import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useVerifyEmailOtpMutation, useReSendOtpEmailMutation } from '../redux/api/emailOtpSlice';
import { useRegisterMutation } from '../redux/api/usersApiSlice';
import { useRouter } from 'next/router';
import { clearRegisterData } from '../redux/features/auth/registerSlice';
import styles from '../styles/OtpSubmissionPage.module.css';

const OtpSubmissionPage = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(60);
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);
    const [isResending, setIsResending] = useState(false);
    const { name, email } = useSelector(state => state.register);
    const [verifyOtp] = useVerifyEmailOtpMutation();
    const [reSendOtp] = useReSendOtpEmailMutation();
    const [register] = useRegisterMutation();
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (!email) {
            router.replace('/RegisterPage');
        }
    }, []);

    // Countdown logic for resend timer
    useEffect(() => {
        if (resendTimer > 0) {
            const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [resendTimer]);

    // Update OTP state when digits change
    useEffect(() => {
        setOtp(otpDigits.join(''));
    }, [otpDigits]);

    const handleOtpChange = (e, idx) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        if (!val) return;
        const newDigits = [...otpDigits];
        newDigits[idx] = val;
        setOtpDigits(newDigits);
        // Move to next input
        if (val && idx < 5) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (e, idx) => {
        if (e.key === 'Backspace') {
            if (otpDigits[idx]) {
                // Just clear this field
                const newDigits = [...otpDigits];
                newDigits[idx] = '';
                setOtpDigits(newDigits);
            } else if (idx > 0) {
                // Move to previous
                inputRefs.current[idx - 1]?.focus();
                const newDigits = [...otpDigits];
                newDigits[idx - 1] = '';
                setOtpDigits(newDigits);
            }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
            inputRefs.current[idx - 1]?.focus();
        } else if (e.key === 'ArrowRight' && idx < 5) {
            inputRefs.current[idx + 1]?.focus();
        }
    };

    //Handle OTP Submission 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setInfo('');
        setIsLoading(true);

        if (!otp) {
            setError('Please enter the OTP');
            setIsLoading(false);
            return;
        }

        try {

            //Verify OTP
            await verifyOtp({ email, otp }).unwrap();

            //Register User
            const registerRes = await register({ email: email }).unwrap();

            // Clear Registration data from Redux and add login details
            dispatch(clearRegisterData());
            dispatch(setCredentials({ ...registerRes, accessToken: registerRes.accessToken }));

            //Redirect to Home Page
            router.push('/');

        } catch (err) {

            setError(
                error?.data?.message ||
                error?.error ||
                error?.message ||
                "Something went wrong"
            );

        } finally {

            setIsLoading(false);

        }
    };

    const handleResendOtp = async () => {
        setError('');
        setInfo('');
        setIsResending(true);
        try {
            const sendRes = await reSendOtp({ name, email }).unwrap();
            if (sendRes.success === true) {
                setInfo("OTP resent to your email");
                setResendTimer(60);
            } else {
                throw new Error(sendRes.message || "Failed to resend OTP");
            }
        } catch (err) {
            setError(err?.data?.message || err.message || 'Failed to resend OTP');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className={styles['otp-bg']}>
            <div className={styles['otp-card']}>
                <h2 className={styles['otp-title']}>Enter OTP</h2>
                <p className={styles['otp-subtext']}>
                    We've sent an OTP to <strong>{email}</strong>
                </p>
                {error && <div className={styles['otp-error']}>{error}</div>}
                {info && <div className={styles['otp-info']}>{info}</div>}
                <form onSubmit={handleSubmit} className={styles['otp-form']} autoComplete="off">
                    <div className={styles['otp-input-group']}>
                        {otpDigits.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={el => inputRefs.current[idx] = el}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={1}
                                className={styles['otp-digit-input']}
                                value={digit}
                                onChange={e => handleOtpChange(e, idx)}
                                onKeyDown={e => handleOtpKeyDown(e, idx)}
                                autoFocus={idx === 0}
                                aria-label={`OTP digit ${idx + 1}`}
                            />
                        ))}
                    </div>
                    <button type="submit" className={styles['otp-button']} disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify & Register'}
                    </button>
                </form>
                <div className={styles['otp-resend']}>
                    {resendTimer > 0 ? (
                        <span>Resend OTP in {resendTimer}s</span>
                    ) : (
                        <button className={styles['otp-resend-btn']} onClick={handleResendOtp} disabled={isResending}>
                            {isResending ? 'Resending...' : 'Resend OTP'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OtpSubmissionPage;

