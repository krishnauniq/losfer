import Login from "../components/Login";
import Signup from "../components/Signup";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">LOSFER</h1>
        <p className="text-center text-gray-500">College Lost & Found Portal</p>

        <Signup />
        <div className="border-t pt-4">
          <Login />
        </div>
      </div>
    </div>
  );
}
