import { useState } from "react";
import axiosInstance from "../../../configs/axiosConfigs"; // Đường dẫn tới cấu hình axios của bạn

export default function UploadExcelForm({ id }: { id: string }) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Vui lòng chọn một file Excel");
      return;
    }

    // Tạo formData để gửi file
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axiosInstance.post(
        `/exam/add-questions/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("File uploaded successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label className="block mb-2">Tải lên file Excel</label>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="border p-1 w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Tải lên
      </button>
    </form>
  );
}
