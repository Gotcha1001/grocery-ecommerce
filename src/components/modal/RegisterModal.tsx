"use client";

import { useAuthModal } from "@/store/authModalStore";
import { useState } from "react";
import Modal from "./Modal";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function RegisterModal() {
  const { isRegisterOpen, closeRegister, openLogin } = useAuthModal();

  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      return toast.error("All fields are required!");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters!");
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Registration Failed!");
        return;
      }
      toast.success("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      closeRegister();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    closeRegister();
    openLogin();
  };

  return (
    <Modal isOpen={isRegisterOpen} onClose={closeRegister}>
      <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center">
            <FiUser size={22} />
          </div>
          <h2 className="text-2xl font-semibold text-text">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-muted">
            Join GroceryCart and start shopping today
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="register-name"
              className="mb-2 block text-sm font-medium text-text"
            >
              Full Name
            </label>
            <div className="relative">
              <FiUser
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                id="register-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Full Name"
                className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="register-email"
              className="mb-2 block text-sm font-medium text-text"
            >
              Email Address
            </label>
            <div className="relative">
              <FiMail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="email"
                id="register-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          {/* password */}
          <div>
            <label
              htmlFor="register-password"
              className="mb-2 block text-sm font-medium text-text"
            >
              Password
            </label>
            <div className="relative">
              <FiLock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="password"
                id="register-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create Your Password"
                className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          {/* Register button */}
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-primary py-3 px-3 font-medium text-white transition hover:bg-primary-hover"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{" "}
            <button
              className="cursor-pointer font-medium text-primary hover:underline"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </Modal>
  );
}
