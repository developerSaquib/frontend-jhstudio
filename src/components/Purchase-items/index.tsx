/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "../ui/sharedComponents/DataTable";
// import hook

import ReactLoader from "../../components/ui/sharedComponents/ReactLoader";
import AlertBox from "../ui/sharedComponents/AlertBox";
// Import toaster for success or error msg popup
import { Toaster } from "react-hot-toast";
import usePurchaseItemsTable from "@/components/Purchase-items/hooks/usePurchaseItemsTable";
import useMakePurchase from "@/components/Purchase-items/hooks/useMakePurchase";
import { SideSheetTransaction } from "../ui/sharedComponents/SlideSheetTransaction";
import tabSchema from "./schema/tabSchema.json";

import { FetchDataProvider } from "../context/fetchTableDataContext";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
export default function ServiceSessions(): JSX.Element {
  return (
    <FetchDataProvider>
      <PurchaseItemTable />
    </FetchDataProvider>
  );
}
function PurchaseItemTable() {
  const {
    columns,
    data,
    formSchema,
    loading,
    showAlert,
    setShowAlert,
    handleAgreeDelete,
    dataEditModeData,
  } = usePurchaseItemsTable();
  const {
    handleSubmit,
    buttonLoader,
    handlFormFieldStateUpdate,
    searchBoxSchema,
    searchBoxData,
    selectNewItem,
    selectedData,
    removeSelectedItems,
    errTable,
    setErrTable,
    errTableData,
  } = useMakePurchase();

  return (
    <>
      {/* <Autocomplete api="/customers"/> */}
      <div className="container mx-auto py-10 flex flex-col">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="grid gap-4 grid-cols-2 px-2">
          <ReactLoader loading={loading} />
          <div>
            <p
              className="mb-5 text-lg font-normal uppercase"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Purchase Items
            </p>
          </div>
          {/* Div for side short form */}
          <div className="mb-5 flex justify-end">
            <SideSheetTransaction
              formGenSchema={formSchema}
              onSubmit={handleSubmit}
              buttonLoader={buttonLoader}
              maxWidth={70}
              tabSchema={tabSchema}
              handlFormFieldStateUpdate={handlFormFieldStateUpdate}
              searchBoxSchema={searchBoxSchema}
              searchBoxData={searchBoxData}
              selectNewItem={selectNewItem}
              selectedData={selectedData}
              removeSelectedItems={removeSelectedItems}
              editModeData={dataEditModeData as any}
              isPurchaseItem={true}
            />
          </div>
        </div>
        <hr />
        {/* Div for data table */}
        <div className="row mt-2 pr-4">
          <DataTable columns={columns} data={data as any} />
        </div>

        {/* Alert popup for delet action */}
        {showAlert && (
          <AlertBox
            title="Delete Alert!!"
            description="Are you sure to delete this record?"
            onAgreeFn={handleAgreeDelete}
            open={showAlert}
            setOpen={setShowAlert}
          />
        )}
        <Dialog
          open={errTable}
          onOpenChange={() => {
            setErrTable(!errTable);
          }}
        >
          <DialogContent className="sm:max-w-[580px]">
            <Table>
              <TableCaption>
                <span className="text-red-500">Unable to process sale</span>
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errTableData.map((val: any) => {
                  return (
                    <TableRow>
                      <TableCell className="font-medium">{val}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
