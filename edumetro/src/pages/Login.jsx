import { useState } from "react";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("https://edumetro.onrender.com/api/users/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Login failed");
        return;
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access); // ধরলাম token 'access' নামে আসছে
      setShowModal(true);
    } catch (err) {
      setError("Network error");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    window.location.reload(); // মডাল ক্লোজের সাথে সাথেই রিফ্রেশ
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Login</h2>
      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>

      {showModal && (
        <Modal
          message="Login successful!"
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Login;
