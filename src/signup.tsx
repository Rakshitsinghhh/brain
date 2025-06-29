import { useRef } from "react";

type SignupProps = {
  onSignUpSuccess: () => void;
};

function Signup({ onSignUpSuccess }: SignupProps) {
  const nameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);

  async function handleSignup() {
    const name = nameRef.current?.value;
    const password = passRef.current?.value;

    if (!name || !password) {
      alert("Please fill in both name and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (response.ok && data.userId) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", data.userId); // ✅ Save userId
        onSignUpSuccess(); // 🔁 Switch to Home
      } else {
        alert("❌ Signup failed");
        console.error("Signup error:", data?.error || "Unknown error");
      }
    } catch (err) {
      alert("❌ Server error, try again later.");
      console.error("Server error:", err);
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
        onClick={handleSignup}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Submit
      </button>
    </div>
  );
}

export default Signup;
