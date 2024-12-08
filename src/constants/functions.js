import { cloneDeep } from "lodash";
import { ComponentMapping, ELEMENT_SPECIFIC_ID, StringToCodeMap, complexDropableItems, transformProperties, codeElements as codeConstant } from ".";

export const defaultTransforms = {
  translateX: 0,
  translateY: 0,
  translateZ: 0,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scaleX: 1,
  scaleY: 1,
  scaleZ: 1,
  skewX: 0,
  skewY: 0,
  perspective: 0,
}

export const removeCodeFunction = (affectedCodeBlock, index) => {
  affectedCodeBlock.splice(index, 1);
  return affectedCodeBlock;
}

export const moveCodeFunction = (affectedCodeBlock, type, destination, value, movedElement) => {
  let element = cloneDeep(ComponentMapping[type]);
  // element.value = value;
  element['draggableId'] = type;
  affectedCodeBlock.splice(destination.index, 0, movedElement ? movedElement : element);
  return affectedCodeBlock;
}

export const getVerticalMergedCodeFunction = (codeElements, multipler = 1, isRepeat = false, playClicked) => {
  if (playClicked) {
    let mergedVertical = [];
    let merged = { ...ComponentMapping[StringToCodeMap.default] };
    let valueX = 0;
    let valueY = 0;
    let rotateX = 0;
    let setX = 0;
    let setY = 0;
    let lastPush = true;
    let i = 0;
    for (let code of codeElements) {
      if (!transformProperties.includes(code.type)) {
        if (valueX !== 0 || valueY !== 0 || rotateX !== 0)
          mergedVertical.push(merged);
        lastPush = false;
        valueX = 0;
        valueY = 0;
        rotateX = 0;
        setX = 0;
        setY = 0;
        if (complexDropableItems.includes(code.type)) {
          merged = getVerticalMergedCodeFunction(code.insideElements, code.value, true, true)[0];
          merged.repeat = code.value;
          mergedVertical.push(merged);
        }
        merged = { ...ComponentMapping[StringToCodeMap.default] };
      } else {
        lastPush = true;
        if (code.type === ELEMENT_SPECIFIC_ID.CHANGEX) valueX += Number(code.value);
        if (code.type === ELEMENT_SPECIFIC_ID.CHANGEY) valueY += Number(code.value);
        if (code.type === ELEMENT_SPECIFIC_ID.SETX) setX = Number(code.value);
        if (code.type === ELEMENT_SPECIFIC_ID.SETY) setY = Number(code.value);
        if (code.type === ELEMENT_SPECIFIC_ID.MOVE) {
          valueX += Number(code.value);
          valueY += Number(code.value);
        }
        if (code.type === ELEMENT_SPECIFIC_ID.ROTATEL) rotateX -= Number(code.value);
        if (code.type === ELEMENT_SPECIFIC_ID.ROTATER) rotateX += Number(code.value);
        merged.valueX = valueX;
        merged.valueY = valueY;
        merged.rotateX = rotateX;
        merged.setX = setX;
        merged.setY = setY;
      }
    }
    merged.valueX *= multipler
    merged.valueY *= multipler
    merged.rotateX *= multipler
    if (lastPush)
      mergedVertical.push(merged);

    return mergedVertical;
  }
}

const getHorizontalMergedCodeFunction = (codeBlocks) => {
  let mergedHorizontal = [];
  let maximumLengthCode = 0;
  for (let codeBlock in codeBlocks) {
    maximumLengthCode = Math.max(codeBlocks[codeBlock].length, maximumLengthCode);
  }
  for (let i = 0; i < maximumLengthCode; i++) {
    let merged = { ...ComponentMapping[StringToCodeMap.default] };
    for (let codeBlock in codeBlocks) {
      let code = codeBlocks[codeBlock];
      if (code.length > i) {
        merged.valueX += code[i].valueX;
        merged.valueY += code[i].valueY;
        merged.rotateX += code[i].rotateX;
        merged.setX = code[i].setX;
        merged.setY = code[i].setY;
      }
    }
    mergedHorizontal.push(merged);
  }
  return mergedHorizontal;
}
export const getMergedAnimationFunction = (codeBlocks, event, playClicked) => {
  const mergedCodeElementVertically = {};
  for (let codeBlock in codeBlocks) {
    if (codeBlocks[codeBlock].length > 0) {
      mergedCodeElementVertically[codeBlock] = getVerticalMergedCodeFunction(codeBlocks[codeBlock], undefined, undefined, playClicked);
    }
  }
  return getHorizontalMergedCodeFunction(mergedCodeElementVertically);
}

function getCurrentRotation(el) {
  var st = window.getComputedStyle(el, null);
  var tm = st.getPropertyValue("-webkit-transform") ||
    st.getPropertyValue("-moz-transform") ||
    st.getPropertyValue("-ms-transform") ||
    st.getPropertyValue("-o-transform") ||
    st.getPropertyValue("transform") ||
    "none";
  if (tm != "none") {
    var values = tm.split('(')[1].split(')')[0].split(',');
    var angle = Math.round(Math.atan2(values[1], values[0]) * (180 / Math.PI));
    return (angle < 0 ? angle + 360 : angle);
  }
  return 0;
}

export const getTransformValue = (valueX, valueY, element) => {
  return {
    valueX,
    valueY,
    rotateX: getCurrentRotation(element),
  }
}

export const handleDropInComplexItems = ({ destination, draggableId, codeElements, setCodeElements, selectedSpirit }) => {
  let newCodeElements = { ...codeElements };
  if (draggableId.includes("+")) {
  } else {
    const [codeBlock, index, type] = destination.droppableId.split('+');

    let affectedCodeBlock = { ...codeElements[selectedSpirit][codeBlock][index] };
    affectedCodeBlock.insideElements = [...moveCodeFunction(affectedCodeBlock.insideElements, draggableId, destination)];
    newCodeElements[selectedSpirit][codeBlock][index] = { ...affectedCodeBlock };
    setCodeElements(newCodeElements);
  }
}

const removeCodeElementHelper = ({ draggableId, codeElements, selectedSpirit, codeBlock, index }) => {
  let affectedCodeBlock = cloneDeep(codeElements[selectedSpirit][codeBlock]);
  let movedElement = {};
  if (draggableId.split('+').length > 3) {
    let elements = draggableId.split("+");
    movedElement = affectedCodeBlock[elements[1]].insideElements[elements[3]]
    affectedCodeBlock[elements[1]].insideElements = removeCodeFunction(affectedCodeBlock[elements[1]].insideElements, elements[3]);
  } else {
    movedElement = affectedCodeBlock[index];
    affectedCodeBlock = removeCodeFunction(affectedCodeBlock, index);
  }
  return [affectedCodeBlock, movedElement];
}

const copyCodeElementHelper = ({ codeElements, selectedSpirit, destination, movedElement, type, value, negateFromIndex }) => {
  let elements = destination.droppableId.split("+");
  let affectedCodeBlock = [...codeElements[selectedSpirit][elements[0]]];
  elements[1] -= negateFromIndex;
  if (destination.droppableId.split('+').length > 1) {
    affectedCodeBlock[elements[1]].insideElements = moveCodeFunction(affectedCodeBlock[elements[1]].insideElements, type, destination, value, movedElement);
    codeElements[selectedSpirit][elements[0]] = affectedCodeBlock;
  } else {
    affectedCodeBlock = moveCodeFunction(affectedCodeBlock, type, destination, value, movedElement);
    codeElements[selectedSpirit][elements[0]] = affectedCodeBlock;
  }
  return codeElements
};

const sameCodeBlockRepeatDrop = (draggagleId, droppableId) => {
  const [codeBlock, index] = draggagleId.split("+");
  const [codeBlock2, index2] = droppableId.split("+");

  if (codeBlock === codeBlock2 && index < index2) return 1;
  return 0;
}

export const onDragEnd = ({ destination, draggableId, codeElements, setCodeElements, selectedSpirit, isRemove }) => {
  let newCodeElements = cloneDeep(codeElements);

  if (isRemove) {
    const [codeBlock, index, type] = draggableId.split('+');
    let output = removeCodeElementHelper({ codeElements: { ...newCodeElements }, draggableId, selectedSpirit, codeBlock, index });
    let affectedCodeBlock = newCodeElements[selectedSpirit][codeBlock];
    affectedCodeBlock = output[0];
    newCodeElements[selectedSpirit][codeBlock] = affectedCodeBlock;
    setCodeElements(newCodeElements);
    return;
  }

  if (draggableId.includes('+')) {
    const [codeBlock, index, type] = draggableId.split('+');
    let affectedCodeBlock = newCodeElements[selectedSpirit][codeBlock];
    if (destination === null) {
      // remove code element
      affectedCodeBlock = removeCodeFunction(affectedCodeBlock, index);
      setCodeElements(newCodeElements);
    } else {
      let movedElement = {};
      let output = removeCodeElementHelper({ codeElements: { ...newCodeElements }, draggableId, selectedSpirit, codeBlock, index });
      affectedCodeBlock = output[0];
      movedElement = output[1];
      newCodeElements[selectedSpirit][codeBlock] = affectedCodeBlock;
      let negateFromIndex = sameCodeBlockRepeatDrop(draggableId, destination.droppableId);
      newCodeElements = copyCodeElementHelper({ type, destination, draggableId, codeElements: newCodeElements, selectedSpirit, movedElement, negateFromIndex })
      setCodeElements(newCodeElements);
    }
  } else {
    if (destination == null) return;
    if (destination.droppableId.split("+").length > 1) {
      handleDropInComplexItems({ destination, draggableId, codeElements, setCodeElements, selectedSpirit })
    } else {
      let affectedCodeBlock = codeElements[selectedSpirit][destination.droppableId];
      affectedCodeBlock = moveCodeFunction(affectedCodeBlock, draggableId, destination, 10);
      newCodeElements[selectedSpirit][destination.droppableId] = affectedCodeBlock;
      setCodeElements(newCodeElements);
    }
  }
}

const swapProperties = (obj1, obj2, codeElements, setCodeElements) => {
   gsap.killTweensOf(`#Spirit0`);
   gsap.killTweensOf(`#Spirit1`);
   let val = codeElements
   let temp = val["Spirit0"]
   val["Spirit0"] = val["Spirit1"]
   val["Spirit1"] = temp
  gsap.to(`#Spirit0`, { duration: 1, x: "+=" + obj2.valueX, y: "+=" + obj2.valueY });
  gsap.to(`#Spirit1`, { duration: 1, x: "+=" + obj1.valueX, y: "+=" + obj1.valueY });
};

const checkCollision = (id1, id2) => {
  // console.log(id1, id2)
  if (id1 == id2)
    return false
  const el1 = document.getElementById(id1);
  const el2 = document.getElementById(id2);
  if (!el1 || !el2) return false;


  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  //console.log("working0")
  const hasCollisionOccurred = (
    rect1.left < rect2.right &&
    rect1.right > rect2.left &&
    rect1.top < rect2.bottom &&
    rect1.bottom > rect2.top
  );
  //console.log("working99")
  //console.log(hasCollisionOccurred)
  return hasCollisionOccurred;

};


export const step = (mergedItems, selectedSpirit, mergedItemsArray, codeElements, setCodeElements) => {
  let i = 0;
  for (let codeElement of mergedItems) {
    const xValue = codeElement.valueX === 0 && codeElement.setX !== 0 ? codeElement.setX : `+=${codeElement.valueX + codeElement.setX}`;
    const yValue = codeElement.valueY === 0 && codeElement.setY !== 0 ? codeElement.setY : `+=${codeElement.valueY + codeElement.setY}`;
    let oppositeSpirit = selectedSpirit == `Spirit1` ? `Spirit0` : `Spirit1`;
    gsap.to(`#${selectedSpirit}`, {
      duration: 1, x: xValue, y: yValue, rotation: "+=" + codeElement.rotateX, onUpdate: () => {
        if (checkCollision(selectedSpirit, oppositeSpirit)) {
          swapProperties(codeElement, mergedItemsArray[oppositeSpirit][0], codeElements, setCodeElements, mergedItemsArray);
        }

      }, delay: i
    })
    i++;
  }
}

export const runAnimation = ({ selectedSpirit, codeElements, event, playClicked, setCodeElements }) => {
 
  if (playClicked) {
    let mergedItems = {};
    for (let codeBlock in codeElements) {
      let merged = getMergedAnimationFunction(codeElements[codeBlock], event, playClicked);
      mergedItems[codeBlock] = merged;
    }
   
    for (let mergedSpirit in mergedItems) {
      step(mergedItems[mergedSpirit], mergedSpirit, mergedItems, codeElements, setCodeElements);
    }
  }
}

export const runSingleCodeBlockAnimation = (codeBlock, selectedSpirit, playClicked, codeElements) => {
  let codeBlocks = [...codeBlock];
 
  let mergedItems = {};
  for (let codeBlock in codeElements) {
    let merged = getMergedAnimationFunction(codeElements[codeBlock], event, playClicked);
    mergedItems[codeBlock] = merged;
  }

 
  const merged = getVerticalMergedCodeFunction(codeBlocks, 1, true, playClicked);
 
  step(merged, selectedSpirit, mergedItems, codeElements);
}