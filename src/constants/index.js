// import Motion from "../components/Motion"
import React from "react"
import Move from "../components/Move/Move"

import DroppableCodeElement from "../components/DroppableCodeElement"





// export const codeConstants = {
//   MOTION: {
//     name: "Motion",
//     component: <Motion key="MOTION" elements={MOTION_CONSTANTS} />
//   }
// }

// const MOTION_CONSTANTS = [
//   {
//     name: "Move",
//     component: 
//   }
// ]

export const StringToCodeElementsMapping = {
  MOVE: "Move",
  default: "Default",
  CHANGEX: "Change-x",
  CHANGEY: "Change-y",
  ROTATEL: "Rotate-l",
  ROTATER: "Rotate-r",
  REPEAT: "Repeat",

}


export const ELEMENT_SPECIFIC_ID = {
  MOVE: StringToCodeElementsMapping.MOVE,
  REPEAT: StringToCodeElementsMapping.REPEAT,
  CHANGEX: StringToCodeElementsMapping.CHANGEX,
  CHANGEY: StringToCodeElementsMapping.CHANGEY,
  ROTATEL: StringToCodeElementsMapping.ROTATEL,
  ROTATER: StringToCodeElementsMapping.ROTATER,

}
export const acceptedDropableItems = [
  StringToCodeElementsMapping.MOVE,
  StringToCodeElementsMapping.CHANGEX,
  StringToCodeElementsMapping.CHANGEY,
  StringToCodeElementsMapping.REPEAT,
  StringToCodeElementsMapping.ROTATEL,
  StringToCodeElementsMapping.ROTATER,

]
export const allAcceptableItems = [
  ...acceptedDropableItems,
 
]
export const complexDropableItems = [
  StringToCodeElementsMapping.REPEAT,
 
]

export const codeElements = {
  MOTION: [
    StringToCodeElementsMapping.MOVE,
    StringToCodeElementsMapping.CHANGEX,
    StringToCodeElementsMapping.CHANGEY,
    StringToCodeElementsMapping.ROTATER,
    StringToCodeElementsMapping.ROTATEL,
  
    
  ],
  CONTROL: [
    StringToCodeElementsMapping.REPEAT
  ],

}

export const applyTransformations = (target, value) => {
  const { valueX, valueY, rotateX } = value;
  target.style.transform = "translate(" + valueX + "px, " + valueY + "px) rotate(" + rotateX + "deg";
}

export const ComponentMapping = {
  [StringToCodeElementsMapping.default]: {
    valueX: 0,
    valueY: 0,
    rotateX: 0,
    repeat: 1,
  },
  [StringToCodeElementsMapping.MOVE]: {
    primaryText: 'Move by x steps',
    type: ELEMENT_SPECIFIC_ID.MOVE,
    Component: Move,
    value: 10,
  },
  [StringToCodeElementsMapping.CHANGEX]: {
    primaryText: "change x coordinate",
    type: ELEMENT_SPECIFIC_ID.CHANGEX,
    Component: Move,
    value: 10
  },
  [StringToCodeElementsMapping.CHANGEY]: {
    primaryText: "change y coordinate",
    type: ELEMENT_SPECIFIC_ID.CHANGEY,
    Component: Move,
    value: 10
  },
  [StringToCodeElementsMapping.ROTATEL]: {
    primaryText: "Turn by x degrees",
    type: ELEMENT_SPECIFIC_ID.ROTATEL,
    Component: Move,
    value: 10,
  },
  [StringToCodeElementsMapping.ROTATER]: {
    primaryText: "Turn by y degrees",
    type: ELEMENT_SPECIFIC_ID.ROTATER,
    Component: Move,
    value: 10,
  },
  [StringToCodeElementsMapping.REPEAT]: {
    primaryText: "Repeat x times",
    type: ELEMENT_SPECIFIC_ID.REPEAT,
    Component: DroppableCodeElement,
    value: 10,
    insideElements: []
  },

}

export const transformProperties = [
  ELEMENT_SPECIFIC_ID.MOVE,
  ELEMENT_SPECIFIC_ID.CHANGEX,
  ELEMENT_SPECIFIC_ID.CHANGEY,
  ELEMENT_SPECIFIC_ID.ROTATEL,
  ELEMENT_SPECIFIC_ID.ROTATER,
]