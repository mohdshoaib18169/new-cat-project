import React, { useEffect } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { acceptedDropableItems, complexDropableItems, transformProperties } from '../../constants';
import { useDrag } from 'react-dnd';
import DropZone from '../DropZone';

export default function DroppableCodeElement({ setDeleteCodeEnabled, value, isDisabled = false, selectedSpirit, setCodeElements, codeElements, type, droppableId, primaryText, insideElements, draggableId, onDrop, codeBlockKey, set, index, updateValue }) {
  const [{ opacity, isDragging }, drag] = useDrag({
    type: type,
    item: {
      id: draggableId,
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
      isDragging: monitor.isDragging()
    })
  });

  const acceptableDropItems = acceptedDropableItems.filter(function (el) {
    return !complexDropableItems.includes(el);
  });

  useEffect(() => {
    if (setDeleteCodeEnabled) {
      if (isDragging) {
        setDeleteCodeEnabled(true);
      } else {
        setDeleteCodeEnabled(false);
      }
    }
  }, [isDragging]);

  const handleDrop = (data, item, index = 0) => {
    onDrop(data, item, index)
  }

  const updateValueInsideElements = ({ value, index }) => {
    let [codeblock, index2] = draggableId.split('+');
    let newCodeElements = { ...codeElements };
    newCodeElements[selectedSpirit][codeblock][index2].insideElements[index].value = value;
    setCodeElements(newCodeElements);
  }

  const changeSteps = (value) => {
    const element = draggableId.split('+');
    updateValue({ value, index: element[1] })
  }

  const ItemContent = () => {
    return (
      <div className='rounded-t-xl rounded-b-xl' style={{ width: 'fit-content' }}>
        <div className='bg-green-400 p-2 rounded-r-xl font-size-12 font-medium text-white'>
          Repeat
          <input type="number" value={value} disabled={isDisabled} className="text-center rounded-3xl w-10 mx-2 text-black" onChange={(e) => changeSteps(e.target.value)} />
          times
        </div>
        <div className='flex h-auto flex-col h-4 w-full'>
          {insideElements && insideElements.map((element, index) => {
            let Component = element.Component
            return (
              <Component
                PrimaryText={element.primaryText}
                secondaryText={element.secondaryText}
                draggableId={`${draggableId}+${index}+${element.type}`}
                onDrop={onDrop}
                value={element.value}
                updateValue={updateValueInsideElements}
                type={element.type}
                index={index}
                acceptableDropItems={acceptableDropItems}
                codeBlockKey={draggableId}
                setDeleteCodeEnabled={setDeleteCodeEnabled}
              />
            )
          })}
        </div>
        <DropZone acceptableDropItems={acceptableDropItems} data={droppableId} onDrop={(data, item) => handleDrop(data, item, insideElements?.length)} />
        <div className="bg-green-400 p-4 rounded-r-xl"></div>
      </div>
    )
  }
  return (
    <div key={draggableId}>
      <DropZone data={codeBlockKey} onDrop={(data, item) => handleDrop(data, item, index)} />
      <div ref={drag} style={{ opacity, borderLeft: '14px solid #4ade80', borderRadius: '6px' }}>
        {ItemContent()}
      </div>
    </div>
  )
}