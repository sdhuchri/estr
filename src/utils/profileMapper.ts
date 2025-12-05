// Utility function to map profile codes to readable labels
export const getProfileLabel = (profileCode: string): string => {
  const profileMap: Record<string, string> = {
    'estr_opr_cab': 'Operator Cabang',
    'estr_spv_cab': 'Supervisor Cabang',
    'estr_opr_kp': 'Operator Kantor Pusat',
    'estr_spv_kp': 'Supervisor Kantor Pusat',
    'estr_opr_kep': 'Operator Kepatuhan',
    'estr_spv_kep': 'Supervisor Kepatuhan',
  };

  return profileMap[profileCode] || profileCode;
};
