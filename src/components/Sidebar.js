import React from "react";
import { ComponentMapping, StringToCodeElementsMapping, allAcceptableItems, codeElements as allCodeElement } from "../constants";
import DropZone from "./DropZone";
import { onDragEnd } from "../constants/utils";

export default function Sidebar({ setDeleteCodeEnabled, deleteCodeEnabled, codeElements, setCodeElements, selectedSpirit }) {
  const handleDrop = (data, item) => {
    setDeleteCodeEnabled(false);
    onDragEnd({ draggableId: item.id, codeElements, setCodeElements, selectedSpirit, isRemove: true })
  }
  return (
    <div>
<div className = "ml-2 mt-2"> CODE</div>
    
    <div className="w-60 flex-none h-full overflow-y-auto flex mt-3 flex-col items-start p-2 border-r border-gray-200">
      {/* <Events /> */}
      {deleteCodeEnabled ? <div className="flex flex-col w-full flex-1">
        <div className="text-center" style={{ fontWeight: 'bold' }}>Trash</div>
        <DropZone
          className="flex-1 bg-red-400 trashDropZone"
          acceptableDropItems={allAcceptableItems}
          onDrop={(data, item) => handleDrop(data, item, 0)}
        />
      </div> :
        <>
          <div style={{}} className="py-4">
            {allCodeElement.MOTION.map((element, index) => {
              let codeElement = ComponentMapping[element]
              let Component = codeElement.Component;
              return (
                <Component
                  PrimaryText={codeElement.primaryText}
                  secondaryText={codeElement.secondaryText}
                  draggableId={element}
                  type={element.type}
                  index={index}
                  isDisabled />
              )
            })}
          </div>
          <div style={{}} className="">
            {allCodeElement.CONTROL.map((element, index) => {
              let codeElement = ComponentMapping[element];
              let Component = codeElement.Component;
              return (
                <Component
                  droppableId={element}
                  draggableId={element}
                  index={index}
                  isDisabled
                  PrimaryText={codeElement.primaryText}
                  type={codeElement.type}
                />
              )
            })}
          </div>
        
           
        </>
      }
    </div>
    </div>
  );
}
