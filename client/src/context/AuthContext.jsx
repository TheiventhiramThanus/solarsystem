import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/firebase";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChangedListener((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.signIn(email, password);
      setUser(loggedUser);
      toast.success(`Welcome back, ${loggedUser.fullName}!`);
      return loggedUser;
    } catch (error) {
      toast.error(error.message || "Failed to sign in.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (fullName, email, password, companyName, role) => {
    setLoading(true);
    try {
      const newUser = await authService.signUp(fullName, email, password, companyName, role);
      setUser(newUser);
      toast.success("Account created successfully!");
      return newUser;
    } catch (error) {
      toast.error(error.message || "Failed to register.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await authService.signOut();
      setUser(null);
      toast.success("Signed out successfully.");
    } catch (error) {
      toast.error("Failed to sign out.");
    } finally {
      setLoading(false);
    }
  };

  const forceDemoUser = (role) => {
    setLoading(true);
    try {
      const demoUser = authService.forceDemoLogin(role);
      if (demoUser) {
        setUser(demoUser);
        toast.success(`Demo Mode: Active as ${demoUser.fullName} (${demoUser.role.toUpperCase()})`);
      } else {
        toast.error("Demo login only available in local simulation mode.");
      }
    } catch (error) {
      toast.error("Failed to force demo user.");
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user?.role === "owner";
  const isOfficer = user?.role === "officer";
  const isAdmin = user?.role === "admin";
  const isSmeUser = isOwner || isOfficer;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        forceDemoUser,
        isOwner,
        isOfficer,
        isAdmin,
        isSmeUser,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
