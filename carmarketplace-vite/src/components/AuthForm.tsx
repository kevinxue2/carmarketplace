import { useState } from "react";

interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (email: string, password: string) => void;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === "signin" ? "Sign In" : "Create Account"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
          >
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === "signin" ? (
            <p>
              Don’t have an account?{" "}
              <a href="/profile/signup" className="text-blue-600 hover:underline">
                Sign Up
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <a href="/profile/signin" className="text-blue-600 hover:underline">
                Sign In
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
