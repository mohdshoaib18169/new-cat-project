import React from "react";
import CatSprite from "./CatSprite";
import Icon from "./Icon";

export default function PreviewArea({ selectedSpirit, codeElements, setCodeElements, setSpirit }) {
  const addSpirit = () => {
    let newCodeElements = { ...codeElements };
    let newSpiritId = `Spirit${Object.keys(codeElements).length}`
    newCodeElements[newSpiritId] = { MidArea0: [] };
    setCodeElements(newCodeElements);
  }
  const changeSpirit = (spiritId) => {
    setSpirit(spiritId);
  }

  return (
    <div className=" h-full w-full flex-1 overflow-y-auto p-2 relative">
      {Object.keys(codeElements).map((spirit) => {
        return <CatSprite id={spirit} onClick={() => changeSpirit(spirit)} />
      })}
      <button className="fixed bg-blue-500 px-4 py-2 rounded-full" style={{ bottom: 20, right: 20 }} onClick={addSpirit}>
        <div className= "text-white" >Add Item</div>
      </button>
    </div>
  );
}
