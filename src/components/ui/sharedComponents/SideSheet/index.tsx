/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaPlus } from "react-icons/fa6";
import { format } from "date-fns";
// React hook forms
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "../../switch";
import { useEffect, useState } from "react";
import getData from "@/api/getData.api";
import { useFetchDataContext } from "@/components/context/fetchTableDataContext";

// Form Fields schema
type FieldSchema = {
  readOnly?: boolean | undefined;
  label: string;
  name: string;
  type: string;
  required?: boolean;
  error: string;
  validations: { min?: number; max?: number; message?: string }[];
  defaultValue?: boolean | number;
  isDependent?: boolean;
  reflectedFrom?: string;
  reflectTo?: string;
  isHidden?: boolean;
  cb?: Function;
  setExtraValues?: boolean;
  extraValuesToSet?: string[];
  takeValue?: string;
};

// JSON file schema
type SampleSchema = {
  menuId: number;
  buttonName?: string;
  sheetTitle?: string;
  sheetDescription?: string;
  fields: FieldSchema[];
  isDependent?: boolean;
};
//Interface for edit mode data
interface EditData {
  id: string;
  name: string;
  mobile: number;
  birthDate: string;
  email: string;
  isInactive: number;
}
interface SideSheetProps {
  formGenSchema: SampleSchema;
  onSubmit: () => void;
  onEditSubmit: () => void;
  buttonLoader: boolean;
  maxWidth?: number;
  editButtonLoader: boolean;
  editModeData: EditData;
}

export function SideSheet({
  formGenSchema,
  onSubmit,
  onEditSubmit,
  buttonLoader,
  maxWidth,
  editButtonLoader,
  editModeData,
}: SideSheetProps): JSX.Element {
  const {
    selectedRecordId,
    sheetOpen,
    setSheetOpen,
    resetFormData,
    setSelectedRecordId,
    setResetFormData,
  } = useFetchDataContext();

  // Zod validation schema based on field validations
  const validationSchema = z.object(
    formGenSchema.fields
      .filter((field) => !field.isHidden)
      .reduce((acc, field) => {
        if (!field.isHidden) {
        }
        let validator: any;

        if (field.type === "checkbox") {
          validator = z.boolean();
          if (field.required) {
            validator = validator.refine((val: any) => val === true, {
              message: field.error || "This field is required",
            });
          }
        } else {
          validator = z.string();
          if (field?.required) {
            validator = validator?.min(1, field.error);
          }
          field.validations.forEach((rule) => {
            if (rule.min !== undefined) {
              validator = validator?.min(rule.min, rule.message);
            }
            if (rule.max !== undefined) {
              validator = validator?.max(rule.max, rule.message);
            }
          });
        }

        acc[field.name] = validator;
        return acc;
      }, {} as Record<string, z.ZodType<any>>)
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  // Reset form entries after submission of data successfully
  useEffect(() => {
    reset();
  }, [reset, resetFormData]);

  //Setting up value in edit to each field
  useEffect(() => {
    const nameTypeMapping: any = {};
    formGenSchema?.fields
      ?.filter((field) => !field.isHidden)
      .forEach((element: any) => {
        nameTypeMapping[element?.name] = element.type;
      });
    if (selectedRecordId) {
      Object.entries(editModeData).forEach(([key, value]) => {
        if (nameTypeMapping[key] === "select") {
          setValue(key, `${value?.id}`);
        } else if (nameTypeMapping[key] === "checkbox") {
          setValue(key, Boolean(value));
        } else {
          setValue(key, `${value}`);
        }
      });
    } else {
      formGenSchema?.fields?.map((field) => {
        if (field.defaultValue) {
          setValue(field.name, `${field.defaultValue}`);
        }
      });
      Object.entries(nameTypeMapping).forEach(([key]) => {
        if (nameTypeMapping[key] === "date") {
          setValue(key, format(new Date(), "yyyy-MM-dd"));
        }
      });
    }
  }, [selectedRecordId, editModeData, setValue, formGenSchema?.fields]);

  // Options for dropdown field
  const [dropdownOptions, setDropdownOptions] = useState<Record<string, any[]>>(
    {}
  );

  useEffect(() => {
    // Function to fetch dropdown options from the API
    const fetchOptions = async (fieldName: string, apiUrl: string) => {
      const apiFilter = {
        fields: {
          id: true,
          name: true,
          stateId: true,
          percentage: true,
        },
      };
      try {
        const response = await getData(apiUrl, apiFilter);
        setDropdownOptions((prev: any) => ({
          ...prev,
          [fieldName]: response.data,
        }));
      } catch (error) {}
    };

    // Loop through form fields to load options as needed
    formGenSchema.fields
      .filter((field) => !field.isHidden)
      .forEach((field: any) => {
        if (field.type === "select" && !field.options) {
          // Pass the field's name and API endpoint to fetchOptions
          fetchOptions(field.name, field.optionsAPI);
        }
      });
  }, [formGenSchema.fields]);

  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={() => {
        setSheetOpen(!sheetOpen);
        if (selectedRecordId) {
          setSelectedRecordId(null);
          setResetFormData(!resetFormData);
        }
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          style={{
            fontFamily: "'Playfair Display', serif",
            backgroundColor: "var(--color-primary)",
            color: "white",
          }}
        >
          <FaPlus /> Add New {formGenSchema?.buttonName}
        </Button>
      </SheetTrigger>
      <SheetContent
        style={{ maxWidth: maxWidth ? `${maxWidth}vw` : "40vw" }}
        className="max-h-screen overflow-y-scroll"
      >
        <SheetHeader>
          <SheetTitle style={{ fontFamily: "'Playfair Display', serif" }}>
            {formGenSchema?.sheetTitle}
          </SheetTitle>
          <SheetDescription>{formGenSchema?.sheetDescription}</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4">
          <form
            onSubmit={
              selectedRecordId
                ? handleSubmit(onEditSubmit)
                : handleSubmit(onSubmit)
            }
            className="col-span-2 grid grid-cols-2 gap-4 mt-5"
            autoComplete="off"
          >
            {formGenSchema.fields
              .filter((field) => !field.isHidden)
              .map((field) => (
                <div
                  className="grid grid-rows-1 gap-2"
                  key={field?.name}
                  style={{ marginBottom: "1rem" }}
                >
                  {field.type !== "checkbox" ? (
                    <Label
                      htmlFor={field?.name}
                      className="text-left font-serif"
                    >
                      {field.label}
                      {field.required ? (
                        <span style={{ color: "red" }}>*</span>
                      ) : null}
                    </Label>
                  ) : null}

                  <Controller
                    name={field.name}
                    control={control}
                    defaultValue={
                      field.type === "checkbox"
                        ? field.defaultValue || false
                        : ""
                    }
                    render={({ field: controllerField }) => {
                      if (field.type === "select") {
                        // // if (field.readOnly && field.defaultValue) {
                        // controllerField.value = field.defaultValue;
                        // // }

                        return (
                          <select
                            {...controllerField}
                            className="p-2 border border-gray-300 rounded w-full font-serif h-9.5 text-sm"
                            disabled={field.readOnly}
                            {...(field.readOnly && {
                              value: `${field.defaultValue}`,
                            })}
                            onChange={(e) => {
                              controllerField.onChange(e);
                              if (
                                field.setExtraValues &&
                                field?.extraValuesToSet &&
                                field?.takeValue
                              ) {
                                field?.extraValuesToSet.map((valName) => {
                                  setValue(
                                    valName,
                                    dropdownOptions[field.name].find(
                                      (val) => val.id == e.target.value
                                    )[`${field?.takeValue}`]
                                  );
                                });
                              }
                              // if (e.target.name === "tax") {
                              //   const selectedOption =
                              //     e.target.selectedOptions[0];
                              //   const taxPerc =
                              //     selectedOption.getAttribute("data-tax-perc");
                              //   setTaxValue(Number(taxPerc));
                              // } else {
                              //   setTaxValue(null);
                              // }
                            }}
                          >
                            <option value="">-- Select an option --</option>
                            {(dropdownOptions[field.name] || []).map(
                              (option) => (
                                <option
                                  key={option.id}
                                  value={option.id}
                                  data-tax-perc={option?.percentage}
                                >
                                  {option.name}
                                </option>
                              )
                            )}
                          </select>
                        );
                      } else if (field.type === "checkbox") {
                        return (
                          <div className="flex items-center space-x-2">
                            <Label
                              htmlFor={field.name}
                              className="text-left font-serif"
                            >
                              {field.label}
                              {field.required ? (
                                <span style={{ color: "red" }}>*</span>
                              ) : null}
                            </Label>
                            <Switch
                              checked={!!controllerField?.value}
                              onCheckedChange={(checked) =>
                                controllerField.onChange(checked)
                              }
                            />
                          </div>
                        );
                      } else if (field.type === "date") {
                        return <Input type="date" {...controllerField} />;
                      } else {
                        return (
                          <Input
                            className="col-span-3"
                            {...controllerField}
                            type={field.type}
                            readOnly={field.readOnly}
                            onChange={(e) => {
                              controllerField.onChange(e);
                              if (
                                field.isDependent &&
                                field.reflectTo &&
                                field?.cb &&
                                field.reflectedFrom
                              ) {
                                const outPut = field?.cb(
                                  e.target.value,
                                  getValues(field.reflectedFrom)
                                );
                                setValue(field.reflectTo, String(outPut));
                              }
                              // if (
                              //   e.target.name === "amount" &&
                              //   taxValue &&
                              //   taxValue >= 0
                              // ) {
                              //   const amount = Number(e.target.value);
                              //   const calculatedTaxAmount =
                              //     (amount * taxValue) / 100;
                              //   setValue(
                              //     "taxAmount",
                              //     calculatedTaxAmount.toFixed(2).toString()
                              //   );
                              // } else {
                              //   setValue("taxAmount", 0);
                              // }
                            }}
                          />
                        );
                      }
                    }}
                  />
                  <div className="h-1">
                    {errors[field.name] && (
                      <p style={{ color: "orangered", fontSize: "13px" }}>
                        {errors[field.name]?.message?.toString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            {selectedRecordId ? (
              <div className="grid col-span-2 w-full">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-serif"
                >
                  {editButtonLoader ? "Updating..." : "Update"}
                </Button>
              </div>
            ) : (
              <div className="grid col-span-2 w-full">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-serif"
                >
                  {buttonLoader ? "Submitting..." : "Submit"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
