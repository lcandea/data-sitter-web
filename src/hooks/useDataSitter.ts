import {
  contractFromImportData,
  formatContractForExport,
} from "@/lib/contract-utils";
import { Contract, DataInput } from "@/lib/types";
import { ContractFormat, DataSitterValidator, Validation } from "data-sitter";

export const useDataSitter = () => {
  const getRepresentation = async (
    content: string,
    fileType: ContractFormat
  ): Promise<Contract> => {
    const validator = new DataSitterValidator(content);
    const response = await validator.getRepresentation(fileType);
    return contractFromImportData(response);
  };

  const validateCsv = async (
    contract: Contract,
    csvContent: string
  ): Promise<Validation[]> => {
    const validator = new DataSitterValidator(
      formatContractForExport(contract)
    );
    const response = await validator.validateCsv(csvContent);
    return response;
  };

  const validateData = async (
    contract: Contract,
    data: DataInput
  ): Promise<Validation[]> => {
    const validator = new DataSitterValidator(
      formatContractForExport(contract)
    );

    const response = await validator.validateData(data);
    return response;
  };

  return { getRepresentation, validateCsv, validateData };
};
