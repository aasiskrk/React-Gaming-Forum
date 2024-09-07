import React, { useState } from 'react';
import { forgotPassowrdApi, verifyOtpApi } from '../../apis/Api';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const ForgotPassword = () => {
    const [phone, setPhone] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');

    const handleForgotPassword = (e) => {
        e.preventDefault();
        forgotPassowrdApi({ phone }).then((res) => {
            if (res.status === 200) {
                toast.success(res.data.message);
                setIsSent(true);
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                toast.error(error.response.data.message);
            }
        });
    };

    const handleVerify = (e) => {
        e.preventDefault();
        const data = { phone, otp, password };
        verifyOtpApi(data).then((res) => {
            if (res.status === 200) {
                toast.success(res.data.message);
            }
        }).catch((error) => {
            if (error.response.status === 400) {
                toast.error(error.response.data.message);
            }
        });
    };

    return (
        <div className='container-fluid d-flex align-items-center justify-content-center vh-100 bg-dark'>
            <div className='card p-4 text-center w-50'>
                <h3>Forgot Password</h3>
                <form className='w-100'>
                    <div className='d-flex mb-3'>
                        <h4>+977</h4>
                        <input
                            disabled={isSent}
                            onChange={(e) => setPhone(e.target.value)}
                            className='form-control ms-2'
                            type="number"
                            placeholder='Enter your valid number'
                        />
                    </div>
                    <button
                        disabled={isSent}
                        onClick={handleForgotPassword}
                        className='btn btn-dark w-100'
                    >
                        Send OTP
                    </button>
                    {isSent && (
                        <>
                            <hr />
                            <span>OTP has been sent to {phone} ✅ </span>
                            <input
                                onChange={(e) => setOtp(e.target.value)}
                                type="text"
                                className='form-control mt-3'
                                placeholder='Enter the OTP'
                            />
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                className='form-control mt-3'
                                placeholder='Set new password'
                            />
                            <button
                                onClick={handleVerify}
                                className='btn btn-primary mt-3 w-100'
                            >
                                Verify OTP & Set Password
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
