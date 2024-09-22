// import Motion from "../components/Motion"
import React from "react"
import Move from "../components/BasicMoveFunctions/Move"

import DropElement from "../components/DropElement"


export const StringToCodeMap = {
  MOVE: "Move",
  default: "Default",
  CHANGEX: "Change-x",
  CHANGEY: "Change-y",
  ROTATEL: "Rotate-l",
  ROTATER: "Rotate-r",
  REPEAT: "Repeat",

}


export const ELEMENT_SPECIFIC_ID = {
  MOVE: StringToCodeMap.MOVE,
  REPEAT: StringToCodeMap.REPEAT,
  CHANGEX: StringToCodeMap.CHANGEX,
  CHANGEY: StringToCodeMap.CHANGEY,
  ROTATEL: StringToCodeMap.ROTATEL,
  ROTATER: StringToCodeMap.ROTATER,

}
export const acceptedDropableItems = [
  StringToCodeMap.MOVE,
  StringToCodeMap.CHANGEX,
  StringToCodeMap.CHANGEY,
  StringToCodeMap.REPEAT,
  StringToCodeMap.ROTATEL,
  StringToCodeMap.ROTATER,

]
export const allAcceptableItems = [
  ...acceptedDropableItems,
 
]
export const complexDropableItems = [
  StringToCodeMap.REPEAT,
 
]

export const codeElements = {
  MOTION: [
    StringToCodeMap.MOVE,
    StringToCodeMap.CHANGEX,
    StringToCodeMap.CHANGEY,
    StringToCodeMap.ROTATER,
    StringToCodeMap.ROTATEL,
  
    
  ],
  CONTROL: [
    StringToCodeMap.REPEAT
  ],

}

export const applyTransformations = (target, value) => {
  const { valueX, valueY, rotateX } = value;
  target.style.transform = "translate(" + valueX + "px, " + valueY + "px) rotate(" + rotateX + "deg";
}

export const ComponentMapping = {
  [StringToCodeMap.default]: {
    valueX: 0,
    valueY: 0,
    rotateX: 0,
    repeat: 1,
  },
  [StringToCodeMap.MOVE]: {
    primaryText: 'Move by x steps',
    type: ELEMENT_SPECIFIC_ID.MOVE,
    Component: Move,
    value: 10,
  },
  [StringToCodeMap.CHANGEX]: {
    primaryText: "change x coordinate",
    type: ELEMENT_SPECIFIC_ID.CHANGEX,
    Component: Move,
    value: 10
  },
  [StringToCodeMap.CHANGEY]: {
    primaryText: "change y coordinate",
    type: ELEMENT_SPECIFIC_ID.CHANGEY,
    Component: Move,
    value: 10
  },
  [StringToCodeMap.ROTATEL]: {
    primaryText: "Turn by x degrees",
    type: ELEMENT_SPECIFIC_ID.ROTATEL,
    Component: Move,
    value: 10,
  },
  [StringToCodeMap.ROTATER]: {
    primaryText: "Turn by y degrees",
    type: ELEMENT_SPECIFIC_ID.ROTATER,
    Component: Move,
    value: 10,
  },
  [StringToCodeMap.REPEAT]: {
    primaryText: "Repeat x times",
    type: ELEMENT_SPECIFIC_ID.REPEAT,
    Component: DropElement,
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