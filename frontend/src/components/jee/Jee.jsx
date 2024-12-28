import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import axios from "axios";
import toast from "react-hot-toast";
import { FiDownload } from "react-icons/fi";

const Jee = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSecretsAndInitFirebase = async () => {
      try {
        const { data: firebaseConfig } = await axios.get("/api/notes/secrets");
        initializeApp(firebaseConfig);
        fetchNotes();
      } catch (err) {
        console.error("Error fetching secrets:", err);
        setError("Failed to initialize Firebase");
      }
    };

    fetchSecretsAndInitFirebase();
  }, []);

  const fetchNotes = async () => {
    const storage = getStorage();
    try {
      const folderRef = ref(storage, "jee");
      const res = await listAll(folderRef);

      const fetchedNotes = await Promise.all(
        res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const nameWithoutExtension = itemRef.name
            .replace(/\.[^/.]+$/, "")
            .replace(/_/g, " ");
          return { name: nameWithoutExtension, imageUrl: url };
        })
      );
      fetchedNotes.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true })
      );
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError("Failed to load notes");
    }
  };

  const handleDownload = (url, name) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${name}`);
  };

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">
          Jee
        </h1>

        {/* Responsive Card Layout for Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:hidden">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.name}
                onClick={() => handleDownload(note.imageUrl, note.name)}
                className="cursor-pointer bg-gray-800 rounded-lg shadow-md p-4 transition-transform duration-200"
              >
                <h2 className="text-sm font-semibold text-gray-100">
                  {note.name}
                </h2>
                <div className="flex justify-between mt-4">
                  <span className="text-xs text-gray-300">
                    Tap to download
                  </span>
                  <FiDownload className="text-2xl text-gray-300" />
                </div>
              </div>
            ))
          ) : (
            // Skeleton Loader for Mobile
            Array(6).fill().map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg shadow-md p-4 space-y-4 animate-pulse"
              >
                <div className="h-4 bg-gray-600 w-3/4 rounded"></div>
                <div className="flex justify-between mt-4">
                  <div className="h-2 bg-gray-600 w-1/3 rounded"></div>
                  <div className="h-6 w-6 bg-gray-600 rounded-full"></div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Table Layout for Medium to Large Screens */}
        <div className="hidden md:block mt-8">
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-indigo-400 text-gray-900">
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                    Note Name
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {notes.length > 0 ? (
                  notes.map((note) => (
                    <tr
                      key={note.name}
                      className="cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-center text-gray-100">
                        {note.name}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDownload(note.imageUrl, note.name)}
                          className="bg-indigo-400 hover:bg-indigo-500 text-gray-900 px-4 py-2 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // Skeleton Loader for Table
                  Array(6).fill().map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-6 py-4 text-center w-11/12">
                        <div className="h-4 bg-gray-600 w-3/5 rounded"></div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="h-8 w-24 bg-gray-600 rounded"></div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Jee;