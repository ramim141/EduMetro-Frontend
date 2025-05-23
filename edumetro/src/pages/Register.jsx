import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
    student_id: "",
    role: "student",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirm_password) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://edumetro.onrender.com/api/users/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          password: formData.password,
          student_id: formData.student_id,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.detail || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccessMessage("Registration successful! Please check your email for verification.");
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        confirm_password: "",
        student_id: "",
        role: "student",
      });
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md p-4 mx-auto mt-10 border rounded shadow">
      <h2 className="mb-6 text-2xl font-semibold">Register</h2>

      {successMessage && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="password"
          name="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="text"
          name="student_id"
          placeholder="Student ID (e.g. 222-115-141)"
          value={formData.student_id}
          onChange={handleChange}
          pattern="\d{3}-\d{3}-\d{3}"
          title="Format: 222-115-141"
          required
          className="w-full px-3 py-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
