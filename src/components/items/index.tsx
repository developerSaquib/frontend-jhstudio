/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "../ui/sharedComponents/DataTable";
import { SideSheet } from "../ui/sharedComponents/SideSheet";
// import hook
import tableHook from "./hooks/useTable";
import useAddEditHook from "./hooks/useAddEdit";
import ReactLoader from "../../components/ui/sharedComponents/ReactLoader";
import AlertBox from "../ui/sharedComponents/AlertBox";
// Import toaster for success or error msg popup
import { Toaster } from "react-hot-toast";
// Importing context
import { FetchDataProvider } from "../context/fetchTableDataContext";

export default function Services(): JSX.Element {
  return (
    <FetchDataProvider>
      <Table />
    </FetchDataProvider>
  );
}

function Table(): JSX.Element {
  // Table hook
  const {
    columns,
    data,
    schema,
    loading,
    showAlert,
    setShowAlert,
    handleAgreeDelete,
    dataEditModeData,
    handleEditSubmit,
    editButtonLoader,
  } = tableHook();
  // Add hook
  const { handleAddSubmit, buttonLoader } = useAddEditHook();
  const searchByProp = "name";
  return (
    <>
      <div className="container mx-auto py-10 flex flex-col">
        <Toaster position="top-center" reverseOrder={false} />
        <div className="grid gap-4 grid-cols-2 px-2">
          <ReactLoader loading={loading} />
          <div>
            <p
              className="mb-5 text-lg font-normal uppercase"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Available Items
            </p>
          </div>
          {/* Div for side short form */}
          <div className="mb-5 flex justify-end">
            <SideSheet
              formGenSchema={schema}
              onSubmit={handleAddSubmit}
              buttonLoader={buttonLoader}
              editButtonLoader={editButtonLoader}
              editModeData={dataEditModeData as any}
              onEditSubmit={handleEditSubmit as any}
            />
          </div>
        </div>
        <hr />
        {/* Div for data table */}
        <div className="row mt-2 pr-4">
          <DataTable
            columns={columns}
            data={data as any}
            searchByProp={searchByProp}
          />
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
      </div>
    </>
  );
}
