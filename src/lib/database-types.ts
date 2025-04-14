// Role type
export type ContractPermissionRole =
  | "reader"
  | "writer"
  | "validator"
  | "owner";

export interface ContractPreview {
  id: string;
  name: string;
  fields_count: number;
  role: ContractPermissionRole;
}

// DTO for the contract_links table
export interface ContractLinkDTO {
  id?: string;
  contract_id: string;
  token: string;
  created_at?: string;
  expires_at?: string | null;
  is_active: boolean;
}

// Application-level type for ContractLink
export interface ContractLink {
  id?: string;
  contractId: string;
  token: string;
  createdAt?: string;
  expiresAt?: string | null;
  isActive: boolean;
}

// Mapper functions
export const mapToContractLink = (dto: ContractLinkDTO): ContractLink => ({
  id: dto.id,
  contractId: dto.contract_id,
  token: dto.token,
  createdAt: dto.created_at,
  expiresAt: dto.expires_at,
  isActive: dto.is_active,
});

export const mapToContractLinkDTO = (app: ContractLink): ContractLinkDTO => ({
  id: app.id,
  contract_id: app.contractId,
  token: app.token,
  created_at: app.createdAt,
  expires_at: app.expiresAt,
  is_active: app.isActive,
});

// DTO for the contract_permissions table
export interface ContractPermissionDTO {
  id: string;
  contract_id: string;
  user_id: string;
  role: ContractPermissionRole;
  created_at: string;
}

// Application-level type for ContractPermission
export interface ContractPermission {
  id: string;
  contractId: string;
  userId: string;
  role: ContractPermissionRole;
  createdAt: Date;
}

// Mapper functions
export const mapToContractPermission = (
  dto: ContractPermissionDTO
): ContractPermission => ({
  id: dto.id,
  contractId: dto.contract_id,
  userId: dto.user_id,
  role: dto.role,
  createdAt: new Date(dto.created_at),
});

export const mapToContractPermissionDTO = (
  app: ContractPermission
): ContractPermissionDTO => ({
  id: app.id,
  contract_id: app.contractId,
  user_id: app.userId,
  role: app.role,
  created_at: app.createdAt.toISOString(),
});
