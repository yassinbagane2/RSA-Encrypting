import { useState } from "react";
import axios from "axios";
import { Eye, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
const Login = () => {
  const initialState = {
    email: "",
    password: "",
  };
  const [userData, setUserData] = useState(initialState);
  const [isText, setIsText] = useState(false);
  function handleChange(e) {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:8000/login", userData);
      setUserData({ email: "", password: "" });
      toast.success(result.data.message);
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }
  return (
    <div className="min-h-screen bg-zinc-800 flex items-center justify-center text-lg">
      <div className="text-white w-[390px] p-6 rounded-lg bg-[#1f2128]">
        <div className="flex flex-col items-center">
          <img src="earth-icon.svg" alt="earth-icon" className="w-16" />
          <h1 className="text-2xl font-semibold tracking-wide pt-2">
            Welcome back!
          </h1>
          <p className="text-sm text-gray-300">Let's build something great!</p>
        </div>
        <form className="mt-4">
          <label className="text-sm">E-mail or phone number</label>
          <div className="flex items-center w-full border border-gray-700 rounded-lg px-3 mb-4">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              autoComplete="off"
              onChange={handleChange}
              className="bg-inherit border-0 w-full ring-0 outline-none placeholder:text-gray-400 placeholder:text-sm py-2"
            />
            <Mail size={19} />
          </div>
          <label className="text-sm">Password</label>
          <div className="flex items-center w-full border border-gray-700 rounded-lg px-3">
            <input
              type={isText ? "text" : "password"}
              name="password"
              id="password"
              placeholder="Password"
              autoComplete="off"
              onChange={handleChange}
              className="bg-inherit border-0 w-full ring-0 outline-none placeholder:text-gray-400 placeholder:text-sm py-2"
            />
            <Eye onClick={() => setIsText(prev => !prev)} size={20} />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full rounded-lg py-3 mt-4 text-sm bg-indigo-700 hover:bg-indigo-600 duration-200"
          >
            Login
          </button>
        </form>
        <Link to={"/reset"} className="text-sm flex justify-end mt-2">
          Forgot password?
        </Link>
        <div className="text-sm text-center mt-3">
          don't have an account?{" "}
          <Link to={"/signup"} className="text-indigo-500">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
