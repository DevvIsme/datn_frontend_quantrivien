import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// @ts-ignore
import { ArrowLeftIcon } from "@heroicons/react/solid";
import QuestionList from "../../components/Questions/QuestionList";
import axiosInstance from "axios";

const QuestionManagerIndex = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [examName, setExamName] = useState<string>("");

    // (Tuỳ chọn) Gọi API lấy thông tin bài thi để hiển thị tên cho đẹp
    // Nếu bạn không cần hiển thị tên bài thi ở header thì có thể bỏ useEffect này


    return (
          
            <QuestionList  />
    );
};

export default QuestionManagerIndex;