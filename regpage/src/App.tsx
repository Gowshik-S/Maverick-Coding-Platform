/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Step1 from './pages/Step1';
import Step2 from './pages/Step2';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/step-1" replace />} />
        <Route path="/step-1" element={<Step1 />} />
        <Route path="/step-2" element={<Step2 />} />
      </Routes>
    </BrowserRouter>
  );
}
