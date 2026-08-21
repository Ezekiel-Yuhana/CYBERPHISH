import React, { useState } from 'react';
import { 
  Cpu, 
  Sliders, 
  Send, 
  CheckCircle2, 
  Terminal, 
  Layers, 
  Info, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ModelVersion } from '../../types';
import { storageService } from '../../services/storageService';
import { runMlPrediction } from '../../services/mlEngine';

export const ModelManagement: React.FC = () => {
  const [models] = useState<ModelVersion[]>(storageService.getModels());
  const [weights, setWeights] = useState(storageService.getRiskWeights());
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ML REST API Interactive Sandbox State (Requirement #11)
  const [jsonRequest, setJsonRequest] = useState(JSON.stringify({
    subject: "URGENT: Your BICEC Bank account will be suspended",
    body: "Verify your credentials and OTP immediately at http://194.26.29.112/bicec/login",
    sender: "security@bicec-auth-portal.net",
    urls: ["http://194.26.29.112/bicec/login"]
  }, null, 2));

  const [jsonResponse, setJsonResponse] = useState<any>(null);
  const [isCallingApi, setIsCallingApi] = useState(false);

  const handleSaveWeights = () => {
    storageService.setRiskWeights(weights.mlWeight, weights.indicatorWeight);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleTestMlApi = () => {
    setIsCallingApi(true);
    setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonRequest);
        const result = runMlPrediction({
          subject: parsed.subject || '',
          body: parsed.body || '',
          sender: parsed.sender || '',
          urls: parsed.urls || []
        });

        // Exact JSON REST API contract required by Requirement #11
        const apiResponse = {
          classification: result.classification,
          probability: result.probability,
          model: result.model,
          modelVersion: result.modelVersion,
          topFeatures: result.topFeatures,
          status: "SUCCESS"
        };
        setJsonResponse(apiResponse);
      } catch (err: any) {
        setJsonResponse({
          status: "ERROR",
          message: `Invalid JSON payload: ${err.message}`
        });
      }
      setIsCallingApi(false);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0F172A]/90 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] uppercase font-mono font-semibold tracking-wider">
              Machine Learning Operations
            </span>
            <span className="text-xs text-[#94A3B8]">• Model Registry & Scoring Tuning</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1 font-sans">
            Model Management & <span className="text-[#38BDF8]">ML Inference REST API</span>
          </h1>
        </div>
      </div>

      {/* Model Versions Registry Table */}
      <div className="bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1E2D4D] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#38BDF8]" />
            <span>Registered Model Versions</span>
          </h2>
          <span className="text-xs font-mono text-[#94A3B8]">Production Active: v1.0.4</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111C35] text-[#94A3B8] uppercase text-[10px] border-b border-[#1E2D4D]">
              <tr>
                <th className="px-5 py-3.5">Model Name</th>
                <th className="px-5 py-3.5">Version</th>
                <th className="px-5 py-3.5">Algorithm</th>
                <th className="px-5 py-3.5">Accuracy</th>
                <th className="px-5 py-3.5">Precision</th>
                <th className="px-5 py-3.5">Recall</th>
                <th className="px-5 py-3.5">F1-Score</th>
                <th className="px-5 py-3.5">ROC-AUC</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4D] text-[#F8FAFC]">
              {models.map(m => (
                <tr key={m.id} className="hover:bg-[#111C35]/60 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-white font-sans">{m.modelName}</td>
                  <td className="px-5 py-3.5 text-[#38BDF8] font-bold">{m.version}</td>
                  <td className="px-5 py-3.5 text-[#94A3B8] font-sans">{m.algorithm}</td>
                  <td className="px-5 py-3.5 text-[#34D399] font-bold">{m.accuracy.toFixed(2)}%</td>
                  <td className="px-5 py-3.5">{m.precisionScore.toFixed(2)}%</td>
                  <td className="px-5 py-3.5">{m.recallScore.toFixed(2)}%</td>
                  <td className="px-5 py-3.5">{m.f1Score.toFixed(2)}%</td>
                  <td className="px-5 py-3.5 text-[#FBBF24] font-bold">{m.rocAuc.toFixed(3)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'ACTIVE' ? 'bg-[#064E3B] text-[#34D399] border border-[#059669]/50' :
                      m.status === 'BENCHMARK' ? 'bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30' :
                      'bg-[#111C35] text-[#94A3B8]'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2 Column Layout: Weight Configuration & ML REST API Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Scoring Weight Tuner (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2D4D] pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#38BDF8]" />
              <span>Risk Scoring Weight Formula</span>
            </h2>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Tune the balance between statistical Machine Learning inference vs. deterministic heuristic cybersecurity indicators.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex items-center justify-between text-xs font-mono font-semibold mb-1">
                <span className="text-[#38BDF8]">Machine Learning Weight:</span>
                <span className="text-[#38BDF8] font-bold">{Math.round(weights.mlWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={weights.mlWeight}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWeights({ mlWeight: val, indicatorWeight: Number((1.0 - val).toFixed(2)) });
                }}
                className="w-full h-2 bg-[#111C35] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-mono font-semibold mb-1">
                <span className="text-[#FBBF24]">Rule Indicators Weight:</span>
                <span className="text-[#FBBF24] font-bold">{Math.round(weights.indicatorWeight * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={weights.indicatorWeight}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWeights({ indicatorWeight: val, mlWeight: Number((1.0 - val).toFixed(2)) });
                }}
                className="w-full h-2 bg-[#111C35] rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
              />
            </div>

            {/* Formula Preview Box */}
            <div className="p-3.5 bg-[#111C35] rounded-xl border border-[#1E2D4D] text-xs font-mono text-[#F8FAFC] space-y-1">
              <div className="text-[10px] text-[#94A3B8] uppercase">Current Mathematical Formula:</div>
              <div className="text-[#38BDF8] font-bold">
                riskScore = (ML_Prob × {weights.mlWeight.toFixed(2)}) + (IndicatorScore × {weights.indicatorWeight.toFixed(2)})
              </div>
            </div>

            <button
              onClick={handleSaveWeights}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Scoring Weights</span>
            </button>

            {saveSuccess && (
              <div className="p-2.5 text-center text-xs text-[#34D399] bg-[#064E3B]/60 rounded-xl border border-[#059669]/50">
                Scoring weights updated successfully in backend storage!
              </div>
            )}
          </div>
        </div>

        {/* ML REST API Sandbox Tester (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F172A]/85 backdrop-blur-md border border-[#1E2D4D] p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2D4D] pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#38BDF8]" />
              <span>ML REST API Contract Test Sandbox</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#0C4A6E]/60 text-[#38BDF8] border border-[#0284C7]/30 text-[10px] font-mono font-bold">
              POST /api/ml/predict
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Request JSON */}
            <div>
              <label className="block text-[11px] font-mono text-[#94A3B8] font-semibold mb-1">
                JSON Request Payload:
              </label>
              <textarea
                rows={9}
                value={jsonRequest}
                onChange={(e) => setJsonRequest(e.target.value)}
                className="w-full p-2.5 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-[#38BDF8] font-mono text-xs focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]"
              />
            </div>

            {/* Response JSON */}
            <div>
              <label className="block text-[11px] font-mono text-[#94A3B8] font-semibold mb-1">
                Validated JSON Response:
              </label>
              <div className="w-full p-2.5 bg-[#0B1222] border border-[#1E2D4D] rounded-xl text-[#34D399] font-mono text-xs h-[180px] overflow-y-auto whitespace-pre">
                {jsonResponse ? JSON.stringify(jsonResponse, null, 2) : '// Click "Dispatch Prediction API" to test endpoint contract'}
              </div>
            </div>
          </div>

          <button
            onClick={handleTestMlApi}
            disabled={isCallingApi}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isCallingApi ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Simulating API Inference...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Dispatch Prediction API (POST /api/ml/predict)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
