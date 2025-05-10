import { useState, useCallback, useEffect, useRef } from 'react';

function App() {
  // State variables
  const [length, setLength] = useState(12);                // Password length
  const [includeNumbers, setIncludeNumbers] = useState(true); // Include digits?
  const [includeSymbols, setIncludeSymbols] = useState(true); // Include special chars?
  const [password, setPassword] = useState('');            // Final password
  const [copied, setCopied] = useState(false);             // Copy feedback

  // useRef to select input content
  const passwordRef = useRef(null);

  // Password generation logic
  const generatePassword = useCallback(() => {
    let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-={}[]|\\:;"<>,.?/~';

    let generatedPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    setPassword(generatedPassword);
    setCopied(false); // reset copied status
  }, [length, includeNumbers, includeSymbols]);

  // Copy password to clipboard
  const copyToClipboard = useCallback(() => {
    if (passwordRef.current) {
      passwordRef.current.select();
      navigator.clipboard.writeText(password);
      setCopied(true);

      // Reset copied state after a short delay
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  // Generate password on first load and whenever settings change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 p-5">
      <div className="bg-gray-900 w-full max-w-lg rounded-2xl shadow-lg text-white p-6">
        <h1 className="text-3xl font-bold text-center mb-6">🔐 Password Generator</h1>

        {/* Password Output */}
        <div className="flex items-center rounded-lg overflow-hidden border border-gray-600 mb-4">
          <input
            type="text"
            readOnly
            value={password}
            ref={passwordRef}
            className="w-full bg-transparent px-3 py-2 outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 font-semibold"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Length Slider */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Password Length: {length}</label>
          <input
            type="range"
            min={6}
            max={32}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full cursor-pointer accent-yellow-500"
          />
        </div>

        {/* Checkboxes for options */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <label htmlFor="number" className="text-sm">Include Numbers</label>
            <input
              id="number"
              type="checkbox"
              checked={includeNumbers}
              onChange={() => setIncludeNumbers(prev => !prev)}
              className="w-5 h-5 accent-yellow-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="symbols" className="text-sm">Include Special Characters</label>
            <input
              id="symbols"
              type="checkbox"
              checked={includeSymbols}
              onChange={() => setIncludeSymbols(prev => !prev)}
              className="w-5 h-5 accent-yellow-500"
            />
          </div>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={generatePassword}
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-2 rounded-lg font-semibold"
        >
          🔄 Generate New Password
        </button>
      </div>
    </div>
  );
}

export default App;
