/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import postData from "@/api/postData.api";
import { formSchema } from "../schema/formSchema";
import { useEffect, useState } from "react";
import PayloadModify from "@/components/ui/sharedComponents/Utility/PayloadModify";
import toast from "react-hot-toast";
import getData from "@/api/getData.api";
import { SaleTabInterface } from "@/components/Service-Sessions/types";
import { useFetchDataContext } from "@/components/context/fetchTableDataContext";
import getDataById from "@/api/getDataById.api";
import updateData from "@/api/updateData.api";

const useMakeSale = () => {
  // state for button loadewr
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [errTable, setErrTable] = useState<boolean>(false);
  const [errTableData, seterrTableData] = useState<any[]>([]);
  const {
    isRefresh,
    setIsRefresh,
    selectedRecordId,
    setSelectedRecordId,
    sheetOpen,
    setSheetOpen,
    resetFormData,
    setResetFormData,
    footerData,
    setFooterData,
  } = useFetchDataContext();
  //**************Item details tab *********************************************
  const [selectedData, setSelectedData] = useState<SaleTabInterface[]>([]);
  //state to store searchBox Data
  const [searchBoxData, setSearchBoxData] = useState<any[]>([]);
  const searchBoxSchema: { [key: string]: { name: string; cb: Function } } = {
    code: {
      name: "ID",
      cb: (row: any) => row.code,
    },
    name: {
      name: "Name",
      cb: (row: any) => row.name,
    },
    amount: {
      name: "Price",
      cb: (row: any) => row.amount,
    },
    available: {
      name: "Available",
      cb: (row: any) => row?.inStock?.quantity,
    },
  };
  //empty tab object
  const emptyTabObj: SaleTabInterface = {
    id: 0,
    txnHeader: { id: 0 }, // SaleHeaders object reference (null initially)
    service: { id: 0, name: "" }, // Services object reference (null initially)
    tax: { id: 0, percentage: 0, name: "" }, // Taxes object reference (null initially)
    quantity: 0, // Default quantity
    rate: 0, // Default rate
    amount: 0, // Default amount
    discountAmount: 0, // Optional, set as null
    costPrice: 0,
    taxAmount: 0, // Optional, set as null
    createdDate: "", // Default string (should be populated on creation)
    modifiedDate: "", // Default string (should be populated on update)
  };
  useEffect(() => {
    //fetch your searchBoxData
    async function init() {
      const apiFilter = {
        relations: [
          {
            name: "tax",
          },
          {
            name: "inStock",
            fields: {
              quantity: true,
            },
          },
        ],
        where: {
          isService: 0,
        },
      };
      const response: any = await getData("/services", apiFilter);
      setSearchBoxData(response.data);
    }
    init();
  }, []);

  //1. handle data change from tabs
  const handlFormFieldStateUpdate = (row: any, index: number) => {
    const _selectedData = selectedData;
    const foundIndex = _selectedData.findIndex((data) => data.id === index);
    const _newData = { ..._selectedData[foundIndex], ...row };
    _selectedData[foundIndex] = _newData;
    setSelectedData(_selectedData);
  };

  //2. select new item from
  const selectNewItem = (row: any) => {
    const id = "new" + Date.now() + Math.random().toString(36).slice(2, 9);
    const _selectedData = selectedData;
    const newEntry: SaleTabInterface = {
      ...emptyTabObj,
      ...{
        id: id,
        service: { id: row.id, name: row.name },
        tax: {
          id: row.tax.id,
          percentage: row.tax.percentage,
          name: row.tax.name,
        },
        quantity: 1,
        rate: row.amount,
        costPrice: Number(row.costPrice),
        amount: row.amount + row.taxAmount,
        taxAmount: row.taxAmount,
      },
    };
    selectedData.push(newEntry);
    setSelectedData(_selectedData);

    setFooterData({
      ...footerData,
      grandTotal: footerData.grandTotal + newEntry.amount,
      subtotal: footerData.subtotal + newEntry.rate,
      totalTax: footerData.totalTax + newEntry.taxAmount,
    });
  };

  //3. delete selected items
  const removeSelectedItems = (selectedItems: any[]) => {
    const _selectedData = selectedData;
    const newData = _selectedData.filter((val) => {
      if (val.id && selectedItems.includes(val.id)) {
        setFooterData({
          ...footerData,
          subtotal: footerData.subtotal - val.rate * val.quantity,
          totalTax: footerData.totalTax - val.taxAmount,
          totalDiscount: Number(footerData.totalDiscount - val.discountAmount),
        });
      }
      return !selectedItems.includes(val.id);
    });

    setSelectedData(newData);
  };

  //**************Item details tab end ****************************************

  useEffect(() => {
    let response: any;
    const fetchEdiData = async () => {
      const apiFilter = {
        fields: {
          id: true,
        },
        relations: [
          {
            name: "saleLines",
            relations: [
              {
                name: "service",
                fields: {
                  id: true,
                  name: true,
                },
              },
              {
                name: "txnHeader",
                fields: {
                  id: true,
                  name: true,
                },
              },
              {
                name: "tax",
                fields: {
                  id: true,
                  name: true,
                  percentage: true,
                },
              },
            ],
          },
        ],
      };
      response = await getDataById(
        formSchema.getUrl,
        selectedRecordId,
        apiFilter
      );

      const filterData = response?.data?.saleLines.map(
        (val: SaleTabInterface): SaleTabInterface => {
          return {
            id: val.id,
            txnHeader: { id: val?.txnHeader?.id }, // SaleHeaders object reference (null initially)
            service: { id: val.service.id, name: val.service.name }, // Services object reference (null initially)
            tax: {
              id: val.tax.id,
              percentage: val.tax.percentage,
              name: val.tax.name,
            }, // Taxes object reference (null initially)
            quantity: val.quantity, // Default quantity
            rate: val.rate, // Default rate
            amount: val.amount, // Default amount
            discountAmount: val.discountAmount, // Optional, set as null
            costPrice: val.costPrice,
            taxAmount: val.taxAmount, // Optional, set as null
            createdDate: val.createdDate, // Default string (should be populated on creation)
            modifiedDate: val.modifiedDate, // Default string (should be populated on update)
          };
        }
      );
      setSelectedData(filterData);
    };
    if (selectedRecordId) {
      try {
        fetchEdiData();
      } catch (e) {}
    } else {
      setSelectedData([]);
    }
  }, [selectedRecordId]);
  // On submit handler to saving new record
  const handleSubmit = async (data?: any) => {
    // Following utility will modify payload for isInactive and dropdown ids and add created and modifiedDate
    const payload = PayloadModify(formSchema, { ...data, isService: 0 });
    try {
      setButtonLoader(true);
      // const filterData = selectedData.map(({ id, ...rest }) => rest);
      const filterData = selectedData.map((val) => {
        if (`${val.id}`.startsWith("new")) {
          const { id, txnHeader, ...rest } = val;
          return {
            ...rest,
            unitPrice: Number(val.amount / val.quantity),
            createdDate: new Date(),
            modifiedDate: new Date(),
          };
        } else {
          return { ...val,  unitPrice: Number(val.amount / val.quantity),createdDate: new Date(), modifiedDate: new Date() };
        }
      });
      let response = null;
      if (selectedRecordId) {
        response = await updateData(
          formSchema.postUrl,
          {
            ...payload,
            ...{
              id: selectedRecordId,
              subTotal: footerData.subtotal,
              totalTax: footerData.totalTax,
              grandTotal:
                footerData.subtotal +
                footerData.totalTax -
                footerData.totalDiscount,
              totalDiscount: footerData.totalDiscount,
              // user: {
              //   id: userData.userId,
              // },
            },
            saleLines: filterData,
          },
          selectedRecordId
        );
      } else {
        response = await postData(formSchema.postUrl, {
          ...payload,
          ...{
            subTotal: footerData.subtotal,
            totalTax: footerData.totalTax,
            grandTotal:
              footerData.subtotal +
              footerData.totalTax -
              footerData.totalDiscount,
            totalDiscount: footerData.totalDiscount,
            // user: {
            //   id: userData.userId,
            // },
          },
          saleLines: filterData,
        });
      }

      if (response) {
        setSheetOpen(!sheetOpen);
        setButtonLoader(false);
        setIsRefresh(!isRefresh);
        setResetFormData(!resetFormData);
        setSelectedRecordId(null);
        setSelectedData([]);
        toast.success("Record added successfully..!");
      }
    } catch (err: any) {
      if (err) {
        if (err.response.status === 409) {
          setErrTable(true);
          seterrTableData(err.response.data.message);
        }
        setButtonLoader(false);
        toast.error("Error while saving record, Please try again!");
      }
    }
  };

  return {
    handleSubmit,
    buttonLoader,
    handlFormFieldStateUpdate,
    selectedData,
    setSelectedData,
    selectNewItem,
    removeSelectedItems,
    searchBoxData,
    searchBoxSchema,
    footerData,
    setFooterData,
    errTable,
    setErrTable,
    errTableData,
  };
};
export default useMakeSale;
