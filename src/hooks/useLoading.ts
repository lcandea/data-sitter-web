import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useStore";
import { hideLoading, showLoading } from "@/store/slices/loading";

export function useLoading(loading: boolean) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (loading) {
      dispatch(showLoading());
    } else {
      dispatch(hideLoading());
    }
    return () => {
      dispatch(hideLoading());
    };
  }, [dispatch, loading]);
}
