/**
 * Calculates a weighted compliance score for UK solar installer SMEs.
 * 
 * Formula Weights:
 * 1. Checklist Completion (50%): Ratio of ticked tasks.
 * 2. Mandatory Documents (30%): 10% each for having uploaded:
 *    - Public Liability Insurance (insurance)
 *    - MCS Accreditation Certificate (mcs-certificate)
 *    - NIC EIC / NAPIT Competent Person Certificate (electrical-certificate)
 * 3. Risk Mitigation Ratio (20%): Percentage of active risks that are 'Mitigated' or 'Reviewed'.
 */
export function calculateComplianceScore(checklists = [], documents = [], risks = []) {
  // 1. Checklist Component (50%)
  const totalTasks = checklists.length;
  const completedTasks = checklists.filter(t => t.completed).length;
  const checklistScore = totalTasks > 0 ? (completedTasks / totalTasks) * 50 : 0;

  // 2. Mandatory Document Component (30%)
  const hasInsurance = documents.some(d => d.documentType === "insurance");
  const hasMcs = documents.some(d => d.documentType === "mcs-certificate");
  const hasElectrical = documents.some(d => d.documentType === "electrical-certificate");
  
  let docCount = 0;
  if (hasInsurance) docCount += 10;
  if (hasMcs) docCount += 10;
  if (hasElectrical) docCount += 10;
  const documentScore = docCount; // Max 30%

  // 3. Risk Mitigation Component (20%)
  const totalRisks = risks.length;
  const mitigatedRisks = risks.filter(r => r.status === "Mitigated" || r.status === "Reviewed").length;
  const riskScore = totalRisks > 0 ? (mitigatedRisks / totalRisks) * 20 : 20; // Default to 20 if no risks are defined (healthy state)

  const overallScore = Math.round(checklistScore + documentScore + riskScore);

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    breakdown: {
      checklist: {
        score: Math.round((checklistScore / 50) * 100),
        completed: completedTasks,
        total: totalTasks
      },
      documents: {
        score: Math.round((documentScore / 30) * 100),
        uploaded: [hasInsurance, hasMcs, hasElectrical].filter(Boolean).length,
        total: 3,
        missing: {
          insurance: !hasInsurance,
          mcs: !hasMcs,
          electrical: !hasElectrical
        }
      },
      risks: {
        score: Math.round((riskScore / 20) * 100),
        mitigated: mitigatedRisks,
        total: totalRisks
      }
    }
  };
}
