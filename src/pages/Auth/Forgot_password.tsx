import { FormEvent, useState } from "react";
import axiosInstance from "../../configs/axiosConfigs";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false); // To track the request status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // To track form submission

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Disable the button

    try {
      const response = await axiosInstance.post("/admin/forgot-password", {
        origin: "http://localhost:3000",
        email,
      });

      if (response.status === 200) {
        setSuccess(true); // Mark the request as successful
      }
    } catch (err: any) {
      setError(err.response.data.error);
      console.error(err.response.data.error); // Log the error for debugging
    } finally {
      setLoading(false); // Re-enable the button after request completes
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      {!success ? (
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading} // Disable the button when loading is true
          >
            {loading ? "Sending..." : "Send request"}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-green-600">
            Request successful! You can now{" "}
            <a href="/auth/login" className="text-blue-600 underline">
              login here
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
}
