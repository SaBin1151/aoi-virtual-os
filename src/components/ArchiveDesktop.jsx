// Full version with draggable windows and Aoi assistant (GPT) integration
import { useState, useRef, useEffect } from "react";
import { FolderIcon } from "lucide-react";
import Draggable from "react-draggable";
import { Button } from "./ui/button";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export default function ArchiveDesktop() {
  const [booting, setBooting] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [mascotFace, setMascotFace] = useState("default");
  const [sliderRef, setSliderRef] = useState(null);
  const [handleRef, setHandleRef] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [openedWindows, setOpenedWindows] = useState([]);
  const [classNotes, setClassNotes] = useState([]);
  const [noteInput, setNoteInput] = useState("");
  const [homeworkList, setHomeworkList] = useState([]);
  const [homeworkInput, setHomeworkInput] = useState("");
  const [slides, setSlides] = useState([]);
  const [slideInput, setSlideInput] = useState("");
  const [examPapers, setExamPapers] = useState([]);
  const [examInput, setExamInput] = useState("");
  const [aoiInput, setAoiInput] = useState("");
  const [aoiResponse, setAoiResponse] = useState("");
  const mascotImg = mascotFace === "default" ? "/images/aoi-default.png" : "/images/aoi-poked.png";

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sliderRef || !handleRef) return;
    let isDragging = false;
    let startX = 0;
    const onMouseDown = (e) => { isDragging = true; startX = e.clientX; };
    const onMouseMove = (e) => {
      if (!isDragging) return;
      const moveX = e.clientX - startX;
      const sliderWidth = sliderRef.offsetWidth - handleRef.offsetWidth;
      const newLeft = Math.min(Math.max(0, moveX), sliderWidth);
      handleRef.style.left = `${newLeft}px`;
    };
    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      const sliderWidth = sliderRef.offsetWidth - handleRef.offsetWidth;
      const handleLeft = parseInt(handleRef.style.left, 10);
      if (handleLeft >= sliderWidth - 10) setUnlocked(true);
      else handleRef.style.left = `0px`;
    };
    handleRef.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      handleRef.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [sliderRef, handleRef]);

  const handleAoiSubmit = async () => {
    const prompt = aoiInput.trim();
    if (!prompt) return;
    if (prompt.toLowerCase().includes("class note")) openWindow("Class Notes");
    else if (prompt.toLowerCase().includes("homework")) openWindow("Homework");
    else if (prompt.toLowerCase().includes("slide")) openWindow("Lecture Slides");
    else if (prompt.toLowerCase().includes("exam")) openWindow("Exam Papers");
    const systemPrompt = "You are Aoi, a cute assistant who helps users navigate a virtual desktop archive. Keep responses short (max 75 words).";
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        max_tokens: 100
      })
    });
    const data = await response.json();
    setAoiResponse(data.choices?.[0]?.message?.content || "Sorry, I didn’t understand that. ❓");
    setAoiInput("");
  };

  const gradientBackground = {
    backgroundImage: "linear-gradient(135deg, #dbeafe 0%, #fce7f3 100%)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  };

  const openWindow = (appName) => {
    if (!openedWindows.includes(appName)) setOpenedWindows([...openedWindows, appName]);
  };

  const closeWindow = (appName) => {
    setOpenedWindows(openedWindows.filter(name => name !== appName));
  };

  if (booting) {
    return <div className="min-h-screen flex items-center justify-center text-pink-600 text-3xl font-bold tracking-wider" style={gradientBackground}>⏳ Booting Aoi OS...</div>;
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center relative text-white" style={gradientBackground}>
        <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl text-center">
          <p className="text-xl font-semibold mb-4">🔒 Slide to Unlock</p>
          <div ref={setSliderRef} className="relative w-72 h-12 bg-white/30 rounded-full">
            <div
              ref={setHandleRef}
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
    <div className="min-h-screen text-black p-6 relative" style={gradientBackground}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📁 Ikeda Aoi Archive</h1>
        <button onClick={() => setUnlocked(false)} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">🔒 Lock</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {["Class Notes", "Homework", "Lecture Slides", "Exam Papers"].map((app, index) => (
          <div key={index} className="flex flex-col items-center cursor-pointer" onDoubleClick={() => openWindow(app)}>
            <FolderIcon className="w-12 h-12 text-blue-600" />
            <span className="mt-2 text-center text-sm font-semibold">{app}</span>
          </div>
        ))}
      </div>

      {openedWindows.map((app, index) => (
        <Draggable key={index} defaultPosition={{ x: 100 + index * 30, y: 100 + index * 30 }}>
          <div className="absolute bg-white border rounded-lg shadow-lg p-4 w-[300px]">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold">{app}</h2>
              <button onClick={() => closeWindow(app)}>❌</button>
            </div>
            {app === "Class Notes" && (
              <div>
                <input value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Write a note" className="border px-2 py-1 w-full mb-2" />
                <button onClick={() => { if (noteInput) { setClassNotes([...classNotes, noteInput]); setNoteInput(""); }}} className="bg-blue-500 text-white px-2 py-1 rounded">Add</button>
                <ul className="mt-2 text-sm list-disc list-inside">{classNotes.map((note, i) => <li key={i}>{note}</li>)}</ul>
              </div>
            )}
            {app === "Homework" && (
              <div>
                <input value={homeworkInput} onChange={e => setHomeworkInput(e.target.value)} placeholder="New task" className="border px-2 py-1 w-full mb-2" />
                <button onClick={() => { if (homeworkInput) { setHomeworkList([...homeworkList, { text: homeworkInput, done: false }]); setHomeworkInput(""); }}} className="bg-blue-500 text-white px-2 py-1 rounded">Add</button>
                <ul className="mt-2 text-sm">
                  {homeworkList.map((hw, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <input type="checkbox" checked={hw.done} onChange={() => setHomeworkList(homeworkList.map((h, idx) => idx === i ? { ...h, done: !h.done } : h))} />
                      <span className={hw.done ? "line-through" : ""}>{hw.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {app === "Lecture Slides" && (
              <div>
                <input value={slideInput} onChange={e => setSlideInput(e.target.value)} placeholder="Slide URL" className="border px-2 py-1 w-full mb-2" />
                <button onClick={() => { if (slideInput) { setSlides([...slides, slideInput]); setSlideInput(""); }}} className="bg-blue-500 text-white px-2 py-1 rounded">Add</button>
                <ul className="mt-2 text-sm list-disc list-inside">
                  {slides.map((url, i) => <li key={i}><a href={url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{url}</a></li>)}
                </ul>
              </div>
            )}
            {app === "Exam Papers" && (
              <div>
                <input value={examInput} onChange={e => setExamInput(e.target.value)} placeholder="Exam name or URL" className="border px-2 py-1 w-full mb-2" />
                <button onClick={() => { if (examInput) { setExamPapers([...examPapers, examInput]); setExamInput(""); }}} className="bg-blue-500 text-white px-2 py-1 rounded">Add</button>
                <ul className="mt-2 text-sm list-disc list-inside">
                  {examPapers.map((exam, i) => <li key={i}>{exam}</li>)}
                </ul>
              </div>
            )}
          </div>
        </Draggable>
      ))}

      <div className="absolute bottom-4 left-4 bg-white/90 rounded-xl shadow p-4 w-[300px]">
        <div className="font-bold mb-1">🤖 Aoi Assistant</div>
        <div className="text-sm mb-2 text-black/90 h-20 overflow-y-auto">{aoiResponse}</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={aoiInput}
            onChange={(e) => setAoiInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAoiSubmit()}
            className="flex-1 px-2 py-1 border border-gray-300 rounded"
            placeholder="Ask Aoi something..."
          />
          <button onClick={handleAoiSubmit} className="bg-pink-500 text-white px-2 py-1 rounded">Go</button>
        </div>
      </div>

      <div className="absolute bottom-0 w-full bg-white/80 p-4 border-t mt-8">
        <div className="flex gap-2 mb-2">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" className="px-2 py-1 border rounded w-32" />
          <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Write a comment" className="flex-1 px-2 py-1 border rounded" />
          <button onClick={() => {
            if (!newComment || !username) return;
            const now = new Date().toLocaleTimeString();
            const newEntry = { user: username, content: newComment, time: now };
            setComments([...comments, newEntry]);
            setNewComment("");
          }} className="bg-green-500 text-white px-2 py-1 rounded">Send</button>
        </div>
        <ul className="space-y-1 text-sm">
          {comments.map((c, i) => (
            <li key={i} className="flex justify-between items-center">
              <span><strong>{c.user}</strong> ({c.time}): {c.content}</span>
              <div className="flex gap-1">
                <button onClick={() => { setEditIndex(i); setNewComment(c.content); }} className="text-xs px-1 py-0.5 bg-yellow-300 rounded">✏️</button>
                <button onClick={() => setComments(comments.filter((_, idx) => idx !== i))} className="text-xs px-1 py-0.5 bg-red-400 text-white rounded">🗑</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <img
        src={mascotImg}
        alt="Aoi Mascot"
        className="absolute right-6 bottom-36 w-32 h-auto cursor-pointer"
        onClick={() => {
          setMascotFace("poked");
          setTimeout(() => setMascotFace("default"), 1000);
        }}
      />
    </div>
  );
}
