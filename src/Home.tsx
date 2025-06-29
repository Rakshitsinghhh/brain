import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Home, ClipboardList, FileText, Settings, LogOut } from "lucide-react";

function DashboardHome() {
  const auth = localStorage.getItem("isLoggedIn");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const taskRef = useRef<HTMLTextAreaElement>(null);
  const [tasks, setTasks] = useState<string[]>([]);

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      console.log(data)
      setTasks(data);
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err);
    }
  }


  async function handleTask() {
    const task = taskRef.current?.value;

    if (!task || !userId) {
      alert("Please try again after login/signup.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/addTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, task }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Task added");
        taskRef.current!.value = "";
        fetchTasks();
      } else {
        alert("❌ Task not added");
        console.error("Task not added:", data.error || "Unknown error");
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (auth === "true" && userId) {
      fetchTasks();
    }
  }, [auth, userId]);

  if (auth !== "true") {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You are not authenticated. Please log in.</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">📘 Notes App</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-2 cursor-pointer text-blue-400">
              <Home size={20} />
              Home
            </li>
            <li className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
              <ClipboardList size={20} />
              Tasks
            </li>
            <li className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
              <FileText size={20} />
              Documents
            </li>
            <li className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer">
              <Settings size={20} />
              Settings
            </li>
          </ul>
        </div>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="flex items-center gap-2 text-red-400 hover:text-red-600"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-gray-50 text-black overflow-y-auto">
        <h1 className="text-3xl font-bold text-center mb-6">📝 Notes Dashboard</h1>
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
          <textarea
            ref={taskRef}
            placeholder="Write your note here..."
            className="w-full h-40 p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-6"
            onClick={handleTask}
          >
            Add Note
          </button>

          <h2 className="text-xl font-semibold mb-4">📋 Your Notes</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {tasks.length === 0 ? (
              <p className="text-gray-500">No notes yet.</p>
            ) : (
              tasks.map((item: any, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-200 rounded bg-gray-100"
                >
                  {item.task}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardHome;
