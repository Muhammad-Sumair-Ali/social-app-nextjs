import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export const useAuthentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error(result.error || "error logging in");
    } else {
      toast.success("Login successfull!");
      router.push("/");
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
      toast.success("Login successfull!");
    } catch {
      toast.error("Authentication failed");
      setIsLoading(false);
    }
  };

  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 1;

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 1;

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 1;

    // Contains numbers
    if (/[0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !fullName) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 2) {
      toast.error("Please use a stronger password");
      setIsLoading(false);
      return;
    }

    try {
        await axios.post("/api/auth/register", {
        email,
        password,
        fullName,
      });

      toast.success("Registration successful! Please log in.");
      router.push("/login");

    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.message || "Registration failed";
      toast.error(errorMessage || "Registration error");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    handleLogin,
    handleSocialLogin,
    handlePasswordChange,
    handleRegister,
    fullName,
    setFullName,
    showPassword,
    setShowPassword,
    setConfirmPassword,
    confirmPassword,
    passwordStrength,
  };
};
