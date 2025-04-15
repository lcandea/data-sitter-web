import { useCallback, useEffect, useMemo, useState } from "react";
import { isEqual } from "lodash";
import { Contract, ContractField, ContractValue, DataInput } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "./useStore";

import * as csActions from "../store/slices/contract";
import { DataSitterValidator } from "data-sitter";
import { formatContractForExport } from "@/lib/contract-utils";

export const useContract = () => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [fields, setFields] = useState<ContractField[]>([]);
  const [values, setValues] = useState<ContractValue[]>([]);

  const { values: storedValues } = useAppSelector((state) => state.values);
  const {
    id,
    error,
    loading,
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

  const fetchContract = useCallback(
    (id: string) => {
      if (id) {
        dispatch(csActions.fetchContract(id));
      }
    },
    [dispatch]
  );

  const fetchPublicContract = useCallback(
    (token: string) => {
      if (token) {
        dispatch(csActions.fetchPublicContract(token));
      }
    },
    [dispatch]
  );

  const importContract = async (content: string, fileType: "YAML" | "JSON") => {
    dispatch(csActions.importContract({ content, fileType }));
  };

  const saveLocalChanges = async () => {
    if (!hasChanged) return;
    if (!name || name === "") throw new Error("Name cannot be empty.");
    if (name != storedName) dispatch(csActions.setName(name));
    if (!isEqual(fields, storedFields)) dispatch(csActions.setFields(fields));
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
    error,
    loading,
    setContract,
    fetchContract,
    fetchPublicContract,
    importContract,
    saveLocalChanges,
    persistContract,
    validateData,
    validateCsv,
  };
};
