import { useState, useEffect } from 'react';

export function usePyodide() {
  const [pyodide, setPyodide] = useState<any>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      const pyodideInstance = await (window as any).loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/",
      });
      setPyodide(pyodideInstance);
    };

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.20.0/full/pyodide.js";
    script.async = true;
    script.onload = loadPyodide;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return pyodide;
}