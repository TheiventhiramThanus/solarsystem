import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { LogIn, UserPlus, Sparkles, ShieldCheck, UserCheck } from "lucide-react";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const { signIn, signUp, forceDemoUser, user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const selectedRole = watch("role", "owner");

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else navigate("/dashboard");
    }
  }, [user, navigate]);



  const onSubmit = async (data) => {
    try {
      if (isRegister) {
        await signUp(data.fullName, data.email, data.password, data.companyName, data.role);
        navigate("/dashboard");
      } else {
        const logged = await signIn(data.email, data.password);
        if (logged.role === "admin") navigate("/admin");
        else navigate("/dashboard");
      }
    } catch (err) {
      // Errors handled inside context toasts
    }
  };

  const handleAdminLogin = async () => {
    try {
      const logged = await signIn('admin@gmail.com', 'password123456');
      if (logged && logged.role === 'admin') navigate('/admin');
    } catch (err) {
      // handle error, maybe toast
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    reset();
  };

  return (
    <div className="min-h-[90vh] py-16 px-4 flex flex-col justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">


      <div className="max-w-xl mx-auto w-full relative z-10">
        
        {/* Main Form */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-xl rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center md:justify-start space-x-2">
                <span>{isRegister ? "Register User" : "Portal Login"}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-2">
                {isRegister 
                  ? "Create your user profile to get started." 
                  : "Sign in to access your dashboard."}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jeneevan Jeyarasa"
                      {...register("fullName", { required: "Name is required" })}
                      className="input-field"
                    />
                    {errors.fullName && <p className="text-red-500 text-xxs mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Solar Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SolarForce UK Ltd"
                      {...register("companyName", { required: "Company name is required" })}
                      className="input-field"
                    />
                    {errors.companyName && <p className="text-red-500 text-xxs mt-1">{errors.companyName.message}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. manager@solarforce.co.uk"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                  })}
                  className="input-field"
                />
                {errors.email && <p className="text-red-500 text-xxs mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Account Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password..."
                  {...register("password", { 
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                  })}
                  className="input-field"
                />
                  {errors.password && <p className="text-red-500 text-xxs mt-1">{errors.password.message}</p>}
                </div>

                {/* Role selection */}
                {isRegister && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Role
                    </label>
                    <select
                      className="input-field"
                      defaultValue="owner"
                      {...register("role", { required: "Role is required" })}
                    >
                      <option value="owner">Owner (SME)</option>
                      <option value="officer">Compliance Officer</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-xxs mt-1">{errors.role.message}</p>}
                  </div>
                )}

              <button
                type="submit"
                className="w-full btn-primary flex items-center justify-center space-x-2 py-3 mt-6 shadow-md shadow-solar-500/15"
              >
                {isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                <span>{isRegister ? "Create Account" : "Login"}</span>
              </button>
            </form>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs">
            <button
              onClick={toggleMode}
              type="button"
              className="font-semibold text-solar-500 hover:text-solar-600 dark:hover:text-solar-400"
            >
              {isRegister ? "Already registered? Sign In instead" : "Need to register? Create Account"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
