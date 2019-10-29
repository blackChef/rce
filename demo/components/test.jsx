import React from 'react';
import { useState, useEffect, useRef } from 'react';


const myHook = function() {
  const [curState, setState] = useState(() =>  ({ num: 5, str: '123' }));

  useEffect(function() {
    console.log('afterRender');
    return () => {
      console.log('beforeNextRender or unmount');
    };
  }, []);

  const instanceVariables = useRef();
  useEffect(function() {
    const timer = setInterval(function() {
      console.log(Date.now());
    }, 1000);
    instanceVariables.current = timer;
    return () => {
      clearInterval(instanceVariables.current);
    };
  }, []);

  return [curState, setState];
};

const Test = function() {
  const [curState, setState] = myHook();
  const onClick = function() {
    setState({ ...curState, num: curState.num + 1  });
  };
  const pRef = useRef(null);


  return (
    <div>
      <p ref={pRef}>{JSON.stringify(curState)}</p>
      <button onClick={onClick}>click</button>
    </div>
  );
};

export { Test };

