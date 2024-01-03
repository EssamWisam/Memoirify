import React, { useEffect, useState } from 'react'

import { corePluginHooks, } from '@mdxeditor/editor';

import { $patchStyleText, $getSelectionStyleValueForProperty } from '@lexical/selection'

import { PiHighlighterCircle } from "react-icons/pi";

import { IconContext } from 'react-icons';


export const HighlightMode = () => {
    const [currentSelection, activeEditor] = corePluginHooks.useEmitterValues('currentSelection', 'activeEditor');
    const [highlightMode, setHighlightMode] = useState(false);
    const [color, setColor] = useState('#ffffff');
    const colors = ['#ffffff', '#FFFCD1', '#93FCFC', '#92FCDC', '#F4B5FA'];
    const [showTooltip, setShowTooltip] = useState(false);
  
    useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.getModifierState('Control')) {
          if (event.key === 'w') {
            setColor(colors[0]);
          } else if (event.key === '1') {
            setColor(colors[1]);
          } else if (event.key === '2') {
            setColor(colors[2]);
          } else if (event.key === '3') {
            setColor(colors[3]);
          } else if (event.key === '4') {
            setColor(colors[4]);
          }
        }
      };
  
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []);
  
    useEffect(() => {
      if (activeEditor !== null && currentSelection !== null && highlightMode) {
        activeEditor.update(() => {
          try {
            let current = $getSelectionStyleValueForProperty(currentSelection, 'color', -1);
            if (current !== color) {
              $patchStyleText(currentSelection, { 'color': color });
            }
          } catch (e) {
            console.log(e);
          }
        });
      }
    }, [currentSelection, highlightMode, activeEditor]);
  
    return (
      <>
        <IconContext.Provider value={{ size: '1.4em', style: { verticalAlign: 'middle' } }}>
        <PiHighlighterCircle
          onClick={() => setHighlightMode((prev) => !prev)}
          style={{ cursor: 'pointer', color: highlightMode ? '#ffffff' : 'inherit',}}
        />
        </IconContext.Provider>
  
              {!showTooltip && <div style={{ backgroundColor: color, width: '20px', height: '20px', borderRadius: '10px', cursor: 'pointer' }}
          onClick={() => { setShowTooltip(true) }}
        >
        </div>}
        {showTooltip &&
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', }}>
              <div
                style={{
                  backgroundColor: colors[0],
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => { setColor(colors[0]); setShowTooltip(false) }}
              ></div>
              <div
                style={{
                  backgroundColor: colors[1],
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => { setColor(colors[1]); setShowTooltip(false) }}
              ></div>
              <div
                style={{
                  backgroundColor: colors[2],
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => { setColor(colors[2]); setShowTooltip(false) }}
              ></div>
              <div
                style={{
                  backgroundColor: colors[3],
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  marginRight: '5px',
                  cursor: 'pointer',
                }}
                onClick={() => { setColor(colors[3]); setShowTooltip(false) }}
              ></div>
            </div>
          </div>}
      </>
    );
  };
  
  
  