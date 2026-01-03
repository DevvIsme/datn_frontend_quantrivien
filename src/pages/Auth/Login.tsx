import axios from "axios";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthCookies } from "../../hooks/useToken";

import { api_url } from "../../configs/environments";
import { useUser } from "../../hooks/UserContext";

export default function Login() {
  const { setAuthTokens } = useAuthCookies();
  const { fetchUserInfo } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    loginUser(email, password);
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${api_url}/api/auth/admin/`, {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data.data;
      setAuthTokens(accessToken, refreshToken);
      await fetchUserInfo();
      navigate("/");
    } catch (error: any) {
      setError(error.response.data.error);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="********"
            required
          />
        </div>
        {/* Error Message */}
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
        <div className="flex items-center justify-between mb-6">
          <a
            href="/auth/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Login
        </button>
      </form>
    </>
  );
}
