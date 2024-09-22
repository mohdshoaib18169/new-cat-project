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

export const getVerticalMergedCodeFunction = (codeElements, multipler = 1, isRepeat = false) => {
  let mergedVertical = [];
  let merged = { ...ComponentMapping[StringToCodeMap.default] };
  let valueX = 0;
  let valueY = 0;
  let rotateX = 0;
  let lastPush = true;
  let i = 0;
  for (let code of codeElements) {
    if (i === 0 && !isRepeat) {
      i++;
      continue;
    }

    if (!transformProperties.includes(code.type)) {
      if (valueX !== 0 || valueY !== 0 || rotateX !== 0)
        mergedVertical.push(merged);
      lastPush = false;
      valueX = 0;
      valueY = 0;
      rotateX = 0;
      if (codeConstant.LOOK.includes(code.type)) {
        merged = { ...ComponentMapping[StringToCodeMap.default] };
     
        mergedVertical.push(merged);
      } else if (complexDropableItems.includes(code.type)) {
        merged = getVerticalMergedCodeFunction(code.insideElements, code.value, true)[0];
        merged.repeat = code.value;
        mergedVertical.push(merged);
      }
      merged = { ...ComponentMapping[StringToCodeMap.default] };
    } else {
      lastPush = true;
      if (code.type === ELEMENT_SPECIFIC_ID.CHANGEX) valueX += Number(code.value);
      if (code.type === ELEMENT_SPECIFIC_ID.CHANGEY) valueY += Number(code.value);
      if (code.type === ELEMENT_SPECIFIC_ID.MOVE) {
        valueX += Number(code.value);
        valueY += Number(code.value);
      }
      if (code.type === ELEMENT_SPECIFIC_ID.ROTATEL) rotateX -= Number(code.value);
      if (code.type === ELEMENT_SPECIFIC_ID.ROTATER) rotateX += Number(code.value);
      merged.valueX = valueX;
      merged.valueY = valueY;
      merged.rotateX = rotateX;
    }
  }
  merged.valueX *= multipler
  merged.valueY *= multipler
  merged.rotateX *= multipler
  if (lastPush)
    mergedVertical.push(merged);
  return mergedVertical;
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
      }
    }
    mergedHorizontal.push(merged);
  }
  return mergedHorizontal;
}
export const getMergedAnimationFunction = (codeBlocks, event) => {
  const mergedCodeElementVertically = {};
  for (let codeBlock in codeBlocks) {
    if (codeBlocks[codeBlock].length > 0 && codeBlocks[codeBlock][0].value === event) {
      mergedCodeElementVertically[codeBlock] = getVerticalMergedCodeFunction(codeBlocks[codeBlock]);
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

export const step = (mergedItems, selectedSpirit) => {
  let i = 0;
  for (let codeElement of mergedItems) {
    gsap.to(`#${selectedSpirit}`, { duration: 1, x: "+=" + codeElement.valueX, y: "+=" + codeElement.valueY, rotation: "+=" + codeElement.rotateX, delay: i })
    i++;
  }
}

export const runAnimation = ({ selectedSpirit, codeElements, event }) => {
  let mergedItems = {};
  for (let codeBlock in codeElements) {
    let merged = getMergedAnimations(codeElements[codeBlock], event);
    mergedItems[codeBlock] = merged;
  }
  for (let mergedSpirit in mergedItems) {
    step(mergedItems[mergedSpirit], mergedSpirit);
  }
}

export const runSingleCodeBlockAnimation = (codeBlock, selectedSpirit) => {
  let codeBlocks = [...codeBlock];
 console.log(codeBlocks)
 console.log(selectedSpirit)
  
  const merged = getVerticalMergedCodeFunction(codeBlocks, 1, true);
  step(merged, selectedSpirit);
}