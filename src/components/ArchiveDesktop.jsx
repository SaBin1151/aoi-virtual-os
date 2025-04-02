// ArchiveDesktop component code goes here
// ✅ Full ArchiveDesktop component (paste this into your file)
import { useState, useRef, useEffect } from "react";
import { FolderIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Draggable from "react-draggable";

export default function ArchiveDesktop() {
  const [openApp, setOpenApp] = useState(null);
  const [unlocked, setUnlocked] = useState(false);
  const [booting, setBooting] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [aoiInput, setAoiInput] = useState("");
  const [aoiResponse, setAoiResponse] = useState("Hello! I am Aoi, your archive assistant. How can I help you today?");
  const [mascotFace, setMascotFace] = useState("default");
  const [openedWindows, setOpenedWindows] = useState([]);
  const [classNotes, setClassNotes] = useState([]);
  const [homeworkFiles, setHomeworkFiles] = useState([]);
  const [lectureSlides, setLectureSlides] = useState([]);
  const [examPapers, setExamPapers] = useState([]);

  const sliderRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sliderRef.current || !handleRef.current) return;
    const slider = sliderRef.current;
    const handle = handleRef.current;
    let isDragging = false;
    let startX = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.clientX;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const moveX = e.clientX - startX;
      const sliderWidth = slider.offsetWidth - handle.offsetWidth;
      const newLeft = Math.min(Math.max(0, moveX), sliderWidth);
      handle.style.left = `${newLeft}px`;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      const sliderWidth = slider.offsetWidth - handle.offsetWidth;
      const handleLeft = parseInt(handle.style.left, 10);
      if (handleLeft >= sliderWidth - 10) {
        setUnlocked(true);
      } else {
        handle.style.left = `0px`;
      }
    };

    handle.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      handle.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [unlocked, booting]);

  const gradientBackground = {
    backgroundImage: "linear-gradient(135deg, #dbeafe 0%, #fce7f3 100%)",
  };

  const mascotImg = mascotFace === "default" ? "/aoi-default.png" : "/aoi-poked.png";

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-600 text-3xl font-bold tracking-wider" style={gradientBackground}>
        ⏳ Booting Aoi OS...
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center relative text-white" style={gradientBackground}>
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl text-center">
          <p className="text-xl font-semibold mb-4">🔒 Slide to Unlock</p>
          <div ref={sliderRef} className="relative w-72 h-12 bg-white/30 rounded-full">
            <div
              ref={handleRef}
              className="absolute left-0 top-0 h-12 w-12 bg-white text-black font-bold flex items-center justify-center rounded-full shadow-md cursor-pointer select-none"
              style={{ transition: 'left 0.2s' }}
            >
              →
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black p-6 relative space-y-6" style={gradientBackground}>
      <h1 className="text-3xl font-bold">📁 Ikeda Aoi Archive</h1>
      <p className="text-sm text-black/70">Welcome to the pastel archive of magical knowledge ✨</p>

      <div className="absolute right-4 top-4 cursor-pointer" onClick={() => setUnlocked(false)}>
        🔒 Lock Screen
      </div>

      <div className="relative w-full h-[400px] mt-8">
        {["Class Notes", "Homework", "Lecture Slides", "Exam Papers"].map((app, i) => (
          <Draggable key={i} bounds="parent">
            <div
              className="absolute w-[110px] h-[110px] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform text-center text-black"
              style={{ left: `${60 + i * 130}px`, top: `60px` }}
              onDoubleClick={() => {
                if (!openedWindows.includes(app)) setOpenedWindows(prev => [...prev, app]);
              }}
            >
              <div className="bg-white/80 p-3 rounded-2xl shadow-md">
                <FolderIcon className="w-8 h-8 mb-1" />
              </div>
              <span className="text-xs font-semibold mt-1">{app}</span>
            </div>
          </Draggable>
        ))}
      </div>

      {openedWindows.map((app, index) => (
        <Draggable key={index} defaultPosition={{ x: 80 + index * 30, y: 200 + index * 30 }}>
          <div className="absolute w-[300px] bg-white/90 rounded-xl shadow-lg border border-gray-300 z-50">
            <div className="flex justify-between items-center px-4 py-2 bg-pink-200 rounded-t-xl cursor-move">
              <span className="font-semibold">🗂️ {app}</span>
              <button onClick={() => setOpenedWindows(openedWindows.filter(w => w !== app))} className="text-red-500 font-bold">×</button>
            </div>
            <div className="p-4 text-sm text-gray-700">
              <p>This is the {app} section. 🎨</p>
              {/* 실제 기능은 이 아래에 추가할 수 있습니다 */}
            </div>
          </div>
        </Draggable>
      ))}

      <div className="w-full flex justify-end pr-4 z-50" onClick={() => {
        setMascotFace("poked");
        setTimeout(() => setMascotFace("default"), 1000);
      }}>
        <img src={mascotImg} alt="Aoi mascot" className="transition-all duration-300 w-20" />
      </div>
    </div>
  );
}
