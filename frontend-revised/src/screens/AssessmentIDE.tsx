import React from 'react';
import { Screen } from '../App';

export default function AssessmentIDE({ onNavigate }: { onNavigate: (s: Screen) => void }) {
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
            <button className="w-full flex justify-center text-outline-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">forum</span>
            </button>
            <button className="w-full flex justify-center text-outline-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">history</span>
            </button>
            <button className="w-full flex justify-center text-outline-variant hover:text-white transition-colors">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </nav>
        </aside>

        {/* Left Panel - Problem Description */}
        <div className="w-1/3 bg-surface-container-low border-r border-outline-variant/20 flex flex-col shrink-0">
          <div className="h-12 border-b border-outline-variant/20 flex items-center px-6 bg-surface-container-highest/50">
            <h2 className="text-sm font-bold text-white tracking-wide">1. Two Sum</h2>
            <span className="ml-3 text-[10px] font-bold text-tertiary uppercase tracking-widest bg-tertiary/10 px-2 py-0.5 border border-tertiary/30">Easy</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-on-surface-variant leading-relaxed mb-6">
                Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.
              </p>
              <p className="text-on-surface-variant leading-relaxed mb-6">
                You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.
              </p>
              <p className="text-on-surface-variant leading-relaxed mb-8">
                You can return the answer in any order.
              </p>

              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 border-b border-outline-variant/20 pb-2">Example 1:</h3>
              <div className="bg-surface-container-lowest p-4 border border-outline-variant/10 font-mono text-xs text-on-surface-variant mb-6 rounded-sm">
                <span className="text-outline">Input:</span> nums = [2,7,11,15], target = 9<br/>
                <span className="text-outline">Output:</span> [0,1]<br/>
                <span className="text-outline">Explanation:</span> Because nums[0] + nums[1] == 9, we return [0, 1].
              </div>

              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 border-b border-outline-variant/20 pb-2">Example 2:</h3>
              <div className="bg-surface-container-lowest p-4 border border-outline-variant/10 font-mono text-xs text-on-surface-variant mb-6 rounded-sm">
                <span className="text-outline">Input:</span> nums = [3,2,4], target = 6<br/>
                <span className="text-outline">Output:</span> [1,2]
              </div>

              <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-3 border-b border-outline-variant/20 pb-2">Constraints:</h3>
              <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-2 font-mono text-xs">
                <li>2 &lt;= nums.length &lt;= 10<sup>4</sup></li>
                <li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
                <li>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></li>
                <li><strong>Only one valid answer exists.</strong></li>
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
                <button className="px-3 py-1 text-xs font-bold text-white bg-surface-container-low border border-outline-variant/30">solution.py</button>
                <button className="px-3 py-1 text-xs font-medium text-outline-variant hover:text-white transition-colors">utils.py</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1 border border-outline-variant/20 cursor-pointer hover:border-outline-variant/50 transition-colors">
                  <span className="text-xs font-bold text-white">Python 3</span>
                  <span className="material-symbols-outlined text-[14px] text-outline">expand_more</span>
                </div>
                <button className="text-outline-variant hover:text-white transition-colors" title="Reset Code">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
                <button className="text-outline-variant hover:text-white transition-colors" title="Editor Settings">
                  <span className="material-symbols-outlined text-sm">settings</span>
                </button>
              </div>
            </div>

            {/* Code Area */}
            <div className="flex-1 flex bg-[#0e0e0e] overflow-hidden font-mono text-[13px] leading-relaxed">
              {/* Line Numbers */}
              <div className="w-12 bg-[#0e0e0e] border-r border-outline-variant/10 text-right pr-3 py-4 text-outline-variant/50 select-none shrink-0 flex flex-col">
                <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span>
              </div>
              {/* Code Content */}
              <div className="flex-1 p-4 overflow-auto custom-scrollbar whitespace-pre text-[#e5e2e1]">
                <span className="code-glow-orange">class</span> <span className="code-glow-teal">Solution</span>:<br/>
                {'    '}<span className="code-glow-orange">def</span> <span className="code-glow-teal">twoSum</span>(<span className="code-glow-orange">self</span>, nums: <span className="code-glow-teal">List</span>[<span className="code-glow-teal">int</span>], target: <span className="code-glow-teal">int</span>) -&gt; <span className="code-glow-teal">List</span>[<span className="code-glow-teal">int</span>]:<br/>
                {'        '}<span className="text-outline-variant/70 italic"># Initialize a hash map to store value -&gt; index</span><br/>
                {'        '}seen = {'{}'}<br/>
                <br/>
                {'        '}<span className="code-glow-orange">for</span> i, num <span className="code-glow-orange">in</span> <span className="code-glow-teal">enumerate</span>(nums):<br/>
                {'            '}complement = target - num<br/>
                <br/>
                {'            '}<span className="code-glow-orange">if</span> complement <span className="code-glow-orange">in</span> seen:<br/>
                {'                '}<span className="code-glow-orange">return</span> [seen[complement], i]<br/>
                <br/>
                {'            '}seen[num] = i<br/>
                <br/>
                {'        '}<span className="code-glow-orange">return</span> [] <span className="text-outline-variant/70 italic"># Should not reach here per constraints</span><br/>
                <div className="w-2 h-4 bg-primary/50 animate-pulse inline-block align-middle ml-1"></div>
              </div>
            </div>
          </div>

          {/* Console Section */}
          <div className="h-64 border-t border-outline-variant/20 flex flex-col bg-surface-container-low shrink-0">
            {/* Console Toolbar */}
            <div className="h-10 border-b border-outline-variant/20 flex items-center justify-between px-4 bg-surface-container-highest/50">
              <div className="flex items-center gap-4">
                <button className="text-xs font-bold text-white border-b-2 border-primary h-10 px-2">Testcases</button>
                <button className="text-xs font-medium text-outline-variant hover:text-white h-10 px-2 transition-colors">Test Result</button>
              </div>
              <div className="flex items-center gap-2">
                <button className="bg-surface-container-highest border border-outline-variant/30 text-white font-bold text-xs uppercase tracking-widest px-4 py-1.5 hover:bg-surface-container-high transition-colors">
                  Run
                </button>
                <button className="kinetic-monolith-gradient text-on-primary font-bold text-xs uppercase tracking-widest px-6 py-1.5 hover:brightness-110 transition-all">
                  Submit
                </button>
              </div>
            </div>
            
            {/* Console Content */}
            <div className="flex-1 p-4 overflow-auto custom-scrollbar flex flex-col gap-4">
              <div className="flex gap-2">
                <button className="bg-surface-container-highest border border-outline-variant/30 text-white text-xs px-3 py-1 font-mono">Case 1</button>
                <button className="bg-surface-container-lowest border border-transparent text-outline-variant hover:text-white text-xs px-3 py-1 font-mono transition-colors">Case 2</button>
                <button className="bg-surface-container-lowest border border-transparent text-outline-variant hover:text-white text-xs px-3 py-1 font-mono transition-colors">Case 3</button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">nums =</span>
                  <div className="bg-surface-container-lowest border border-outline-variant/10 p-2 font-mono text-xs text-white rounded-sm">
                    [2,7,11,15]
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest block mb-1">target =</span>
                  <div className="bg-surface-container-lowest border border-outline-variant/10 p-2 font-mono text-xs text-white rounded-sm">
                    9
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
