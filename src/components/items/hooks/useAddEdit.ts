/* eslint-disable @typescript-eslint/no-explicit-any */
import postData from "@/api/postData.api";
import { schema } from "../formSchema.ts";
import { useState } from "react";
import PayloadModify from "@/components/ui/sharedComponents/Utility/PayloadModify";
import toast from "react-hot-toast";
import { useFetchDataContext } from "../../context/fetchTableDataContext";

const useAddEditHook = () => {
  //Importing global state from context
  const {
    isRefresh,
    setIsRefresh,
    sheetOpen,
    setSheetOpen,
    resetFormData,
    setResetFormData,
  } = useFetchDataContext();
  // state for button loader
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);

  // On submit handler to saving new record
  const handleAddSubmit = async (data?: any) => {
    // Following utility will modify payload for isInactive and dropdown ids and add created and modified Date
    const payload = PayloadModify(schema, data);
    try {
      setButtonLoader(true);
      const response = await postData(schema.postUrl, {
        ...payload,
        isService: 0,
      });
      if (response) {
        setButtonLoader(false);
        setIsRefresh(!isRefresh);
        setSheetOpen(!sheetOpen);
        setResetFormData(!resetFormData);
        toast.success("Record added successfully..!");
      }
    } catch (err: any) {
      if (err) {
        setButtonLoader(false);
        if (err.response.status === 409) {
          toast.error(err?.response?.data?.message);
        } else {
          toast.error("Error while saving record, Please try again!");
        }
      }
    }
  };

  return { handleAddSubmit, buttonLoader };
};
export default useAddEditHook;
