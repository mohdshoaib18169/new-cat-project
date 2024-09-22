import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea/MidArea";
import PreviewArea from "./components/PreviewArea";
import { runAnimation } from "./constants/functions";

export default function App() {
  const [codeElements, setCodeElements] = useState({
    Spirit0: { MidArea0: [] }
  });
  const [selectedSpirit, setSpirit] = useState(`Spirit0`);
  const [deleteCodeEnabled, setDeleteCodeEnabled] = useState(false);

  useEffect(() => {
    document.body.onkeyup = function (e) {
      runAnimation({ selectedSpirit, codeElements, event: e.key });
    }
  }, [codeElements, selectedSpirit])

  return (
    <div className="bg-blue-100 font-sans">
      <div className="h-screen overflow-hidden flex flex-col  ">
        <div className="w-full">
          <header className="w-full bg-purple-400 p-4 font-medium text-white">
            <div>
          Juspay ScratchPad Submission
            </div>
          </header>
        </div>
        <div className="flex flex-1">
          <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-l border-gray-200 mr-2">
            <Sidebar setDeleteCodeEnabled={setDeleteCodeEnabled} deleteCodeEnabled={deleteCodeEnabled} setCodeElements={setCodeElements} codeElements={codeElements} selectedSpirit={selectedSpirit} />
            <MidArea setDeleteCodeEnabled={setDeleteCodeEnabled} setCodeElements={setCodeElements} codeElements={codeElements} selectedSpirit={selectedSpirit} />
          </div>
          <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 ml-2">
            <PreviewArea selectedSpirit={selectedSpirit} codeElements={codeElements} setCodeElements={setCodeElements} setSpirit={setSpirit} />
          </div>
        </div>

      </div>
    </div>
  );
}
