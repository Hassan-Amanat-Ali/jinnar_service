export const ROLES = {
  CUSTOMER: "customer",
  WORKER: "worker",
};

// Map API role values to app role constants
export const mapApiRoleToAppRole = (apiRole) => {
  const roleMap = {
    buyer: ROLES.CUSTOMER,
    customer: ROLES.CUSTOMER,
    seller: ROLES.WORKER,
    worker: ROLES.WORKER,
  };
  return roleMap[apiRole?.toLowerCase()] || null;
};
