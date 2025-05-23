import { useState } from "react";
import Modal from "../components/Modal";

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    student_id: "",
    role: "student", // You can use a <select> dropdown if roles vary
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://edumetro.onrender.com/api/users/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            password: formData.password,
            student_id: formData.student_id,
            role: "Student", // Or you can make it dynamic if needed
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let msg = "";
        if (data.detail) {
          msg = data.detail;
        } else if (typeof data === "object") {
          msg = Object.entries(data)
            .map(([key, value]) => `${key}: ${value.join(", ")}`)
            .join(" | ");
        } else {
          msg = "Registration failed";
        }

        setError(msg);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
        student_id: "",
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

      {error && <div className="mb-4 font-semibold text-red-600">{error}</div>}
      {success && (
        <div className="mb-4 font-semibold text-green-600">
          Verification email sent. Please check your inbox.
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
        <select name="role"  value={formData.role} onChange={handleChange} required className="w-full px-3 py-2 border rounded">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>


        
        <input
          type="text"
          name="student_id"
          placeholder="Student ID (e.g., 222-115-141)"
          value={formData.student_id}
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

        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
