/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataTable } from "../ui/sharedComponents/DataTable";
// import { SideSheet } from "../ui/sharedComponents/SideSheet";
// import hook
import useUsersTable from "./hooks/useUsersTable";
// import useAddEditUsers from "./hooks/useAdd-EditUsers";
import ReactLoader from "../../components/ui/sharedComponents/ReactLoader";
// import AlertBox from "../ui/sharedComponents/AlertBox";
// Import toaster for success or error msg popup
import { Toaster } from "react-hot-toast";
// Importing context
import { FetchDataProvider } from "../context/fetchTableDataContext";

export default function Services(): JSX.Element {
  return (
    <FetchDataProvider>
      <UsersTable />
    </FetchDataProvider>
  );
}

function UsersTable(): JSX.Element {
  // Table hook
  const { columns, data, loading } = useUsersTable();
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
              Our Users
            </p>
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
      </div>
    </>
  );
}
