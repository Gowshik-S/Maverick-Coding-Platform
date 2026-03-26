import React from 'react';
import { Screen } from '../App';
import { getAssessment, submitAssessment } from '../lib/api';
import { loadSession } from '../lib/session';

type AssessmentIDEProps = {
  onNavigate: (s: Screen) => void;
  onNotify?: (message: string) => void;
};

export default function AssessmentIDE({ onNavigate, onNotify }: AssessmentIDEProps) {
  const [question, setQuestion] = React.useState<any>(null);
  const [solutionCode, setSolutionCode] = React.useState('');
  const [utilsCode, setUtilsCode] = React.useState('');
  const [activeFile, setActiveFile] = React.useState<'solution.py' | 'utils.py'>('solution.py');
  const [activePane, setActivePane] = React.useState<'testcases' | 'result'>('testcases');
  const [activeCaseIndex, setActiveCaseIndex] = React.useState(0);
  const [lastResult, setLastResult] = React.useState<any>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    const session = loadSession();
    if (!session?.user_id) {
      onNotify?.('Please login first');
      onNavigate('login');
      return;
    }
    (async () => {
      try {
        const q = await getAssessment(session.user_id);
        setQuestion(q);
        setSolutionCode(String(q?.starter_code || ''));
        setUtilsCode('');
        setActiveCaseIndex(0);
        setActivePane('testcases');
        setLastResult(null);
      } catch (err: any) {
        onNotify?.(err.message || 'Failed to load assessment');
      }
    })();
  }, [onNavigate, onNotify]);

  const submit = async () => {
    const session = loadSession();
    if (!session?.user_id) {
      onNotify?.('Please login first');
      return;
    }
    try {
      setSubmitting(true);
      const combinedCode = `${utilsCode.trim()}\n\n${solutionCode}`.trim();
      const result = await submitAssessment(session.user_id, combinedCode, 0, 0);
      setLastResult(result);
      setActivePane('result');
      onNotify?.(`Submitted: score ${result.score}/${100}`);
    } catch (err: any) {
      onNotify?.(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const comingSoon = () => onNotify?.('Coming soon');

  const description = String(question?.description || 'Loading assessment...');
  const title = String(question?.title || 'Assessment');
  const difficultyLabel = String(question?.difficulty_label || 'intermediate');
  const constraints: string[] = Array.isArray(question?.constraints) ? question.constraints : [];
  const testCases: Array<{ input_args?: unknown[]; expected_output?: unknown }> = Array.isArray(question?.test_cases)
    ? question.test_cases
    : [];
  const activeCase = testCases[activeCaseIndex] || null;
  const editorCode = activeFile === 'solution.py' ? solutionCode : utilsCode;
  const displayLines = Math.max(10, editorCode.split('\n').length);

  const updateEditorCode = (value: string) => {
    if (activeFile === 'solution.py') {
      setSolutionCode(value);
      return;
    }
    setUtilsCode(value);
  };

  const resetActiveFile = () => {
    if (activeFile === 'solution.py') {
      setSolutionCode(String(question?.starter_code || ''));
      return;
    }
    setUtilsCode('');
  };

  const formatValue = (value: unknown) => {
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  return (
    <div className="h-screen bg-surface-dim text-on-surface font-sans flex flex-col overflow-hidden">
      
      {/* Top Banner */}
      <div className="h-12 bg-surface-container-low border-b border-outline-variant/20 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
            <span className="text-[10px] font-bold text-error uppercase tracking-widest">AI ASSESSMENT IN PROGRESS</span>
          </div>
          <span className="text-outline-variant">|</span>
          <span className="text-xs font-mono text-on-surface-variant">Session ID: MAV-8842-X</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 font-mono text-sm text-white bg-surface-container-highest px-3 py-1 border border-outline-variant/30">
            <span className="material-symbols-outlined text-sm text-primary">timer</span>
            00:45:12
          </div>
          <button onClick={() => onNavigate('dashboard')} className="text-xs font-bold text-outline hover:text-white uppercase tracking-widest transition-colors">
            Finish Session
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Slim Sidebar */}
        <aside className="w-14 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col items-center py-4 shrink-0 z-10">
          <div className="w-8 h-8 bg-primary flex items-center justify-center mb-8 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="material-symbols-outlined text-on-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>code_blocks</span>
          </div>
          <nav className="flex flex-col gap-6 w-full">
            <button className="w-full flex justify-center text-primary relative group">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            </button>
            <button onClick={comingSoon} className="w-full flex justify-center text-outline-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">forum</span>
            </button>
            <button onClick={comingSoon} className="w-full flex justify-center text-outline-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">history</span>
            </button>
            <button onClick={comingSoon} className="w-full flex justify-center text-outline-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </nav>
        </aside>

        {/* Left Panel - Problem Description */}
        <div className="w-1/3 bg-surface-container-low border-r border-outline-variant/20 flex flex-col shrink-0">
          <div className="h-12 border-b border-outline-variant/20 flex items-center px-6 bg-surface-container-highest/50">
            <h2 className="text-sm font-bold text-white tracking-wide">1. {title}</h2>
            <span className="ml-3 text-[10px] font-bold text-tertiary uppercase tracking-widest bg-tertiary/10 px-2 py-0.5 border border-tertiary/30">{difficultyLabel}</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-on-surface-variant leading-relaxed mb-6">
                {description}
              </p>

              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 border-b border-outline-variant/20 pb-2">Example:</h3>
              <div className="bg-surface-container-lowest p-4 border border-outline-variant/10 font-mono text-xs text-on-surface-variant mb-6 rounded-sm">
                <span className="text-outline">Input:</span> {String(question?.examples?.[0]?.input || 'Loading...')}<br/>
                <span className="text-outline">Output:</span> {String(question?.examples?.[0]?.output || '--')}<br/>
                <span className="text-outline">Explanation:</span> {String(question?.examples?.[0]?.explanation || '--')}
              </div>

              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 border-b border-outline-variant/20 pb-2">Constraints:</h3>
              <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-2 font-mono text-xs">
                {constraints.length ? constraints.map((line, index) => <li key={`${line}-${index}`}>{line}</li>) : <li>Loading constraints...</li>}
              </ul>
            </div>
            
            <div className="mt-12 p-4 bg-primary/5 border border-primary/20">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-sm mt-0.5">lightbulb</span>
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Maverick AI Hint</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    A brute force approach takes O(n²) time. Can you think of a way to do it in O(n) time using a hash map to store previously seen values?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Editor & Console */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Editor Section */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Editor Toolbar */}
            <div className="h-12 border-b border-outline-variant/20 flex items-center justify-between px-4 bg-surface-container-low shrink-0">
              <div className="flex items-center gap-1 bg-surface-container-highest p-1 border border-outline-variant/20">
                <button
                  onClick={() => setActiveFile('solution.py')}
                  className={`px-3 py-1 text-xs border transition-colors ${activeFile === 'solution.py' ? 'font-bold text-white bg-surface-container-low border-outline-variant/30' : 'font-medium text-outline-variant border-transparent hover:text-white'}`}
                >
                  solution.py
                </button>
                <button
                  onClick={() => setActiveFile('utils.py')}
                  className={`px-3 py-1 text-xs border transition-colors ${activeFile === 'utils.py' ? 'font-bold text-white bg-surface-container-low border-outline-variant/30' : 'font-medium text-outline-variant border-transparent hover:text-white'}`}
                >
                  utils.py
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 border border-outline-variant/20 cursor-pointer hover:border-outline-variant/50 transition-colors">
                  <span className="text-xs font-bold text-white">Python 3</span>
                  <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                </div>
                <button onClick={resetActiveFile} className="text-outline-variant hover:text-white transition-colors" title="Reset Code">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
                <button onClick={comingSoon} className="text-outline-variant hover:text-white transition-colors" title="Editor Settings">
                  <span className="material-symbols-outlined text-sm">settings</span>
                </button>
              </div>
            </div>

            {/* Code Area */}
            <div className="flex-1 flex bg-[#0e0e0e] overflow-hidden font-mono text-[13px] leading-relaxed">
              {/* Line Numbers */}
              <div className="w-12 bg-[#0e0e0e] border-r border-outline-variant/10 text-right pr-3 py-4 text-outline-variant/50 select-none shrink-0 flex flex-col">
                {Array.from({ length: displayLines }, (_, index) => (
                  <span key={`line-${index + 1}`}>{index + 1}</span>
                ))}
              </div>
              <textarea
                value={editorCode}
                onChange={(e) => updateEditorCode(e.target.value)}
                className="flex-1 p-4 overflow-auto custom-scrollbar whitespace-pre text-[#e5e2e1] bg-transparent outline-none resize-none"
                title="Code editor"
                aria-label="Code editor"
                placeholder="Write your solution here"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Console Section */}
          <div className="h-64 border-t border-outline-variant/20 flex flex-col bg-surface-container-low shrink-0">
            {/* Console Toolbar */}
            <div className="h-10 border-b border-outline-variant/20 flex items-center justify-between px-4 bg-surface-container-highest/50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActivePane('testcases')}
                  className={`h-10 px-2 text-xs transition-colors ${activePane === 'testcases' ? 'font-bold text-white border-b-2 border-primary' : 'font-medium text-outline-variant hover:text-white'}`}
                >
                  Testcases
                </button>
                <button
                  onClick={() => setActivePane('result')}
                  className={`h-10 px-2 text-xs transition-colors ${activePane === 'result' ? 'font-bold text-white border-b-2 border-primary' : 'font-medium text-outline-variant hover:text-white'}`}
                >
                  Test Result
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={comingSoon} className="bg-surface-container-highest border border-outline-variant/30 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 hover:bg-surface-container-high transition-colors">
                  Run
                </button>
                <button onClick={submit} disabled={submitting || !solutionCode.trim()} className="kinetic-monolith-gradient text-on-primary font-bold text-xs uppercase tracking-widest px-6 py-1.5 hover:brightness-110 transition-all disabled:opacity-70">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
            
            {/* Console Content */}
            <div className="flex-1 p-4 overflow-auto custom-scrollbar flex flex-col gap-4">
              {activePane === 'testcases' ? (
                <>
                  <div className="flex gap-2 flex-wrap">
                    {testCases.length ? testCases.map((_, index) => (
                      <button
                        key={`case-${index + 1}`}
                        onClick={() => setActiveCaseIndex(index)}
                        className={`text-xs px-3 py-1 font-mono transition-colors ${activeCaseIndex === index ? 'bg-surface-container-highest border border-outline-variant/30 text-white' : 'bg-surface-container-lowest border border-transparent text-outline-variant hover:text-white'}`}
                      >
                        Case {index + 1}
                      </button>
                    )) : <span className="text-xs text-on-surface-variant">No test cases available yet.</span>}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">input_args =</span>
                      <div className="bg-surface-container-lowest border border-outline-variant/10 p-2 font-mono text-xs text-white rounded-sm whitespace-pre-wrap break-all">
                        {activeCase ? formatValue(activeCase.input_args ?? []) : '--'}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">expected_output =</span>
                      <div className="bg-surface-container-lowest border border-outline-variant/10 p-2 font-mono text-xs text-white rounded-sm whitespace-pre-wrap break-all">
                        {activeCase ? formatValue(activeCase.expected_output) : '--'}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">score</span>
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-2 font-mono text-xs text-white rounded-sm">
                      {lastResult ? `${lastResult.score}/100` : 'Submit your code to see results'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">test cases</span>
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-2 font-mono text-xs text-white rounded-sm">
                      {lastResult ? `${lastResult.test_cases_passed}/${lastResult.test_cases_total}` : '--'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">feedback</span>
                    <div className="bg-surface-container-lowest border border-outline-variant/10 p-2 font-mono text-xs text-white rounded-sm whitespace-pre-wrap break-words">
                      {lastResult ? String(lastResult.feedback || lastResult.evaluation_error || '--') : '--'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
