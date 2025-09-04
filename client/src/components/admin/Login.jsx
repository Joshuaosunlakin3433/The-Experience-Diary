import { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { axios, setToken, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        // Fixed: Set proper Authorization header
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success("Login successful!");
        navigate("/admin"); // Navigate to admin dashboard
      } else {
        toast.error(data.message);
        // Clear form on error for better UX
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      toast.error(error.message);
      // Clear form on error for better UX
      setEmail("");
      setPassword("");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Admin</span> Login
            </h1>
            <p className="font-light">
              Enter your credentials to access the admin panel
            </p>
          </div>

          {/* Fixed: Form now wraps all inputs */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-gray-600"
          >
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                id="email"
                placeholder="Enter your email id"
                className="border-b-2 border-gray-300 p-2 outline-0 mb-6"
                required
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                id="password"
                placeholder="your password"
                className="border-b-2 border-gray-300 p-2 outline-0 mb-6"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 font-medium text-white rounded cursor-pointer ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
