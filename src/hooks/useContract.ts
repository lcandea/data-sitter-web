import { useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { Contract, ContractField, ContractValue, DataInput } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "./useStore";

import * as csActions from "../store/slices/contract";
import * as vsActions from "../store/slices/values";
import { DataSitterValidator } from "data-sitter";
import {
  contractFromImportData,
  formatContractForExport,
} from "@/lib/contract-utils";

export const useContract = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [fields, setFields] = useState<ContractField[]>([]);
  const [values, setValues] = useState<ContractValue[]>([]);

  const { values: storedValues } = useAppSelector((state) => state.values);
  const {
    id,
    name: storedName,
    fields: storedFields,
  } = useAppSelector((state) => state.contract);

  useEffect(() => {
    if (storedName) {
      setName(storedName);
    }
    if (storedFields) setFields(storedFields);
  }, [storedName, storedFields]);

  useEffect(() => {
    if (storedValues) {
      setValues(storedValues);
    }
  }, [storedValues]);

  const contract: Contract = useMemo(
    () => ({ id, name, fields, values }),
    [id, name, values, fields]
  );

  const storedContract: Contract = useMemo(
    () => ({
      id,
      name: storedName || "",
      fields: storedFields,
      values: storedValues,
    }),
    [id, storedName, storedFields, storedValues]
  );

  const hasChanged: boolean = useMemo(() => {
    return !isEqual(
      { name: storedName || "", fields: storedFields, values: storedValues },
      { name, values, fields }
    );
  }, [storedName, storedFields, storedValues, name, values, fields]);

  const setContract = (newContract: Contract) => {
    setName(newContract.name);
    setFields(newContract.fields);
  };

  const importContract = async (content: string, fileType: "YAML" | "JSON") => {
    let validator;
    if (fileType === "JSON") {
      validator = await DataSitterValidator.fromJson(content);
    } else {
      validator = await DataSitterValidator.fromYaml(content);
    }
    const importedContract = await validator.getRepresentation();
    const contract = contractFromImportData(importedContract);

    setName(contract.name);
    setFields(contract.fields);
    dispatch(vsActions.setValues(contract.values));
  };

  const persistContract = async () => {
    if (!hasChanged) return;
    if (!name || name === "") throw new Error("Name cannot be empty.");
    if (name != storedName) dispatch(csActions.setName(name));
    if (!isEqual(fields, storedFields)) dispatch(csActions.setFields(fields));
    if (id) {
      await dispatch(csActions.updateConctract(id));
      return id;
    } else {
      await dispatch(csActions.createConctract());
      const resultAction = await dispatch(csActions.createConctract());
      if (csActions.createConctract.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
    }
  };

  const validateData = async (data: DataInput) => {
    if (!contract) throw new Error("Contract not loaded.");
    const validator = new DataSitterValidator(
      formatContractForExport(contract)
    );
    return await validator.validateData(data);
  };

  const validateCsv = async (csvContent: string) => {
    if (!contract) throw new Error("Contract not loaded.");
    const validator = new DataSitterValidator(
      formatContractForExport(contract)
    );
    return await validator.validateCsv(csvContent);
  };

  return {
    contract,
    storedContract,
    hasChanged,
    setContract,
    importContract,
    persistContract,
    validateData,
    validateCsv,
  };
};
