/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

export default function TemperatureFetch() {
  const [temp, setTemp] = useState("");

  // Recebe os dados da API do Arduino
  const fetchArduino = async () => {
    try {
      const response = await fetch('http://localhost:3001/arduino')
      const data = await response.json();
      setTemp(data);
      // console.log(data);  // Apenas para verificação
    } catch (error) { console.error(error) }
    // console.log(temp); // Apenas para verificação
  };
  
  const temperature = temp.dados * 1;

  const changeBackGroundColor = () => {
    // colorH 0 (red) a 240 (azul)
    let colorH = (240 - (temperature * 3.5).toFixed(0));
    // console.log(colorH); // Apenas para verificação
    document.body.style.backgroundColor = `hsl(${colorH}, 100%, 50%)`;
  };
  
  useEffect(() => {
  setInterval(() => {
      fetchArduino();
  }, 1000);
  }, []);

  useEffect(() => {
      changeBackGroundColor();
    }, [temp]);

  return (
    <div>
     <h1>React Componente Temp</h1>
     <h1>{`Temperatura: ${temp.dados}°C`}</h1>
     </div>
  );
}
