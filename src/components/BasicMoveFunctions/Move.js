import React, { useEffect, useState } from 'react';
import { useDrag } from "react-dnd";
import { StringToCodeMap } from '../../constants';
import DropZone from '../DropArea';

export default function Move({ setDeleteCodeEnabled, draggableId = StringToCodeMap.MOVE, index = 1, className = "", updateValue, value, isDisabled = false, PrimaryText, secondaryText = null, onDrop, codeBlockKey, acceptableDropItems, }) {
  // const [steps, setSteps] = useState(10);
  const [{ opacity, isDragging }, drag] = useDrag({
    type: StringToCodeMap.MOVE,
    item: {
      id: draggableId,
    },
    collect: monitor => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
      isDragging: monitor.isDragging()
    })
  });

  useEffect(() => {
    if (setDeleteCodeEnabled) {
      if (isDragging) {
        setDeleteCodeEnabled(true);
      } else {
        setDeleteCodeEnabled(false);
      }
    }

  }, [isDragging])

  const handleDrop = (data, item) => {
    onDrop(data, item, index)
  }

  const changeSteps = (value) => {

    if (updateValue) {
      updateValue({ value, index })
    }
  }
  const ItemContent = () => {
    return (
      <div className="bg-blue-400 p-2 text-white rounded">
        <span className='flex items-center font-size-12 font-medium'>
          {typeof (PrimaryText) === 'string' ? PrimaryText : <PrimaryText />}
          <input type='number' value={value} disabled={isDisabled} className="text-center rounded-3xl w-10 mx-2 text-black" onChange={(e) => changeSteps(e.target.value)} />
          {secondaryText}
        </span>
      </div>
    )
  }

  return (
    <>
      <DropZone data={codeBlockKey} onDrop={handleDrop} className="h-1" acceptableDropItems={acceptableDropItems} />
      <div className='font-family-12' ref={drag} style={{ opacity, width: 'fit-content' }}>
        {ItemContent()}
      </div>
    </>
  )
}