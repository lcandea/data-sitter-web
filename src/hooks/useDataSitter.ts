import { useEffect, useState } from "react";
import {
  contractFromImportData,
  formatContractForExport,
} from "@/lib/contract-utils";
import { Contract, DataInput } from "@/lib/types";
import * as ds from "data-sitter";

export const useDataSitter = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await ds.initializeDataSitter();
        setInitialized(true);
      } catch (err) {
        console.error(`Failed to initialize Data Sitter: ${err}`);
      }
    };

    initialize();
  }, []);

  const getRepresentation = async (
    content: string,
    fileType: "YAML" | "JSON"
  ): Promise<Contract> => {
    const response = await ds.getRepresentation(content, fileType);
    if (!response.success) throw new Error(response.error);
    if (!response.result) throw new Error("No result from the representation.");
    return contractFromImportData(response.result);
  };

  const validateCsv = async (
    contract: Contract,
    csvContent: string
  ): Promise<ds.Validation[]> => {
    const response = await ds.validateCsv(
      formatContractForExport(contract),
      csvContent
    );
    if (!response.success) throw new Error(response.error);
    if (!response.result) throw new Error("No result from validate CSV.");
    return response.result;
  };

  const validateData = async (
    contract: Contract,
    data: DataInput
  ): Promise<ds.Validation[]> => {
    const response = await ds.validateData(
      formatContractForExport(contract),
      data
    );
    if (!response.success) throw new Error(response.error);
    if (!response.result) throw new Error("No result from validate data.");
    return response.result;
  };

  return { getRepresentation, validateCsv, validateData, initialized };
};
