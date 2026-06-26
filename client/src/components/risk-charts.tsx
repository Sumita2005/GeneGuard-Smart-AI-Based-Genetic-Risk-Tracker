import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RiskChartsProps {
  riskAssessments: any[];
  type: 'overall' | 'detailed';
}

export default function RiskCharts({ riskAssessments, type }: RiskChartsProps) {
  if (!riskAssessments || riskAssessments.length === 0) {
    return <div className="text-center text-slate-500 py-8">No risk data available</div>;
  }

  const getOverallRiskScore = () => {
    const totalScore = riskAssessments.reduce((sum, assessment) => sum + assessment.riskScore, 0);
    return Math.round(totalScore / riskAssessments.length);
  };

  const COLORS = {
    high: '#EF4444',
    medium: '#F59E0B', 
    low: '#22C55E'
  };

  if (type === 'overall') {
    const overallScore = getOverallRiskScore();
    const riskLevel = overallScore >= 70 ? 'high' : overallScore >= 40 ? 'medium' : 'low';
    
    const data = [
      { name: 'Risk Score', value: overallScore, color: COLORS[riskLevel] },
      { name: 'Remaining', value: 100 - overallScore, color: '#E5E7EB' }
    ];

    return (
      <div className="relative w-64 h-64 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              startAngle={90}
              endAngle={450}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <div className={`text-4xl font-bold ${riskLevel === 'high' ? 'text-red-500' : riskLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'}`}>
            {overallScore}
          </div>
          <div className="text-sm text-slate-600">Risk Score</div>
          <div className="text-xs text-slate-500 mt-1">
            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
          </div>
        </div>
      </div>
    );
  }

  if (type === 'detailed') {
    const chartData = riskAssessments.map(assessment => ({
      condition: assessment.condition.replace(' Type 2', '').replace(' Disease', ''),
      riskScore: assessment.riskScore,
      familyHistory: assessment.factors?.familyHistory || 0,
      lifestyle: assessment.factors?.lifestyle || 0,
      environmental: assessment.factors?.environmental || 0,
      age: assessment.factors?.age || 0,
      fill: assessment.riskLevel === 'high' ? COLORS.high : 
            assessment.riskLevel === 'medium' ? COLORS.medium : COLORS.low
    }));

    return (
      <div className="space-y-8">
        {/* Risk Scores Bar Chart */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Risk Scores by Condition</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="condition" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Risk Score']}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="riskScore" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Factors Breakdown */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Risk Factors Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="condition"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="familyHistory" stackId="a" fill="#8B5CF6" name="Family History" />
              <Bar dataKey="lifestyle" stackId="a" fill="#F59E0B" name="Lifestyle" />
              <Bar dataKey="environmental" stackId="a" fill="#3B82F6" name="Environmental" />
              <Bar dataKey="age" stackId="a" fill="#6B7280" name="Age" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return null;
}
