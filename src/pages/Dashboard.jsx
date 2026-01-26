import PostItem from "../components/PostItem";
import ItemList from "../components/ItemList";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">

      {/* Header */}
      <header className="bg-indigo-700 text-white flex justify-between items-center px-6 py-4 shadow">
        <h1 className="text-2xl font-bold">LOSFER Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user?.email}</span>
          <button
            onClick={() => signOut(auth)}
            className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <PostItem />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <ItemList />
        </div>
      </div>
    </div>
  );
}
