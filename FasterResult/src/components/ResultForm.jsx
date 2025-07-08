import React, { useState, useEffect } from 'react';

const boards = [
  { value: '', label: 'Select One' },
  { value: 'barisal', label: 'Barishal' },
  { value: 'chittagong', label: 'Chattogram' },
  { value: 'comilla', label: 'Cumilla' },
  { value: 'dhaka', label: 'Dhaka' },
  { value: 'dinajpur', label: 'Dinajpur' },
  { value: 'jessore', label: 'Jashore' },
  { value: 'madrasah', label: 'Madrasah' },
  { value: 'rajshahi', label: 'Rajshahi' },
  { value: 'sylhet', label: 'Sylhet' },
  { value: 'mymensingh', label: 'Mymensingh' },
  { value: 'tec', label: 'Technical' },
];

const years = Array.from({ length: 30 }, (_, i) => 2025 - i);

const resultTypes = [
  { value: '', label: 'Select One' },
  { value: '1', label: 'Individual/Detailed Result' },
  { value: '8', label: 'Individual/Detailed Rescrutiny/Others Result' },
  { value: '2', label: 'Institution Result' },
  { value: '4', label: 'Center Result' },
  { value: '5', label: 'District Result' },
  { value: '6', label: 'Institution Analytics' },
  { value: '7', label: 'Board Analytics' },
];

const getCaptchaUrl = () => "/.netlify/functions/get-captcha";
const getResultUrl = () => "/.netlify/functions/get-result";

export default function ResultForm() {
  const [form, setForm] = useState({
    exam: 'ssc',
    year: years[0],
    board: '',
    result_type: '1',
    roll: '',
    reg: '',
    captcha: '',
  });
  const [captchaImg, setCaptchaImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Fetch captcha on mount and on reload
  const fetchCaptcha = async () => {
    setCaptchaImg(null);
    try {
      const res = await fetch(getCaptchaUrl());
      const data = await res.json();
      setCaptchaImg(data.image);
    } catch (e) {
      setCaptchaImg(null);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReloadCaptcha = e => {
    e.preventDefault();
    fetchCaptcha();
    setForm({ ...form, captcha: '' });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const res = await fetch(getResultUrl(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (res.ok && data.html) {
          setResult(<div dangerouslySetInnerHTML={{ __html: data.html }} />);
          setLoading(false);
          return;
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        attempts++;
        if (attempts >= maxAttempts) {
          setError('Failed to fetch result. Please try again later.');
          setLoading(false);
          fetchCaptcha();
          return;
        }
        await new Promise(r => setTimeout(r, 1000 * attempts)); // Exponential backoff
      }
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block font-semibold mb-1">Year</label>
        <select name="year" value={form.year} onChange={handleChange} className="w-full border rounded px-3 py-2">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Board</label>
        <select name="board" value={form.board} onChange={handleChange} className="w-full border rounded px-3 py-2">
          {boards.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Result Type</label>
        <select name="result_type" value={form.result_type} onChange={handleChange} className="w-full border rounded px-3 py-2">
          {resultTypes.map(rt => <option key={rt.value} value={rt.value}>{rt.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Roll Number</label>
        <input name="roll" type="number" value={form.roll} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Registration Number</label>
        <input name="reg" type="number" value={form.reg} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block font-semibold mb-1">Captcha</label>
        <div className="flex items-center space-x-2">
          {captchaImg ? (
            <img src={captchaImg} alt="Captcha" className="h-10 w-24 border rounded" />
          ) : (
            <span className="text-gray-400">Loading...</span>
          )}
          <button type="button" className="text-blue-600 underline text-sm" onClick={handleReloadCaptcha} disabled={loading}>Reload</button>
        </div>
        <input name="captcha" type="number" value={form.captcha} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-2" required />
      </div>
      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
        {loading ? 'Checking...' : 'View Result'}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {result && <div className="bg-green-50 border border-green-200 rounded p-3 mt-4 text-green-800">{result}</div>}
    </form>
  );
} 