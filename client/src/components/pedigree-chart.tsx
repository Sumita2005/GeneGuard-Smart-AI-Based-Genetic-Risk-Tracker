import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useColorBlindStyles } from "@/hooks/use-color-blind-styles";
import { Users, Heart, Brain, Activity } from "lucide-react";

interface PedigreeNode {
  id: string;
  name: string;
  gender: 'male' | 'female';
  generation: number;
  position: number;
  conditions: string[];
  isProband?: boolean;
}

interface PedigreeChartProps {
  familyMembers?: any[];
  compact?: boolean;
}

export default function PedigreeChart({ familyMembers = [], compact = false }: PedigreeChartProps) {
  const { getRiskStyles, isColorBlindMode } = useColorBlindStyles();

  // Sample family data for demo purposes
  const sampleNodes: PedigreeNode[] = [
    // Grandparents (Generation 0)
    { id: 'gf1', name: 'John Sr.', gender: 'male', generation: 0, position: 0, conditions: ['Heart Disease'] },
    { id: 'gm1', name: 'Mary Sr.', gender: 'female', generation: 0, position: 1, conditions: [] },
    { id: 'gf2', name: 'Robert', gender: 'male', generation: 0, position: 2, conditions: ['Diabetes'] },
    { id: 'gm2', name: 'Susan', gender: 'female', generation: 0, position: 3, conditions: ['Breast Cancer'] },
    
    // Parents (Generation 1)
    { id: 'f1', name: 'John Jr.', gender: 'male', generation: 1, position: 0, conditions: [] },
    { id: 'm1', name: 'Sarah', gender: 'female', generation: 1, position: 1, conditions: [] },
    
    // Current generation (Generation 2)
    { id: 'p1', name: 'You', gender: 'female', generation: 2, position: 0, conditions: [], isProband: true },
    { id: 's1', name: 'Brother', gender: 'male', generation: 2, position: 1, conditions: [] },
  ];

  const nodes = familyMembers.length > 0 ? convertFamilyMembersToNodes(familyMembers) : sampleNodes;

  function convertFamilyMembersToNodes(members: any[]): PedigreeNode[] {
    return members.map((member, index) => ({
      id: member.id.toString(),
      name: member.name,
      gender: member.gender?.toLowerCase() || 'female',
      generation: getGenerationFromRelation(member.relation),
      position: index,
      conditions: member.medicalConditions || [],
      isProband: member.relation === 'self'
    }));
  }

  function getGenerationFromRelation(relation: string): number {
    const grandparentTerms = ['grandfather', 'grandmother', 'grandparent'];
    const parentTerms = ['father', 'mother', 'parent'];
    const selfTerms = ['self'];
    const siblingTerms = ['brother', 'sister', 'sibling'];
    
    if (grandparentTerms.some(term => relation.toLowerCase().includes(term))) return 0;
    if (parentTerms.some(term => relation.toLowerCase().includes(term))) return 1;
    if (selfTerms.some(term => relation.toLowerCase().includes(term))) return 2;
    if (siblingTerms.some(term => relation.toLowerCase().includes(term))) return 2;
    
    return 2; // Default to current generation
  }

  const getNodeIcon = (gender: string) => {
    if (gender === 'male') return '□';
    return '○';
  };

  const getConditionIcon = (condition: string) => {
    if (condition.toLowerCase().includes('heart')) return <Heart className="w-3 h-3" />;
    if (condition.toLowerCase().includes('diabetes')) return <Activity className="w-3 h-3" />;
    if (condition.toLowerCase().includes('cancer')) return <Brain className="w-3 h-3" />;
    return <Users className="w-3 h-3" />;
  };

  const generations = [
    { level: 0, title: 'Grandparents', nodes: nodes.filter(n => n.generation === 0) },
    { level: 1, title: 'Parents', nodes: nodes.filter(n => n.generation === 1) },
    { level: 2, title: 'Your Generation', nodes: nodes.filter(n => n.generation === 2) },
  ];

  if (compact) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Family Tree Preview</span>
            </h3>
            <Badge variant="outline" className="text-xs">
              {nodes.length} members
            </Badge>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center">
            {nodes.slice(0, 4).map((node) => (
              <div key={node.id} className="space-y-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                  ${node.isProband 
                    ? 'bg-purple-600 text-white' 
                    : node.conditions.length > 0 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }
                `}>
                  {getNodeIcon(node.gender)}
                </div>
                <div className="text-xs text-gray-600 truncate">{node.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Family Pedigree Chart</span>
          </h2>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border-2 border-gray-400"></div>
              <span>Male</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
              <span>Female</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              <span>You</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {generations.map((generation, genIndex) => (
            <div key={generation.level} className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                {generation.title}
              </h3>
              
              <div className="flex justify-center space-x-6">
                {generation.nodes.map((node, nodeIndex) => (
                  <div key={node.id} className="text-center space-y-2">
                    {/* Connection lines */}
                    {genIndex > 0 && (
                      <div className="h-4 flex items-center justify-center">
                        <div className="w-px h-4 bg-gray-300"></div>
                      </div>
                    )}
                    
                    {/* Node */}
                    <div className="relative">
                      <div className={`
                        w-16 h-16 border-2 flex items-center justify-center text-lg font-bold
                        ${node.gender === 'male' ? 'border-blue-500' : 'rounded-full border-pink-500'}
                        ${node.isProband 
                          ? 'bg-purple-600 text-white border-purple-600' 
                          : node.conditions.length > 0 
                            ? (isColorBlindMode ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-red-100 border-red-500 text-red-700')
                            : 'bg-gray-50 border-gray-400 text-gray-700'
                        }
                      `}>
                        {getNodeIcon(node.gender)}
                      </div>
                      
                      {/* Condition indicators */}
                      {node.conditions.length > 0 && (
                        <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {node.conditions.length}
                        </div>
                      )}
                    </div>
                    
                    {/* Name */}
                    <div className="text-sm font-medium text-gray-900">{node.name}</div>
                    
                    {/* Conditions */}
                    {node.conditions.length > 0 && (
                      <div className="space-y-1">
                        {node.conditions.slice(0, 2).map((condition, idx) => (
                          <div key={idx} className="flex items-center justify-center space-x-1">
                            {getConditionIcon(condition)}
                            <span className="text-xs text-gray-600 truncate max-w-20">
                              {condition}
                            </span>
                          </div>
                        ))}
                        {node.conditions.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{node.conditions.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Horizontal connection lines for siblings */}
              {generation.nodes.length > 1 && genIndex > 0 && (
                <div className="flex justify-center">
                  <div className="border-t border-gray-300 w-1/2"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Heart Disease</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <span>Diabetes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-500" />
              <span>Cancer</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>Other Conditions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}