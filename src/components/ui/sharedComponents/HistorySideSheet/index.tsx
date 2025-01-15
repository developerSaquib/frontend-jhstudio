/* eslint-disable @typescript-eslint/no-explicit-any */
// React hook forms
import { useForm } from "react-hook-form";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect } from "react";
import { useFetchDataContext } from "@/components/context/fetchTableDataContext";

// Form Fields schema
type FieldSchema = {
  readOnly?: boolean | undefined;
  label: string;
  name: string;
  type: string;
  required: boolean;
  error: string;
  validations: { min?: number; max?: number; message?: string }[];
  defaultValue?: boolean;
};

// JSON file schema
type SampleSchema = {
  menuId: number;
  buttonName?: string;
  sheetTitle?: string;
  sheetDescription?: string;
  fields: FieldSchema[];
};

interface SideSheetProps {
  formGenSchema: SampleSchema;
  maxWidth?: number;
  customerHistoryData: any;
}

export function HistorySideSheet({
  formGenSchema,
  maxWidth,
  customerHistoryData,
}: SideSheetProps): JSX.Element {
  const { sheetOpen, setSheetOpen, resetFormData } = useFetchDataContext();

  const { reset } = useForm();

  // Reset form entries after submission of data successfully
  useEffect(() => {
    reset();
  }, [reset, resetFormData]);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild></SheetTrigger>
      <SheetContent style={{ maxWidth: maxWidth ? `${maxWidth}vw` : "60vw" }}>
        <SheetHeader>
          <SheetTitle style={{ fontFamily: "'Playfair Display', serif" }}>
            {formGenSchema?.sheetTitle}
          </SheetTitle>
          <SheetDescription>{formGenSchema?.sheetDescription}</SheetDescription>
        </SheetHeader>
        <>
          {customerHistoryData.length > 0 ? (
            <div className="p-6 bg-gray-100 min-h-screen">
              <h1 className="text-2xl font-serif font-normal text-center mb-6 ">
                Customer Service History
              </h1>
              <h1 className="text-lg font-mono font-normal text-center mb-6 ">
                {customerHistoryData[0]?.customer?.name}
              </h1>
              <div className="h-[calc(100vh-4rem)] overflow-y-auto space-y-8">
                {customerHistoryData?.map((sessionData: any) => (
                  <div key={sessionData.id} className="relative">
                    <div
                      className="absolute w-1 top-0 bottom-0 left-8 transform -translate-x-1/2"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    ></div>
                    <div className="relative pl-16 space-y-4">
                      <div
                        className="text-lg font-semibold text-blue-600"
                        style={{ color: "var(--color-primary)" }}
                      >
                        {new Date(sessionData?.txnDate).toDateString()}
                      </div>
                      {sessionData.description ? (
                        <div className="p-4 bg-white rounded-lg shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between">
                          <p>
                            <span className="text-sm text-bold font-serif text-gray-600 text-slate-950 uppercase">
                              Description:
                            </span>{" "}
                            {sessionData.description}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}

                      {sessionData?.saleLines?.map(
                        (saleLineData: any, index: any) => (
                          <div
                            key={index}
                            className="p-4 bg-white rounded-lg shadow-md flex flex-col lg:flex-row lg:items-center lg:justify-between"
                          >
                            <div className="mb-4 lg:mb-0">
                              <h3 className="text-lg font-bold">
                                {saleLineData.service.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Artist: {sessionData?.user.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                Paid Amount:{" "}
                                <span className="font-semibold">
                                  Rs.
                                  {saleLineData.rate * saleLineData.quantity -
                                    saleLineData.discountAmount}{" "}
                                  /-
                                </span>
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gray-100 min-h-screen">
              <h4 className="text-center m-6 h-screen">
                No history found for this customer
              </h4>{" "}
            </div>
          )}
        </>
      </SheetContent>
    </Sheet>
  );
}
