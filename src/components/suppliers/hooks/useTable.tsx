/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
//importing form schema in json format
import { schema } from "../formSchema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import getData from "@/api/getData.api";
import { useEffect, useState } from "react";
import deleteDataAPI from "@/api/deleteData.api";
import toast from "react-hot-toast";
import { useFetchDataContext } from "../../context/fetchTableDataContext";
import getDataById from "@/api/getDataById.api";
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

const useTable = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {
    isRefresh,
    setIsRefresh,
    selectedRecordId,
    setSelectedRecordId,
    sheetOpen,
    setSheetOpen,
    resetFormData,
    setResetFormData,
  } = useFetchDataContext();
  const [dataEditModeData, setEditModaData] = useState([]);
  const [editButtonLoader, setEditButtonLoader] = useState<boolean>(false);

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
          Supplier Name
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
          Mobile Number
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
          Email ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "isInactive",
      accessorFn: (row: any) => (row.isInactive ? "YES" : "NO"),
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
    {
      id: "actions",
      cell: ({ row }) => {
        const records = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  onClick={() => handleEditClick(Number(records.id))}
                  style={{
                    background: "none",
                    color: "red",
                    border: "none",
                    width: "100%",
                  }}
                >
                  Edit Record
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  onClick={() => handleDeleteClick(Number(records.id))}
                  style={{
                    background: "none",
                    color: "red",
                    border: "none",
                    width: "100%",
                  }}
                >
                  Delete Record
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  //API for table data
  const fetchTableData = async () => {
    try {
      setLoading(true);
      const filter = {
        fields: {
          id: true,
          name: true,
          code: true,
          email: true,
          isInactive: true,
          mobile: true,
        },
        where: {
          contactType: {
            id:2
          },
        },
        relations: [
          {
            name: "contactType",
          },
        ],
      };
      let response: any = await getData(schema.postUrl, filter);
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

  const handleDeleteClick = (id: number) => {
    setShowAlert(true);
    setSelectedDeleteId(id);
  };

  // Function to delete the record
  const handleAgreeDelete = async () => {
    if (selectedDeleteId) {
      try {
        await deleteDataAPI(schema.postUrl, selectedDeleteId);
        toast.success("Record deleted successfully");
        setTimeout(() => {
          fetchTableData(); // Calling function after successfully deleting record for updated table data
        }, 1000);
      } catch (err: any) {
        if (err) {
          if (err?.response?.data?.message?.startsWith("update")) {
            toast.error("This record is linked and cannot be deleted.");
          } else {
            toast.error("Failed to delete record!");
          }
        }
      }
    }
  };

  const handleEditClick = (recordId: number) => {
    if (recordId) {
      setSelectedRecordId(recordId);
      let response: any;
      const fetchEdiData = async () => {
        const apiFilter = {
          relations: [
            {
              name: "city",
              fields: {
                name: true,
                id: true,
              },
            },
            {
              name: "state",
              fields: {
                name: true,
                id: true,
              },
            },
            {
              name: "country",
              fields: {
                name: true,
                id: true,
              },
            },
            {
              name: "contactType",
              fields: {
                name: true,
                id: true,
              },
            },
          ],
        };
        response = await getDataById(schema.postUrl, recordId, apiFilter);
        setEditModaData(response.data);
      };
      fetchEdiData();
      setSheetOpen(!sheetOpen);
    }
  };

  const handleEditSubmit = async (data: any) => {
    // Following utility will modify payload for isInactive and dropdown ids and add created and modifiedDate
    const payload = PayloadModify(schema, data);
    try {
      setEditButtonLoader(true);
      const response = await updateData(
        schema.postUrl,
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
    schema,
    loading,
    showAlert,
    setShowAlert,
    handleAgreeDelete,
    dataEditModeData,
    handleEditSubmit,
    editButtonLoader,
  };
};

export default useTable;
