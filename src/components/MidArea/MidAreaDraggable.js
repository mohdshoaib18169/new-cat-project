import React from 'react';
import DropZone from '../DropZone';
import { onDragEnd } from '../../constants/utils';
import { StringToCodeElementsMapping, acceptedDropableItems, allAcceptableItems } from '../../constants';
import Run from './Run';

export default function MidAreaDraggable({
  setCodeElements,
  selectedSpirit,
  codeElements,
  codeBlock,
  codeBlockKey,
  setDeleteCodeEnabled
}) {

  const handleDrop = (data, item, index = codeBlock.length) => {
    let destination = {
      droppableId: data, // codeBlockKey
      index
    }
    onDragEnd({ destination, draggableId: item.id, codeElements, setCodeElements, selectedSpirit })
  }

  const updateValue = ({ value, index }) => {
    let newCodeElements = { ...codeElements };
    newCodeElements[selectedSpirit][codeBlockKey][index].value = value;
    setCodeElements(newCodeElements);
  }

  let isConditionAdded = false;
  if (codeElements[selectedSpirit][codeBlockKey].length > 0) {
    isConditionAdded = codeElements[selectedSpirit][codeBlockKey][0].type === StringToCodeElementsMapping.WHEN
  }
  const anyElementAdded = codeElements[selectedSpirit][codeBlockKey].length > 0;
  return (
    <div className="m-4 min-h-40 w-full flex-none  flex flex-col p-2 bg-gray-100 rounded" key={codeBlockKey}>
      <span className='font-medium flex w-full justify-between'>
        {"Actions for Selected Spirit"}
        <div className = "mr-12"><Run codeBlock={codeBlock} runPlayButton={true} selectedSpirit={selectedSpirit} /> </div>
      </span>
      {!isConditionAdded &&
        <DropZone data={codeBlockKey} acceptableDropItems={!isConditionAdded ? allAcceptableItems : acceptedDropableItems} onDrop={(data, item) => handleDrop(data, item, 0)} className={anyElementAdded ? 'h-1' : `flex-1`} />
      }
      <div>
        {codeBlock.map((element, index) => {
          const { Component } = element;
          return (
            <Component
              PrimaryText={element.primaryText}
              secondaryText={element.secondaryText}
              draggableId={`${codeBlockKey}+${index}+${element.draggableId}`}
              droppableId={`${codeBlockKey}+${index}+${element.draggableId}`}
              onDrop={handleDrop}
              codeBlockKey={codeBlockKey}
              index={index}
              type={element.type}
              value={element.value}
              insideElements={element.insideElements}
              setCodeElements={setCodeElements}
              selectedSpirit={selectedSpirit}
              codeElements={codeElements}
              setDeleteCodeEnabled={setDeleteCodeEnabled}
              updateValue={updateValue} />
          )
        })}
      </div>
      {anyElementAdded &&
        <>
          <div className="h-1"></div>
          <DropZone data={codeBlockKey} acceptableDropItems={acceptedDropableItems} onDrop={handleDrop} className="flex-1 rounded" style={{ marginTop: '8px' }} />
        </>}
    </div>
  )
}