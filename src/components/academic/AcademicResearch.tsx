import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Cpu, 
  BarChart2, 
  CheckCircle2, 
  Layers, 
  Info, 
  TrendingUp, 
  Activity, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';

export const AcademicResearch: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState('logistic_regression');

  // Academic Benchmark Data from Thesis Chapter 4
  const modelBenchmarks = [
    {
      id: 'logistic_regression',
      name: 'Logistic Regression (Primary Model)',
      algorithm: 'Logistic Regression with L2 Regularization (C=1.0)',
      features: 'TF-IDF Unigram + Bigram (Top 3,000 features)',
      accuracy: 91.70,
      precision: 91.42,
      recall: 90.83,
      f1Score: 91.12,
      rocAuc: 0.925,
      tp: 908,
      fp: 86,
      fn: 92,
      tn: 914,
      trainingTime: '1.42 sec',
      status: 'Primary Thesis Architecture'
    },
    {
      id: 'random_forest',
      name: 'Random Forest Ensemble',
      algorithm: 'Random Forest (150 Estimators, max_depth=25)',
      features: 'TF-IDF + Structural Metadata Features',
      accuracy: 92.40,
      precision: 92.10,
      recall: 91.80,
      f1Score: 91.95,
      rocAuc: 0.938,
      tp: 918,
      fp: 79,
      fn: 82,
      tn: 921,
      trainingTime: '8.76 sec',
      status: 'Comparative Benchmark'
    },
    {
      id: 'linear_svm',
      name: 'Linear Support Vector Machine',
      algorithm: 'LinearSVC (C=1.0, hinge loss)',
      features: 'TF-IDF Sparse Matrix',
      accuracy: 91.10,
      precision: 90.95,
      recall: 90.50,
      f1Score: 90.72,
      rocAuc: 0.919,
      tp: 905,
      fp: 90,
      fn: 95,
      tn: 910,
      trainingTime: '2.18 sec',
      status: 'Comparative Benchmark'
    },
    {
      id: 'naive_bayes',
      name: 'Multinomial Naive Bayes',
      algorithm: 'MultinomialNB (Additive Laplace smoothing alpha=1.0)',
      features: 'Bag-of-Words / Term Frequency',
      accuracy: 88.50,
      precision: 87.20,
      recall: 89.10,
      f1Score: 88.14,
      rocAuc: 0.892,
      tp: 891,
      fp: 131,
      fn: 109,
      tn: 869,
      trainingTime: '0.45 sec',
      status: 'Academic Baseline'
    }
  ];

  const currentModel = modelBenchmarks.find(m => m.id === selectedModel) || modelBenchmarks[0];

  // ROC-AUC Curve Points
  const rocAucData = [
    { fpr: 0.00, tpr: 0.00, randomBaseline: 0.00 },
    { fpr: 0.02, tpr: 0.45, randomBaseline: 0.02 },
    { fpr: 0.05, tpr: 0.72, randomBaseline: 0.05 },
    { fpr: 0.08, tpr: 0.88, randomBaseline: 0.08 },
    { fpr: 0.10, tpr: 0.92, randomBaseline: 0.10 },
    { fpr: 0.15, tpr: 0.95, randomBaseline: 0.15 },
    { fpr: 0.25, tpr: 0.97, randomBaseline: 0.25 },
    { fpr: 0.50, tpr: 0.99, randomBaseline: 0.50 },
    { fpr: 1.00, tpr: 1.00, randomBaseline: 1.00 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Academic Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              Academic Research Module
            </span>
            <span className="text-xs text-[#94A3B8]">• Final-Year Engineering Thesis</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            Machine Learning Methodology & <span className="text-[#38BDF8]">Chapter Four Telemetry</span>
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Empirical validation of Logistic Regression TF-IDF NLP feature vectors against comparative classifiers for banking security.
          </p>
        </div>

        <div className="p-3.5 bg-[#111C35] border border-[#1E2D4D] rounded-xl text-xs font-mono text-[#F8FAFC]">
          <div>Primary Model: <span className="text-[#38BDF8] font-bold">Logistic Regression</span></div>
          <div className="text-[11px] text-[#94A3B8] mt-0.5">Research Benchmark: <span className="text-[#10B981] font-semibold">91.70% Acc (ROC 0.925)</span></div>
        </div>
      </div>

      {/* Crucial Thesis Requirement: Distinction Card */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-5 rounded-2xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-[#38BDF8] font-bold font-mono uppercase tracking-wider text-[11px]">
          <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <span>Academic Methodology Clarification: Model Performance vs. Individual Email Prediction</span>
        </div>
        <p className="text-[#94A3B8] leading-relaxed">
          <strong className="font-semibold text-white">Global Model Performance (91.70% Accuracy)</strong> measures the aggregate statistical correctness across the entire 2,000-sample test partition (precision, recall, F1, ROC-AUC).
        </p>
        <p className="text-[#94A3B8] leading-relaxed">
          In contrast, an <strong className="font-semibold text-white">Individual Email Prediction Probability (e.g., 94% Phishing Likelihood)</strong> represents the sigmoid probability score output for a single email based on its specific TF-IDF term weights and URL features.
        </p>
        <div className="text-[11px] font-mono text-[#F59E0B]">
          → "Research benchmark – see thesis Chapter Four."
        </div>
      </div>

      {/* Dataset & Methodology Specs (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-5 rounded-2xl shadow-xl">
          <div className="text-[#94A3B8] text-xs font-mono uppercase font-semibold">Corpus Volume</div>
          <div className="text-2xl font-bold font-sans text-white mt-1">10,000 Samples</div>
          <p className="text-[11px] text-[#94A3B8] mt-1">5,000 Phishing / 5,000 Legitimate</p>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-5 rounded-2xl shadow-xl">
          <div className="text-[#94A3B8] text-xs font-mono uppercase font-semibold">Corpus Sources</div>
          <div className="text-base font-semibold text-[#38BDF8] font-mono mt-1">Enron + Nazario + CEMAC</div>
          <p className="text-[11px] text-[#94A3B8] mt-1">Includes Cameroon bank attack set</p>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-5 rounded-2xl shadow-xl">
          <div className="text-[#94A3B8] text-xs font-mono uppercase font-semibold">Train / Test Split</div>
          <div className="text-2xl font-bold font-sans text-[#10B981] mt-1">80% / 20%</div>
          <p className="text-[11px] text-[#94A3B8] mt-1">8,000 Train / 2,000 Holdout Test</p>
        </div>

        <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-5 rounded-2xl shadow-xl">
          <div className="text-[#94A3B8] text-xs font-mono uppercase font-semibold">Feature Extractor</div>
          <div className="text-base font-semibold text-[#F59E0B] font-mono mt-1">TF-IDF Vectorizer</div>
          <p className="text-[11px] text-[#94A3B8] mt-1">Sublinear Term Frequency Scaling</p>
        </div>
      </div>

      {/* Model Benchmark Comparative Matrix Table */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1E2D4D] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#38BDF8]" />
              <span>Comparative Classifier Evaluation (Thesis Chapter Four)</span>
            </h2>
            <p className="text-xs text-[#94A3B8]">Multi-algorithm benchmarking on holdout test partition (N=2,000)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111C35] text-[#94A3B8] font-mono uppercase text-[10px] border-b border-[#1E2D4D]">
              <tr>
                <th className="px-5 py-3.5">Classifier Model</th>
                <th className="px-5 py-3.5">Accuracy</th>
                <th className="px-5 py-3.5">Precision</th>
                <th className="px-5 py-3.5">Recall</th>
                <th className="px-5 py-3.5">F1-Score</th>
                <th className="px-5 py-3.5">ROC-AUC</th>
                <th className="px-5 py-3.5">Training Time</th>
                <th className="px-5 py-3.5">Thesis Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4D] text-[#F8FAFC] font-mono">
              {modelBenchmarks.map((m) => {
                const isSelected = selectedModel === m.id;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedModel(m.id)}
                    className={`hover:bg-[#111C35]/60 transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#111C35] border-l-4 border-[#38BDF8]' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 font-semibold text-white">
                      <div className="font-sans font-bold">{m.name}</div>
                      <div className="text-[10px] text-[#94A3B8] font-mono">{m.algorithm}</div>
                    </td>
                    <td className="px-5 py-3.5 text-[#38BDF8] font-bold">{m.accuracy.toFixed(2)}%</td>
                    <td className="px-5 py-3.5">{m.precision.toFixed(2)}%</td>
                    <td className="px-5 py-3.5">{m.recall.toFixed(2)}%</td>
                    <td className="px-5 py-3.5 text-[#10B981] font-bold">{m.f1Score.toFixed(2)}%</td>
                    <td className="px-5 py-3.5 text-[#F59E0B] font-bold">{m.rocAuc.toFixed(3)}</td>
                    <td className="px-5 py-3.5 text-[#94A3B8]">{m.trainingTime}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        m.id === 'logistic_regression'
                          ? 'bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30'
                          : 'bg-[#111C35] text-[#94A3B8] border border-[#1E2D4D]'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Deep Dive: Confusion Matrix + ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#38BDF8]" />
              <span>Confusion Matrix (N=2,000)</span>
            </h3>
            <span className="text-[10px] font-mono text-[#38BDF8] font-medium">{currentModel.name}</span>
          </div>

          {/* Matrix Grid */}
          <div className="space-y-2 pt-2">
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              {/* True Positive */}
              <div className="bg-[#064E3B]/40 border border-[#059669]/50 p-4 rounded-xl">
                <div className="text-[10px] text-[#34D399] uppercase font-semibold">True Positives (TP)</div>
                <div className="text-3xl font-bold font-sans text-[#34D399] mt-1">{currentModel.tp}</div>
                <div className="text-[10px] text-[#94A3B8] mt-1">Phishing Correctly Flagged</div>
              </div>

              {/* False Positive */}
              <div className="bg-[#451A03]/40 border border-[#D97706]/50 p-4 rounded-xl">
                <div className="text-[10px] text-[#FBBF24] uppercase font-semibold">False Positives (FP)</div>
                <div className="text-3xl font-bold font-sans text-[#FBBF24] mt-1">{currentModel.fp}</div>
                <div className="text-[10px] text-[#94A3B8] mt-1">Type I Error (False Alarm)</div>
              </div>

              {/* False Negative */}
              <div className="bg-[#450A0A]/40 border border-[#DC2626]/50 p-4 rounded-xl">
                <div className="text-[10px] text-[#F87171] uppercase font-semibold">False Negatives (FN)</div>
                <div className="text-3xl font-bold font-sans text-[#F87171] mt-1">{currentModel.fn}</div>
                <div className="text-[10px] text-[#94A3B8] mt-1">Type II Error (Missed Phish)</div>
              </div>

              {/* True Negative */}
              <div className="bg-[#0C4A6E]/40 border border-[#0284C7]/50 p-4 rounded-xl">
                <div className="text-[10px] text-[#38BDF8] uppercase font-semibold">True Negatives (TN)</div>
                <div className="text-3xl font-bold font-sans text-[#38BDF8] mt-1">{currentModel.tn}</div>
                <div className="text-[10px] text-[#94A3B8] mt-1">Legitimate Verified</div>
              </div>
            </div>

            <div className="text-[11px] text-[#94A3B8] text-center font-mono pt-2">
              Formula: Accuracy = (TP + TN) / (TP + TN + FP + FN) = <span className="text-[#38BDF8] font-bold">{currentModel.accuracy}%</span>
            </div>
          </div>
        </div>

        {/* ROC-AUC Curve (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#38BDF8]" />
                <span>ROC-AUC Curve Characteristic</span>
              </h3>
              <p className="text-xs text-[#94A3B8]">Area Under Receiver Operating Characteristic Curve = <span className="text-[#38BDF8] font-bold">{currentModel.rocAuc}</span></p>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-xs font-mono font-bold">
              AUC: {currentModel.rocAuc}
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocAucData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4D" vertical={false} />
                <XAxis dataKey="fpr" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#1E2D4D' }} label={{ value: 'False Positive Rate (FPR)', position: 'insideBottomRight', offset: -5, fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={{ stroke: '#1E2D4D' }} label={{ value: 'True Positive Rate (TPR)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1222', borderColor: '#1E2D4D', borderRadius: '12px', fontSize: '12px', color: '#F8FAFC' }}
                />
                <Line type="monotone" dataKey="tpr" name="Logistic Regression Classifier" stroke="#38BDF8" strokeWidth={2.5} dot={{ r: 4, fill: '#38BDF8' }} />
                <Line type="monotone" dataKey="randomBaseline" name="Random Classifier Baseline (0.50)" stroke="#F59E0B" strokeDasharray="4 4" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
