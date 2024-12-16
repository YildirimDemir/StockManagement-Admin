'use client';

import React, { useState } from 'react'
import Loader from '../ui/Loader';
import { IAdmin } from '@/models/adminModel';
import { createAdmin } from '@/services/apiAdmins';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Style from './admins.module.css'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface CreateAdminProps{
    isOpen: boolean;
    onClose: () => void;
}

interface RegisterForm {
    username: string;
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    userRole: 'admin';
  }

const  CreateAdminModal: React.FC<CreateAdminProps> = ({ isOpen, onClose }) => {

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ password: false, passwordConfirm: false });

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<RegisterForm>();

  const togglePasswordVisibility = (field: 'password' | 'passwordConfirm') => {
    setShowPassword(prevState => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await createAdmin(data);
      toast.success("Admin Created!");
      onClose()
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) return <Loader />;

  return (
    <div className={`${Style.createAdminModal} ${isOpen ? '' : Style.closed}`}>
        <div className={Style.createUserForm}>
        <h2>Create Admin</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={Style.inputGroup}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Enter username..."
              {...register("username", { required: "Username is required." })}
            />
            <p className={Style.errorText}>{errors?.username?.message}</p>
          </div>

          <div className={Style.inputGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              placeholder="Enter name..."
              {...register("name", { required: "Name is required." })}
            />
            <p className={Style.errorText}>{errors?.name?.message}</p>
          </div>

          <div className={Style.inputGroup}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email..."
              {...register("email", {
                required: "Email is required.",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address." }
              })}
            />
            <p className={Style.errorText}>{errors?.email?.message}</p>
          </div>

          <div className={Style.inputGroup}>
            <label htmlFor="password">Password:</label>
            <div className={Style.passInput}>
              <input
                disabled={loading}
                type={showPassword.password ? "text" : "password"}
                id="password"
                placeholder="********"
                {...register("password", {
                  required: "Password is required.",
                  minLength: { value: 8, message: "Password should be at least 8 characters long" }
                })}
              />
              <button type="button" onClick={() => togglePasswordVisibility('password')} className={Style.toggleButton}>
                {showPassword.password ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <p className={Style.errorText}>{errors?.password?.message}</p>
          </div>

          <div className={Style.inputGroup}>
            <label htmlFor="password-confirm">Confirm Password:</label>
            <div className={Style.passInput}>
              <input
                disabled={loading}
                type={showPassword.passwordConfirm ? "text" : "password"}
                id="password-confirm"
                placeholder="********"
                {...register("passwordConfirm", {
                  required: "Please confirm your password.",
                  validate: value => value === getValues().password || "Passwords must match"
                })}
              />
              <button type="button" onClick={() => togglePasswordVisibility('passwordConfirm')} className={Style.toggleButton}>
                {showPassword.passwordConfirm ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
            <p className={Style.errorText}>{errors?.passwordConfirm?.message}</p>
          </div>

          <button className={Style.btn} type="submit" disabled={loading}>Create Admin</button>
        </form>
        </div>
      <button className={Style.closeBtn} onClick={onClose}>
        X
      </button>
    </div>
  )
}

export default CreateAdminModal;