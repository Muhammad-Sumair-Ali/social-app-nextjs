
import { signIn } from "next-auth/react";
import { useState } from "react";

import { useNotification } from "@/components/reuseable/Notification";
import { useRouter } from "next/navigation";
import axios from "axios";



export const  useAuthentication = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      showNotification(result.error, "error");
    } else {
      showNotification("Login successful!", "success");
      router.push("/");
    }
  };



  const handleSocialLogin = async (provider:string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error(error || "Authentication failed");
      setIsLoading(false);
    }
  };

  const [fullName, setFullName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
 

  const checkPasswordStrength = (password: string) => {
    const isStrong = password.length >= 8
    setPasswordStrength(isStrong ? 1 : 0)
  }
  

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    checkPasswordStrength(newPassword)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error")
      setIsLoading(false)
      return
    }

    if (passwordStrength < 3) {
      showNotification("Please use a stronger password", "error")
      setIsLoading(false)
      return
    }

    try {
      const response = await axios.post("/api/auth/register", { email, password ,fullName
      })

      if(response.data){
        showNotification("Registration successful! Please log in.", "success")
      }
      router.push("/login")
    } catch (error) {
      showNotification(error instanceof Error ? error.message : "Registration failed", "error")
    } finally {
      setIsLoading(false)
    }
  }



  return {
    email,setEmail,
    password,setPassword,
    isLoading,
    handleLogin,
    handleSocialLogin,
    handlePasswordChange,
    handleRegister,
    fullName,setFullName,
    showPassword,setShowPassword,
    setConfirmPassword,confirmPassword,
    passwordStrength

  }



}