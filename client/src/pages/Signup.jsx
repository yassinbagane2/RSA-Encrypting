import { useState } from "react";
import axios from "axios";
import { Eye, Mail, User } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const initialState = {
    name: "",
    email: "",
    password: "",
  };
  const [userData, setUserData] = useState(initialState);
  const navigate = useNavigate();
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
      const result = await axios.post("http://localhost:8000/signup", userData);
      setUserData({ name: "", email: "", password: "" });
      toast.success(result.data.message);
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error);
    }
  }
  return (
    <div className="min-h-screen bg-zinc-800 flex items-center justify-center text-lg">
      <div className="text-white w-[390px] p-6 rounded-lg bg-[#1f2128]">
        <div className="flex flex-col items-center">
          <img src="earth-icon.svg" alt="earth-icon" className="w-16" />
          <h1 className="text-2xl font-semibold tracking-wide pt-2">
            Create An Account
          </h1>
          <p className="text-sm text-gray-300">Let's build something great!</p>
        </div>
        <form className="mt-4">
          <label className="text-sm">Your name</label>
          <div className="flex items-center w-full border border-gray-700 rounded-lg px-3 mb-4">
            <input
              type="name"
              name="name"
              id="name"
              autoComplete="off"
              placeholder="Full name"
              value={userData.name}
              onChange={handleChange}
              className="bg-inherit border-0 w-full ring-0 outline-none placeholder:text-gray-400 placeholder:text-sm py-2"
            />
            <User size={20} />
          </div>
          <label className="text-sm">E-mail or phone number</label>
          <div className="flex items-center w-full border border-gray-700 rounded-lg px-3 mb-4">
            <input
              type="email"
              name="email"
              id="email"
              value={userData.email}
              placeholder="Email"
              autoComplete="off"
              onChange={handleChange}
              className="bg-inherit border-0 w-full ring-0 outline-none placeholder:text-gray-400 placeholder:text-sm py-2"
            />
            <Mail size={20} />
          </div>
          <label className="text-sm">Password</label>
          <div className="flex items-center w-full border border-gray-700 rounded-lg px-3 mb-3">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              className="bg-inherit border-0 w-full ring-0 outline-none placeholder:text-gray-400 placeholder:text-sm py-2"
            />
            <Eye size={20} />
          </div>
          <label className="text-sm">Confirm password</label>
          <div className="flex items-center w-full border border-gray-700 rounded-lg px-3">
            <input
              type="password"
              name="cpassword"
              id="cpassword"
              placeholder="Password"
              className="bg-inherit border-0 w-full ring-0 outline-none placeholder:text-gray-400 placeholder:text-sm py-2"
            />
            <Eye size={20} />
          </div>
          <button
            onClick={handleSubmit}
            className="w-full rounded-lg py-3 mt-4 text-sm bg-indigo-700 hover:bg-indigo-600 duration-200"
          >
            Create account
          </button>
        </form>
        <div className="text-sm text-center mt-3">
          Already have an account?{" "}
          <Link to={"/login"} className="text-indigo-500">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
