import { useState, ChangeEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import "tailwindcss/tailwind.css"; // Import Tailwind CSS

export interface CsvRow {
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

function App() {
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        await axios.post("https://testbackend-fygr.onrender.com/api/files", formData);
        loadCsvData();
        setSelectedFile(null); // Clear selected file after upload
        toast.success("File Upload Success!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      } catch (error) {
        console.error("File upload failed:", error);
        toast.error("File upload failed!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 2000,
        });
      }
    }
  };

  const loadCsvData = async () => {
    try {
      const response = await axios.get("https://testbackend-fygr.onrender.com/api/users");
      setCsvData(response.data.data);
    } catch (error) {
      console.error("Failed to load CSV data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://testbackend-fygr.onrender.com/api/users?q=${searchTerm}`
      );
      setCsvData(response.data.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-500 p-4">
      <ToastContainer />
      <label htmlFor="file-upload" className="text-black">
        Select a File
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={handleFileSelection}
        className="mb-4"
      />

      <button
        onClick={handleFileUpload}
        className={`mb-4 px-4 py-2 rounded-md ${
          selectedFile
            ? "bg-green-500 text-white"
            : "bg-gray-400 text-gray-600 cursor-not-allowed"
        }`}
        disabled={!selectedFile}
      >
        Upload File
      </button>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded-md border"
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {csvData.map((row: CsvRow, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-md transition-all hover:shadow-lg hover:scale-105"
          >
            <div>
              <strong>Name:</strong> {row.name}
            </div>
            <div>
              <strong>City:</strong> {row.city}
            </div>
            <div>
              <strong>Country:</strong> {row.country}
            </div>
            <div>
              <strong>Favorite Sport:</strong> {row.favorite_sport}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
