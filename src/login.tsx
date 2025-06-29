import { useRef } from "react";

type LoginProp = {
  onLoginSuccess: () => void;
};

function Login({ onLoginSuccess }: LoginProp) {
  const nameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  async function handleLogin() {
    const name = nameRef.current?.value;
    const password = passRef.current?.value;

    if (!name || !password) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json(); // ✅ Get response body

      if (response.ok && data.userId) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.userId);
        onLoginSuccess(); // ✅ Trigger home screen
      } else {
        alert("❌ Invalid login. Please try again.");
        console.error("Login failed:", data.error || "Unknown error");
      }
    } catch (err) {
      console.error("❌ Server error:", err);
      alert("Server error, please try again later.");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <input
        ref={nameRef}
        placeholder="Enter name"
        className="border p-2 rounded w-64"
      />
      <input
        ref={passRef}
        type="password"
        placeholder="Enter password"
        className="border p-2 rounded w-64"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}

export default Login;
