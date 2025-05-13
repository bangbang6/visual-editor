import { message } from "ant-design-vue";
import axios from "axios";
import html2canvas from "html2canvas";
import { RespUploadData } from "./store/respTypes";
import { saveAs } from "file-saver";

interface CheckCondition {
  format?: string[];
  // 使用多少 M 为单位
  size?: number;
}
type ErrorType = "size" | "format" | null;
export function beforeUploadCheck(file: File, condition: CheckCondition) {
  const { format, size } = condition;
  const isValidFormat = format ? format.includes(file.type) : true;
  const isValidSize = size ? file.size / 1024 / 1024 < size : true;
  let error: ErrorType = null;
  if (!isValidFormat) {
    error = "format";
  }
  if (!isValidSize) {
    error = "size";
  }
  return {
    passed: isValidFormat && isValidSize,
    error,
  };
}
export const commonUploadCheck = (file: File) => {
  const result = beforeUploadCheck(file, {
    format: ["image/jpeg", "image/png"],
    size: 1,
  });
  const { passed, error } = result;
  if (error === "format") {
    message.error("上传图片只能是 JPG/PNG 格式!");
  }
  if (error === "size") {
    message.error("上传图片大小不能超过 1Mb");
  }
  return passed;
};
export const getImageDimensions = (url: string | File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.src = typeof url === "string" ? url : URL.createObjectURL(url);
    img.addEventListener("load", () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      resolve({ width, height });
    });
    img.addEventListener("error", () => {
      reject(new Error("There was some problem with the image."));
    });
  });
};
export interface UploadImgProps {
  data: {
    urls: string[];
  };
  errno: number;
  file: File;
}
export const insertAt = (arr: any[], index: number, newItem: any) => {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
};
export function clickInsideElement(e: Event, className: string) {
  let el = e.target as HTMLElement;
  if (el.classList.contains(className)) {
    return el;
  } else {
    while (el) {
      if (el.classList && el.classList.contains(className)) {
        return el;
      } else {
        el = el.parentNode as HTMLElement;
      }
    }
  }
  return false;
}
export function isMobile(mobile: string) {
  return /^1[3-9]\d{9}$/.test(mobile);
}
function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
}
export async function uploadFile<R = any>(
  file: Blob,
  url = "utils/upload-img",
  fileName = "screenShot.png"
) {
  const newFile = file instanceof File ? file : new File([file], fileName);
  const formData = new FormData();
  formData.append(newFile.name, newFile);
  const data = await axios.post<R>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
export async function takeScreenShotAndUpload(ele: HTMLElement) {
  const canvas = await html2canvas(ele, {
    width: 475,
    scale: 1,
    useCORS: true,
  });
  const canvasBlob = await getCanvasBlob(canvas);
  if (canvasBlob) {
    const data = await uploadFile<RespUploadData>(canvasBlob);
    return data;
  }
}
export const objToQueryString = (queryObj: { [key: string]: any }) => {
  return Object.keys(queryObj)
    .map((key) => `${key}=${queryObj[key]}`)
    .join("&");
};
export const toDateFormat = (date: Date) => {
  return date.toISOString().split("T")[0];
};

export const toDateFromDays = (date: Date, n: number) => {
  const newDate = new Date(date.getTime());
  newDate.setDate(date.getDate() + n);
  return newDate;
};

export const getDaysArray = (start: Date, end: Date) => {
  const arr: any = [];
  // eslint-disable-next-line no-unmodified-loop-condition
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

export const objToArr = <T>(obj: { [key: string]: T }) => {
  return Object.keys(obj).map((key) => obj[key]);
};
export const downloadImage = (url: string) => {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  saveAs(url, fileName);
};
export const imageDimensions = (file: File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    // the following handler will fire after the successful loading of the image
    img.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = img;
      resolve({ width, height });
    };
    // and this handler will fire if there was an error with the image (like if it's not really an image or a corrupted one)
    img.onerror = () => {
      reject(new Error("There was some problem with the image."));
    };
  });
};
