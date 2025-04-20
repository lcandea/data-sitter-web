import { useCallback, useEffect, useMemo, useState } from "react";
import isEqual from "lodash/isEqual";
import { Contract, ContractField, ContractValue } from "@/lib/types";
import { useAppDispatch, useAppSelector } from "./useStore";

import * as csActions from "../store/slices/contract";
import * as vActions from "../store/slices/values";

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

  const clearContract = useCallback(() => {
    dispatch(csActions.resetContractState());
    dispatch(vActions.setValues([]));
    setName("");
    setFields([]);
    setValues([]);
  }, [dispatch]);

  const setContract = useCallback((newContract: Contract) => {
    setName(newContract.name);
    setFields(newContract.fields);
  }, []);

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
    const resultAction = await dispatch(
      csActions.importContract({ content, fileType })
    );
    if (csActions.importContract.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
    return null;
  };

  const saveContractToStore = async () => {
    if (!hasChanged) return;
    if (!name || name === "") throw new Error("Name cannot be empty.");
    if (name != storedName) dispatch(csActions.setName(name));
    if (!isEqual(fields, storedFields)) dispatch(csActions.setFields(fields));
  };

  const saveContractLocally = async () => {
    await saveContractToStore();
    const resultAction = await dispatch(csActions.saveContractLocally());
    if (csActions.saveContractLocally.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
  };

  const saveContractToCloud = async () => {
    await saveContractToStore();
    const resultAction = await dispatch(csActions.saveContractToCloud());
    if (csActions.saveContractToCloud.fulfilled.match(resultAction)) {
      return resultAction.payload;
    }
  };

  const updateContract = async (contractId: string) => {
    if (!hasChanged) return;
    await saveContractToStore();
    await dispatch(csActions.updateContract(contractId));
  };

  const syncLocalContractToCloud = async (contractId: string) => {
    await updateContract(contractId);
    const resultAction = await dispatch(
      csActions.syncLocalContractToCloud(contractId)
    );
    if (csActions.syncLocalContractToCloud.fulfilled.match(resultAction)) {
      return resultAction.payload.newId;
    }
  };

  return {
    contract,
    storedContract,
    hasChanged,
    error,
    loading,
    setContract,
    clearContract,
    fetchContract,
    fetchPublicContract,
    importContract,
    saveContractToStore,
    saveContractLocally,
    saveContractToCloud,
    syncLocalContractToCloud,
    updateContract,
  };
};
