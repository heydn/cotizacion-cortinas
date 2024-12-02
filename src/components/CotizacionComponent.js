// src/components/CotizacionComponent.js
import React, { useState } from "react";
import NavBar from "./NavBar";

function CotizacionComponent() {
  const [tipoTela, setTipoTela] = useState("");
  const [tipoCadena, setTipoCadena] = useState("");
  const [conCenefa, setConCenefa] = useState(false);
  const [conMotor, setConMotor] = useState(false);
  const [ancho, setAncho] = useState(0);
  const [largo, setLargo] = useState(0);
  const [montoTotal, setMontoTotal] = useState(0);

  const calcularMonto = () => {
    let monto = 0;
    if (conCenefa) monto += 50;
    if (conMotor) monto += 100;
    monto += ancho * largo * 2;
    setMontoTotal(monto);
  };

  return (
    <div>
      <NavBar />
      <div className="p-6">
        <h2 className="text-2xl mb-4">Cotización de Cortinas</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            calcularMonto();
          }}
        >
          {/* Campos del formulario para la cotización */}
          <div className="mb-4">
            <label className="block">Tipo de Tela:</label>
            <select
              value={tipoTela}
              onChange={(e) => setTipoTela(e.target.value)}
              className="border p-2"
            >
              <option value="tela1">Tela 1</option>
              <option value="tela2">Tela 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block">Tipo de Cadena:</label>
            <select
              value={tipoCadena}
              onChange={(e) => setTipoCadena(e.target.value)}
              className="border p-2"
            >
              <option value="cadena1">Cadena 1</option>
              <option value="cadena2">Cadena 2</option>
            </select>
          </div>
          <div className="mb-4">
            <label>
              <input
                type="checkbox"
                checked={conCenefa}
                onChange={() => setConCenefa(!conCenefa)}
              />
              Con Cenefa
            </label>
          </div>
          <div className="mb-4">
            <label>
              <input
                type="checkbox"
                checked={conMotor}
                onChange={() => setConMotor(!conMotor)}
              />
              Con Motor
            </label>
          </div>
          <div className="mb-4">
            <label className="block">Ancho (metros):</label>
            <input
              type="number"
              value={ancho}
              onChange={(e) => setAncho(e.target.value)}
              className="border p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block">Largo (metros):</label>
            <input
              type="number"
              value={largo}
              onChange={(e) => setLargo(e.target.value)}
              className="border p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded"
          >
            Calcular Monto
          </button>
        </form>
        {montoTotal > 0 && (
          <p className="mt-4 text-xl">Monto Total: ${montoTotal}</p>
        )}
      </div>
    </div>
  );
}

export default CotizacionComponent;
