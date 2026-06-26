import { QRCodeSVG } from 'qrcode.react';

interface HealthPassportPDFProps {
  user: any;
  riskAssessments: any[];
  familyMembers: any[];
  recommendations: any[];
  passport: any;
}

export default function HealthPassportPDF({ 
  user, 
  riskAssessments, 
  familyMembers, 
  recommendations,
  passport 
}: HealthPassportPDFProps) {
  const priorityRecommendations = recommendations.filter(r => r.priority === 'high' && !r.completed);

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="pdf-content">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Health Passport</h1>
            <h2 className="text-xl font-semibold text-gray-700">{user?.name}</h2>
            <p className="text-gray-600 mt-1">
              {user?.gender && `${user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}, `}
              Age: {user?.age}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Generated on {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            {passport?.shareableLink && (
              <div className="mb-2">
                <QRCodeSVG value={passport.shareableLink} size={100} />
              </div>
            )}
            <p className="text-xs text-gray-500">Scan for online access</p>
            <p className="text-xs text-gray-600 mt-1 font-mono">
              ID: {passport?.passportId}
            </p>
          </div>
        </div>
      </div>

      {/* Risk Assessment Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Genetic Risk Assessment</h3>
        <div className="grid grid-cols-2 gap-4">
          {riskAssessments.map((assessment, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">{assessment.condition}</span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                assessment.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                assessment.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {assessment.riskLevel.toUpperCase()} ({assessment.riskScore}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Family Medical History */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Medical History</h3>
        <div className="bg-gray-50 rounded p-4">
          <ul className="space-y-2 text-sm">
            {familyMembers.slice(0, 6).map((member, index) => (
              <li key={index} className="text-gray-700">
                <strong>{member.name}</strong> ({member.relation.replace(/_/g, ' ')}): {
                  member.medicalConditions?.length > 0 
                    ? member.medicalConditions.join(', ')
                    : 'No significant conditions'
                }{member.age && `, Age: ${member.age}`}
              </li>
            ))}
            {familyMembers.length === 0 && (
              <li className="text-gray-500 italic">No family medical history recorded</li>
            )}
          </ul>
        </div>
      </div>

      {/* Priority Recommendations */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Health Actions</h3>
        <div className="space-y-3">
          {priorityRecommendations.slice(0, 5).map((rec, index) => (
            <div key={index} className={`flex items-start space-x-3 p-3 rounded border-l-4 ${
              rec.priority === 'high' ? 'bg-red-50 border-red-400' :
              rec.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
              'bg-green-50 border-green-400'
            }`}>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{rec.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                {rec.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">Due: {rec.dueDate}</p>
                )}
              </div>
            </div>
          ))}
          {priorityRecommendations.length === 0 && (
            <p className="text-gray-500 italic">No high-priority recommendations at this time.</p>
          )}
        </div>
      </div>

      {/* Current Health Profile */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Health Profile</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-green-600">
              {user?.lifestyle?.exerciseLevel || 'N/A'}
            </div>
            <div className="text-xs text-gray-600">Exercise Level</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-blue-600">
              {user?.lifestyle?.dietType || 'N/A'}
            </div>
            <div className="text-xs text-gray-600">Diet Type</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="text-lg font-bold text-purple-600">
              {user?.lifestyle?.smokingStatus === 'never' ? 'Non-smoker' :
               user?.lifestyle?.smokingStatus === 'former' ? 'Former' :
               user?.lifestyle?.smokingStatus === 'current' ? 'Current' : 'N/A'}
            </div>
            <div className="text-xs text-gray-600">Smoking Status</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-4 text-center text-xs text-gray-500">
        <p className="font-semibold">GeneGuard Smart Genetic Risk Tracker</p>
        <p>This report contains confidential health information. Share only with authorized healthcare providers.</p>
        <p className="mt-2">For questions or updates, contact your healthcare provider or visit our platform.</p>
      </div>
    </div>
  );
}
