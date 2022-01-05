import { Input } from "@govtechsg/tradetrust-ui-components";
import React, { useState } from "react";
import { FunctionComponent } from "react";
import Dropzone from "react-dropzone";
import { AccordionItem } from "../../../../UI/Accordion";
import { getFormValue } from "../../utils";
import { FormItemSchema } from "../types";

interface DemoCreateFormItemProps {
  onChange: (name: string, value: string) => void;
  formItem: FormItemSchema;
  formItemName: string;
  formItemIndex: number;
  data: Record<string, any>;
}

export const DemoCreateFormItem: FunctionComponent<DemoCreateFormItemProps> = ({
  formItem,
  formItemName,
  onChange,
  formItemIndex,
  data,
}) => {
  const renderProperties = () => {
    if (formItem.type === "object" && formItem.properties) {
      return Object.entries(formItem.properties).map(([name, item], index) => {
        //join by . delimiter to parse later
        const itemName = `${formItemName}.${name}`;

        return (
          <DemoCreateFormItem
            key={name}
            onChange={onChange}
            formItemName={itemName}
            formItem={item}
            formItemIndex={index}
            data={data}
          />
        );
      });
    }
  };

  const renderUpload = () => {
    const defaultValue = getFormValue(data, formItemName);

    const handleDrop = (acceptedFiles: any) => {
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(formItemName, reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    };

    return (
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div
            data-testid="form-item-dropzone"
            className={`h-48 cursor-pointer flex justify-center border-dashed border-2 rounded-xl border-cloud-100`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {defaultValue ? <img className="h-full" src={defaultValue} /> : <div>UPLOAD</div>}
          </div>
        )}
      </Dropzone>
    );
  };

  const RenderTextArea = () => {
    const [value, setValue] = useState(getFormValue(data, formItemName));
    if (formItem.type === "string") {
      return (
        <textarea
          disabled={formItem.options?.readonly}
          data-testid="form-item-textarea"
          rows={4}
          className="w-full border rounded-md px-2 py-1 mb-0 focus:border-cloud-900 focus:outline-none placeholder-cloud-200 border-cloud-200"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.name, e.target.value);
          }}
          name={formItemName}
          placeholder={formItem.uiType === "withoutLabel" ? formItem.title : undefined}
        />
      );
    }
  };

  const RenderInput = () => {
    const [value, setValue] = useState(getFormValue(data, formItemName));
    if (formItem.type === "string") {
      return (
        <Input
          disabled={formItem.options?.readonly}
          data-testid="form-item-input"
          className="w-full"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.name, e.target.value);
          }}
          name={formItemName}
          placeholder={formItem.uiType === "withoutLabel" ? formItem.title : undefined}
        />
      );
    }
  };

  const [openIndex, setOpenIndex] = useState(-1);

  switch (formItem.uiType) {
    case "accordion":
      return (
        <AccordionItem
          classNameContent="pt-6"
          classNameContainer="py-5 border-t border-cloud-300"
          heading={formItem.title}
          headingTag="h3"
          openIndex={openIndex}
          accordionIndex={formItemIndex}
          setOpenIndex={setOpenIndex}
        >
          {RenderInput()}
          {renderProperties()}
        </AccordionItem>
      );
    case "withLabel":
      return (
        <div className="mb-5">
          <h4 data-testid="form-item-label" className="mb-1">
            {formItem.title}
          </h4>
          {RenderInput()}
          {renderProperties()}
        </div>
      );
    case "withoutLabel":
      return (
        <div className="mb-5">
          {RenderInput()}
          {renderProperties()}
        </div>
      );
    case "textarea":
      return (
        <div className="mb-5">
          {RenderTextArea()}
          {renderProperties()}
        </div>
      );
    case "upload":
      return (
        <div className="mb-5">
          {renderUpload()}
          {renderProperties()}
        </div>
      );
    default:
      return null;
  }
};
