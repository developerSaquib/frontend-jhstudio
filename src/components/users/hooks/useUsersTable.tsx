/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
// MoreHorizontal,
import { Button } from "@/components/ui/button";
//importing form schema in json format
import dynamicFormSchema from "../formSchema.json";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import getData from "@/api/getData.api";
import { useEffect, useState } from "react";
import deleteDataAPI from "@/api/deleteData.api";
import toast from "react-hot-toast";
import { useFetchDataContext } from "../../context/fetchTableDataContext";
// import getDataById from "@/api/getDataById.api";
import updateData from "@/api/updateData.api";
import PayloadModify from "@/components/ui/sharedComponents/Utility/PayloadModify";

// Type defination for columns header
export type ColumnHeaderType = {
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  name: string;
  taxAmount: number;
  amount: number;
  isInactive: number;
  sortBy?: string;
};

//interface for Column Data
interface ServicesData {
  id: string;
  name: string;
  taxAmount: number;
  amount: number;
  isInactive: number;
  createdDate: string;
  modifiedDate: string;
}

const useUsersTable = () => {
  const [tableData, setTableData] = useState<ServicesData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  console.log(setSelectedDeleteId);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {
    isRefresh,
    setIsRefresh,
    selectedRecordId,
    // setSelectedRecordId,
    sheetOpen,
    setSheetOpen,
    resetFormData,
    setResetFormData,
  } = useFetchDataContext();
  const [dataEditModeData, setEditModaData] = useState([]);
  const [editButtonLoader, setEditButtonLoader] = useState<boolean>(false);
  console.log(setEditModaData);
  //Column defination
  const columns: ColumnDef<ColumnHeaderType>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "mobile",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Mobile
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "userType",
      accessorFn: (row: any) => {
        return row?.userType?.name;
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "isInactive",
      accessorFn: (row) => (row.isInactive ? "YES" : "NO"),
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Is InActive
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  //API for table data
  const fetchTableData = async () => {
    try {
      setLoading(true);
      const filter: any = {
        fields: {
          name: true,
          mobile: true,
          email: true,
          code: true,
          id: true,
          isInactive: true,
        },
        relations: [
          {
            name: "userType",
            fields: {
              name: true,
              id: true,
            },
          },
        ],
      };
      let response: any = await getData(dynamicFormSchema.postUrl, filter);
      response = response?.data?.map((item: any) => {
        const originalDate = new Date(item.birthDate);
        const day = String(originalDate.getUTCDate()).padStart(2, "0");
        const month = String(originalDate.getUTCMonth() + 1).padStart(2, "0");
        const year = originalDate.getUTCFullYear();

        //Birthdate in DD/MM/YYYY format
        item.birthdateUpdated = `${day}/${month}/${year}`;
        //Status in Active/Not Active
        item.isInactiveUpdated =
          item.isInactive === 1 ? "Active" : "Not Active";
        return item;
      });
      setTableData(response);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [isRefresh]);

  // const handleDeleteClick = (id: number) => {
  //   setShowAlert(true);
  //   setSelectedDeleteId(id);
  // };

  // Function to delete the record
  const handleAgreeDelete = async () => {
    if (selectedDeleteId) {
      try {
        await deleteDataAPI(dynamicFormSchema.postUrl, selectedDeleteId);
        toast.success("Record deleted successfully");
        setTimeout(() => {
          fetchTableData(); // Calling function after successfully deleting record for updated table data
        }, 1000);
      } catch (err: any) {
        if (err) {
          toast.error("Failed to delete record!");
        }
      }
    }
  };

  // const handleEditClick = (recordId: number) => {
  //   if (recordId) {
  //     setSelectedRecordId(recordId);
  //     let response: any;
  //     const fetchEdiData = async () => {
  //       response = await getDataById(dynamicFormSchema.postUrl, recordId);
  //       setEditModaData(response.data);
  //     };
  //     fetchEdiData();
  //     setSheetOpen(!sheetOpen);
  //   }
  // };

  //Handle Update function to update form records
  const handleEditSubmit = async (data: any) => {
    // Following utility will modify payload for isInactive and dropdown ids and add created and modifiedDate
    const payload = PayloadModify(dynamicFormSchema, data);
    try {
      setEditButtonLoader(true);
      const response = await updateData(
        dynamicFormSchema.postUrl,
        payload,
        selectedRecordId
      );
      if (response) {
        setSheetOpen(!sheetOpen);
        setEditButtonLoader(false);
        setIsRefresh(!isRefresh);
        setResetFormData(!resetFormData);
        toast.success("Record updated successfully..!");
      }
    } catch (err: any) {
      setEditButtonLoader(false);
      toast.error("Error while updating record..!");
      console.log(err);
    }
  };

  return {
    columns,
    data: tableData,
    dynamicFormSchema,
    loading,
    showAlert,
    setShowAlert,
    handleAgreeDelete,
    dataEditModeData,
    handleEditSubmit,
    editButtonLoader,
  };
};

export default useUsersTable;
