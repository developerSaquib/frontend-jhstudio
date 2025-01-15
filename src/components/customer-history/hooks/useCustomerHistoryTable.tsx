/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
//importing form schema in json format
import dynamicFormSchema from "../formSchema.json";
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
// import toast from "react-hot-toast";
import { useFetchDataContext } from "../../context/fetchTableDataContext";

// Type defination for columns header
export type ColumnHeaderType = {
  id: string;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
  name?: string;
  mobile?: string;
  sortBy?: string;
};

//interface for Column Data
interface CustomerData {
  id: string;
  name: string;
  mobile: number;
  birthDate: string;
  email: string;
  isInactive: number;
  createdDate: string;
  modifiedDate: string;
}

const useCustomerHistoryTable = () => {
  const [tableData, setTableData] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const {
    isRefresh,
    // setIsRefresh,
    // selectedRecordId,
    setSelectedRecordId,
    sheetOpen,
    setSheetOpen,
  } = useFetchDataContext();
  const [customerHistoryData, setCustomerHistoryData] = useState([]);

  //Column defination
  const columns: ColumnDef<ColumnHeaderType>[] = [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Customer Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "birthdateUpdated",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Date Of Birth
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "mobile",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Email ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "lastVisitedDate",
      accessorFn: function (row: any) {
        const currentDate: any = new Date(); // Get the current date
        const givenDate: any = new Date(row.lastVisitedDate); // Convert the input date

        // Calculate the difference in milliseconds
        const differenceMs = Math.abs(currentDate - givenDate);

        // Convert milliseconds to days
        return `${Math.floor(differenceMs / (1000 * 60 * 60 * 24))} days ago`;
      },
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Last Visited
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "isInactiveUpdated",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
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
              <DropdownMenuLabel>Action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  onClick={() => handleViewHistoryClick(Number(records.id))}
                  style={{
                    background: "none",
                    color: "green",
                    border: "none",
                    width: "100%",
                  }}
                >
                  View History
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
        relations: [
          {
            name: "contactType",
            where: {
              id: 1,
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
          item.isInactive ? "Yes" : "No";
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

  //Fetching customer history data
  const handleViewHistoryClick = (recordId: number) => {
    if (recordId) {
      setSelectedRecordId(recordId);
      let response: any;
      const fetchData = async () => {
        try {
          const apiFilter = {
            limit: 15,
            relations: [
              {
                name: "customer",
                where: {
                  id: recordId,
                },
              },
              {
                name: "saleLines",
                relations: [
                  {
                    name: "service",
                  },
                ],
              },
              {
                name: "user",
              },
            ],
          };
          response = await getData("/sale-headers", apiFilter);
          setCustomerHistoryData(response.data);
        } catch (err: any) {
          console.log("Error: ", err);
        }
      };
      fetchData();
      setSheetOpen(!sheetOpen);
    }
  };

  return {
    columns,
    data: tableData,
    dynamicFormSchema,
    loading,
    showAlert,
    setShowAlert,
    customerHistoryData,
  };
};

export default useCustomerHistoryTable;
