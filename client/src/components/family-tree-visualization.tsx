import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Users, Heart, Calendar } from "lucide-react";
import type { FamilyMember } from "@shared/schema";

interface FamilyTreeVisualizationProps {
  familyMembers: FamilyMember[];
  viewMode: "visual" | "list" | "timeline";
  currentUserId: number;
}

export default function FamilyTreeVisualization({ 
  familyMembers, 
  viewMode,
  currentUserId 
}: FamilyTreeVisualizationProps) {
  
  const getRiskLevel = (conditions: string[]) => {
    if (conditions.length >= 2) return "high";
    if (conditions.length === 1) return "medium";
    return "low";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const groupByRelation = (members: FamilyMember[]) => {
    const groups: Record<string, FamilyMember[]> = {};
    members.forEach(member => {
      const relation = member.relation;
      if (!groups[relation]) groups[relation] = [];
      groups[relation].push(member);
    });
    return groups;
  };

  if (viewMode === "visual") {
    const parents = familyMembers.filter(m => 
      m.relation === "father" || m.relation === "mother"
    );
    const siblings = familyMembers.filter(m => 
      m.relation === "brother" || m.relation === "sister"
    );
    const grandparents = familyMembers.filter(m => 
      m.relation.includes("grandfather") || m.relation.includes("grandmother")
    );

    return (
      <div className="space-y-12">
        {/* Grandparents */}
        {grandparents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Grandparents</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              {grandparents.map((member) => (
                <FamilyMemberCard key={member.id} member={member} size="sm" />
              ))}
            </div>
          </div>
        )}

        {/* Parents */}
        {parents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Parents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
              {parents.map((member) => (
                <FamilyMemberCard key={member.id} member={member} size="md" />
              ))}
            </div>
          </div>
        )}

        {/* User (Center) */}
        <div className="flex justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-32 h-32 bg-health-primary rounded-full flex items-center justify-center shadow-lg mx-auto">
                <div className="text-center text-white">
                  <User className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-sm font-medium">You</div>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-semibold text-slate-900">You</div>
              <div className="text-sm text-slate-500">Primary User</div>
            </div>
          </div>
        </div>

        {/* Siblings */}
        {siblings.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4 text-center">Siblings</h3>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {siblings.map((member) => (
                  <FamilyMemberCard key={member.id} member={member} size="md" />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (viewMode === "list") {
    const groupedMembers = groupByRelation(familyMembers);

    return (
      <div className="space-y-6">
        {Object.entries(groupedMembers).map(([relation, members]) => (
          <div key={relation}>
            <h3 className="text-lg font-semibold mb-3 capitalize">
              {relation.replace(/_/g, ' ')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <Card key={member.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-slate-500">
                          {member.age ? `${member.age} years` : 'Age unknown'}
                          {member.isDeceased && ' (Deceased)'}
                        </p>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(getRiskLevel(member.medicalConditions || []))}`} />
                    </div>
                    {member.medicalConditions && member.medicalConditions.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-slate-600">Conditions:</p>
                        <div className="flex flex-wrap gap-1">
                          {member.medicalConditions.map((condition, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === "timeline") {
    const timelineEvents = familyMembers
      .filter(member => member.medicalConditions && member.medicalConditions.length > 0)
      .flatMap(member => 
        member.medicalConditions?.map(condition => ({
          member: member.name,
          condition,
          age: member.diagnosisAges?.[condition] || member.age || 0,
          relation: member.relation
        })) || []
      )
      .sort((a, b) => (a.age || 0) - (b.age || 0));

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-5 h-5 text-health-primary" />
          <h3 className="text-lg font-semibold">Family Health Timeline</h3>
        </div>
        
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-health-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {event.age}
              </div>
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-900">{event.member}</h4>
                    <Badge variant="outline" className="text-xs">
                      {event.relation.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-slate-600">Diagnosed with {event.condition}</p>
                  <p className="text-xs text-slate-500 mt-1">Age at diagnosis: {event.age}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

interface FamilyMemberCardProps {
  member: FamilyMember;
  size: "sm" | "md" | "lg";
}

function FamilyMemberCard({ member, size }: FamilyMemberCardProps) {
  const getRiskLevel = (conditions: string[]) => {
    if (conditions.length >= 2) return "high";
    if (conditions.length === 1) return "medium";
    return "low";
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24", 
    lg: "w-32 h-32"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const riskLevel = getRiskLevel(member.medicalConditions || []);

  return (
    <div className="text-center">
      <div className="relative">
        <div className={`${sizeClasses[size]} bg-slate-200 rounded-full flex items-center justify-center shadow-md card-hover cursor-pointer ${member.isDeceased ? 'opacity-60' : ''}`}>
          <div className="text-center text-slate-600">
            <User className={`${iconSizes[size]} mx-auto mb-1`} />
            <div className="text-xs">{member.relation.replace(/_/g, ' ')}</div>
          </div>
        </div>
        <div className={`absolute -top-1 -right-1 w-5 h-5 ${getRiskColor(riskLevel)} rounded-full`} />
      </div>
      <div className="mt-2">
        <div className="font-medium text-slate-900">{member.name}</div>
        <div className="text-xs text-slate-500">
          {member.age ? `${member.age} years` : 'Age unknown'}
          {member.isDeceased && ' (Deceased)'}
        </div>
        {member.medicalConditions && member.medicalConditions.length > 0 && (
          <div className="text-xs text-slate-600 mt-1">
            {member.medicalConditions.slice(0, 2).join(', ')}
            {member.medicalConditions.length > 2 && '...'}
          </div>
        )}
      </div>
    </div>
  );
}
