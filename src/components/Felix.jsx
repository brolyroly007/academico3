// src/components/Felix.jsx
import { useState, useEffect, useRef } from 'react';
import './Felix.css';

const Felix = () => {
  const [isActive, setIsActive] = useState(false);
  const [isInactive, setIsInactive] = useState(false);
  const [responseActive, setResponseActive] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  
  const felixRef = useRef(null);
  const timeoutRef = useRef(null);
  const userMadeDecisionRef = useRef(false);
  
  const ACTIVE_TIME_MS = 5000;
  const DEACTIVATION_TIME_MS = 750;
  
  const jokes = [
    'I ate a clock yesterday, it was very time-consuming.',
    'A perfectionist walked into a bar…apparently, the bar wasn't set high enough.',
    'Employee of the month is a good example of how somebody can be both a winner and a loser at the same time.',
    'I don't have a girlfriend, but I know a girl that would get really mad if she heard me say that.',
    'Relationships are great, but have you ever had stuffed crust pizza?',
    'The worst time to have a heart attack is during a game of charades.',
    'My therapist says I have a preoccupation with vengeance. We'll see about that.',
    'I have a friend. He keeps trying to convince me he's a compulsive liar, but I don't believe him.'
  ];
  
  const activateFelix = () => {
    userMadeDecisionRef.current = false;
    setIsInactive(false);
    setIsActive(true);
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set timeout for deactivation if no command is selected
    timeoutRef.current = setTimeout(() => {
      if (!userMadeDecisionRef.current) {
        setIsActive(false);
        setIsInactive(true);
        setTimeout(() => {
          setIsInactive(false);
        }, DEACTIVATION_TIME_MS);
      }
    }, ACTIVE_TIME_MS);
  };
  
  const deactivateFelix = () => {
    userMadeDecisionRef.current = true;
    setIsActive(false);
    setIsInactive(true);
    
    setTimeout(() => {
      setIsInactive(false);
    }, DEACTIVATION_TIME_MS);
  };
  
  const getWeather = () => {
    setResponseMessage("El clima realmente está algo impredecible hoy, y sé que querías el clima en tu ubicación, pero así es la vida.");
    showResponse();
  };
  
  const getTime = () => {
    const today = new Date();
    const time = today.getHours() + ":" + (today.getMinutes() < 10 ? '0' : '') + today.getMinutes();
    setResponseMessage(`¿Quizás es hora de que consigas un reloj? Solo bromeo... No. En serio... Son las ${time}.`);
    showResponse();
  };
  
  const getDate = () => {
    const today = new Date();
    const date = today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear();
    setResponseMessage(`Un calendario es una gran inversión, ¿sabes? Incluso tu computadora tiene uno. Ya que preguntaste, hoy es ${date}.`);
    showResponse();
  };
  
  const tellJoke = () => {
    const index = Math.floor(Math.random() * jokes.length);
    setResponseMessage(jokes[index]);
    showResponse();
  };
  
  const searchGoogle = () => {
    deactivateFelix();
    window.open("https://www.google.com/", "_blank");
  };
  
  const showInspiration = () => {
    deactivateFelix();
    window.open("https://youtu.be/GXTnf6owAcA", "_blank");
  };
  
  const showResponse = () => {
    setResponseActive(true);
    deactivateFelix();
  };
  
  const closeResponse = () => {
    setResponseActive(false);
  };
  
  // Cleanup effect to clear timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return (
    <div className="felix-container">
      <h1 className="display-3 felix-title"><span>H</span>ola <span>a</span>migo!</h1>
      <p className="lead felix-lead">Conoce a Indiamoon, tu nuevo asistente personal con una personalidad excepcional.</p>
      
      <div className="personal-assistant">
        <div 
          ref={felixRef}
          className={`felix ${isActive ? 'active' : ''} ${isInactive ? 'inactive' : ''}`} 
          onClick={activateFelix}
        >
          <div className="eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
        </div>
        <div className="platform"></div>
        <ul className="command-list">
          <li><i className="far fa-cloud" onClick={getWeather}></i></li>
          <li><i className="far fa-clock" onClick={getTime}></i></li>
          <li><i className="far fa-calendar-alt" onClick={getDate}></i></li>
          <li><i className="far fa-grin-squint-tears" onClick={tellJoke}></i></li>
          <li><i className="far fa-search" onClick={searchGoogle}></i></li>
          <li><i className="far fa-lightbulb" onClick={showInspiration}></i></li>
          <p className="hey-felix lead"></p>
        </ul>
      </div>
      
      <div className={`response-frame ${responseActive ? 'active' : ''}`}>
        <p className="lead response-message">{responseMessage}</p>
        <i className="fas fa-times" onClick={closeResponse}></i>
      </div>
    </div>
  );
};

export default Felix;