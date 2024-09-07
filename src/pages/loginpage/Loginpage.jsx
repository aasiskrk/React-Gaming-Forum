import React, { useState } from "react";
import { loginUserApi } from "../../apis/Api";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import dedsec from '../../assets/images/dedsec.jpg'

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState();
  const [passwordError, setPasswordError] = useState();

  const navigate = useNavigate();
  const validation = () => {
    let isValid = true;
    if (email === "" || email.includes("@" === false)) {
      setEmailError("Email is Empty or Invalid");
      isValid = false;
    }
    if (password.trim() === "") {
      setPasswordError("Please enter Password");
      isValid = false;
    }
    return isValid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validation()) {
      return;
    }
    const data = {
      email: email,
      password: password,
    };
    loginUserApi(data).then((res) => {
      if (res.data.success === false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        localStorage.setItem('token', res.data.token);
        const convertedData = JSON.stringify(res.data.userData);
        localStorage.setItem('user', convertedData);
        navigate('/')
      }
    });
  };

  return (
    <>
      <section className="relative flex flex-col lg:flex-row lg:h-screen lg:items-center lg:bg-geda2 bg-geda2">
        <div className="w-full px-4 py-12 sm:px-6 sm:py-16 lg:w-1/2 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="text-2xl font-bold sm:text-3xl text-white">🎮 Login!</h1>
          </div>
          <form onSubmit={handleLogin} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
            <div>
              <label className="text-white mb-1 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  className="w-full rounded-lg border-gray-200 p-3 pe-12 text-sm shadow-sm"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="absolute inset-y-0 end-0 grid place-content-center px-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </span>
              </div>
              {emailError && <p className="text-danger text-red-500">{emailError}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <label className="text-white mb-1 ml-1">Password</label>
                <input
                  type="password"
                  className="w-full rounded-lg border-gray-200 p-3 pe-12 text-sm shadow-sm"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {passwordError && <p className="text-danger text-red-500">{passwordError}</p>}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                No account?
                <Link to="/register" className="text-blue-500 underline pl-2">Register</Link>
              </p>
              <p className="text-sm text-gray-500 mb-4 sm:mb-0">
                Forgot
                <Link to="/forgot_password" className="text-blue-500 underline pl-2">Password?</Link>
              </p>
              <button
                type="submit"
                className="inline-block rounded-lg bg-merogreen px-5 py-3 text-sm font-medium text-white"
              >Login</button>
            </div>
          </form>
        </div>
        <div className="relative w-full h-64 sm:h-96 lg:h-full lg:w-1/2">
          <img
            alt="Playforge background"
            src={dedsec}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-60"
          />
        </div>
      </section>
    </>
  );
}

export default Loginpage;