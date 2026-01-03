import { useState } from "react";
import { AddExamFormProps } from "../../interfaces/Form.interface";
import axiosInstance from "../../configs/axiosConfigs";

export default function AddDocForm({ onClose, courseId }: AddExamFormProps) {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null); // Video cho bài học

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // eslint-disable-next-line no-restricted-globals
      const isConfirmed = confirm("Xác nhận thêm tài liệu!");
      if (!isConfirmed) {
        return;
      }
      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("file", file); // Thêm file nếu có
      }
      const response = await axiosInstance.post(
        `/material/create-document/${courseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.data); // Hiển thị thông báo từ server
      onClose();
      window.location.reload();
    } catch (error: any) {
      alert(error.response.data.error);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block mb-2">Tên tài liệu</label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border p-1 w-full"
        />
      </div>

      <div>
        <label className="block mb-2">Tài liệu (file)</label>
        <input
          type="file"
          name="file"
          accept=".doc,.docx,.xlsx"
          onChange={handleFileChange}
          required
          className="border p-1 w-full"
          min={10}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Thêm tài liệu
      </button>
    </form>
  );
}
