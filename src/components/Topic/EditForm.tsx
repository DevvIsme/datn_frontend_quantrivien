import { useState } from "react";
import { Topic } from "../../interfaces/Topic.interface";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axiosInstance from "../../configs/axiosConfigs";

export default function EditTopicForm({ topic }: { topic: Topic }) {
  const [name, setName] = useState(topic.name);
  const [description, setDescription] = useState(topic.description);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = {
        name,
        description,
      };
      await axiosInstance.put(`/topic/update/${topic.id}`, formData);
      alert("Sửa chủ đề thành công!");
      window.location.reload();
    } catch (error: any) {
      alert(error?.response.data.error);
    }
  };

  return (
    // SỬA: Tăng padding từ p-1 lên p-6
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto p-6 bg-white">
      <div className="space-y-6">

        {/* Input Tên chủ đề */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tên chủ đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
          />
        </div>

        {/* CKEditor Mô tả */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Mô Tả
          </label>
          <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all shadow-sm">
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <CKEditor
                editor={ClassicEditor}
                data={description}
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "fontSize",
                    "fontFamily",
                    "bulletedList",
                    "numberedList",
                    "|",
                    "link",
                    "blockQuote",
                    "insertTable",
                    "|",
                    "undo",
                    "redo",
                  ],
                  fontSize: {
                    options: [9, 11, 13, "default", 17, 19, 21],
                  },
                  fontFamily: {
                    options: [
                      "default",
                      "Arial, Helvetica, sans-serif",
                      "Courier New, Courier, monospace",
                      "Georgia, serif",
                      "Lucida Sans Unicode, Lucida Grande, sans-serif",
                      "Tahoma, Geneva, sans-serif",
                      "Times New Roman, Times, serif",
                      "Trebuchet MS, Helvetica, sans-serif",
                      "Verdana, Geneva, sans-serif",
                    ],
                  },
                }}
                onChange={(event: any, editor: any) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}