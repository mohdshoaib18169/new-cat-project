import React from "react";
import MidAreaDraggable from "./MidAreaDraggable";
import IconFlag from "../Event/IconFlag";
import Run from './Run';

export default function MidArea({ setCodeElements, codeElements, selectedSpirit, setDeleteCodeEnabled }) {
  const handleNewCodeBlock = () => {
    let selectedSpiritElement = codeElements[selectedSpirit];
    const len = Object.keys(selectedSpiritElement).length;
    const newCodeElements = { ...codeElements };
    newCodeElements[selectedSpirit][`MidArea${len}`] = [];
    setCodeElements(newCodeElements);
  }

  const spiritCodeElements = codeElements[selectedSpirit];
  return <div className="flex-col flex-1 h-full flex overflow-auto">
    <div className="flex py-2 border-b justify-between">
      <div className="flex items-center">
        <div className = "flex flex-row">
        <div className = "ml-4">ACTIONS</div>
        <IconFlag/>
        </div>
      </div>

      <div className="flex justify-end py-2 pr-6 ">
      <div className="flex items-center">
        <Run selectedSpirit={selectedSpirit} codeElements={codeElements} playClicked = {true} setCodeElements={setCodeElements}  />
      </div>

    </div>
    </div>
    <div className="flex overflow-auto flex-1 w-full">
      {
        Object.keys(spiritCodeElements).map((codeBlockKey) => {
          return <MidAreaDraggable
            setCodeElements={setCodeElements}
            codeElements={codeElements}
            selectedSpirit={selectedSpirit}
            codeBlockKey={codeBlockKey}
            setDeleteCodeEnabled={setDeleteCodeEnabled}
            codeBlock={spiritCodeElements[codeBlockKey]} />
        })
      }

    </div>

  </div>;
}
