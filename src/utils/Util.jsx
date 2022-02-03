import swal from "sweetalert";
import moment from "moment";

export const AppConst = {
  DateFormat: "DD/MM/YYYY",
  TimeFormat: "hh:mm A",
  ProjectTitle: "Rental-App",
  AppName: "Rental-App",
  SavedSuccessfullyMsg: "Record saved successfully.",
  SaveErrorMsg: "Record could not be saved.",
  AddedSuccessfullyMsg: "Record added successfully.",
  UpdatedSuccessfullyMsg: "Changes updated successfully.",
  DeletedSuccessfullyMsg: "Record deleted successfully.",
  DeletedErrorMsg: "Record could not be deleted.",
  ProcessSuccessfullyMsg: "Record process successfully.",
  IntMinValue: -2147483648,
  MinDateValue: "01/01/0001",
};

export const HideWait = () => {
  let element = document.getElementsByClassName("loadingparent");
  if (element.length && element[0].parentNode) {
    for (let i = 0; i < element.length; i++) {
      element[0].parentNode.removeChild(element[i]);
    }
  }
};

export const ShowWait = () => {
  HideWait();
  let div = document.createElement("div");
  div.className = "loadingparent";
  div.innerHTML = "<div class='ball'></div><div class='ball1'></div>";
  document.body.appendChild(div);
};

export const ShowMessageBox = (config) => {
  config = config || {};
  swal({
    title: config.title,
    text: config.text,
    icon: "info",
    buttons: {
      confirm: {
        text: "Ok",
        value: true,
        visible: true,
        className: "bg-info",
        closeModal: true,
      },
    },
  }).then(function () {
    if (config.onClose) config.onClose();
  });
};

export const ShowConfirmBox = (config) => {
  config = config || {};
  swal({
    title: config.title,
    text: config.text,
    icon: "warning",
    buttons: {
      cancel: {
        text: "No",
        value: false,
        visible: true,
        className: "bg-info",
        closeModal: true,
      },
      confirm: {
        text: "Yes",
        value: true,
        visible: true,
        className: "bg-danger",
        closeModal: true,
      },
    },
  }).then(function (isConfirm) {
    if (isConfirm) {
      if (config.onOkClick) config.onOkClick();
    } else {
      if (config.onCancelClick) config.onCancelClick();
    }
  });
};

export const HasException = (data, printMessage) => {
  if (data && data.Status) {
    switch (data.Status) {
      case "UNAUTHORIZED":
        window.location.href = "/";
        return true;
      case "APP_ERROR":
      case "BAD_REQUEST":
      case "NOT_FOUND":
      case "NO_CONTENT":
      case "INTERNAL_ERROR":
      case "CONNECT_ERROR":
      case "FAILURE":
      case "SERVICE_UNAVAILABLE":
      case "CONNECT_TIMEOUT":
      case "VALIDATION":
        if (data.Message && printMessage) printMessage(data.Message);
        return true;
      default:
        return false;
    }
  }
  return false;
};

export const ParseError = (responseText) => {
  if (typeof responseText === "object") {
    let msg = "";
    responseText.forEach((value) => {
      msg += `${value}`;
    });
    return msg;
  } else {
    let findex = responseText.indexOf("<title>");
    let sindex = responseText.indexOf("</title>");
    return responseText.substring(findex + 7, sindex).replace("924", "");
  }
};

export const IsObject = (o) => {
  return o !== null && typeof o === "object" && Array.isArray(o) === false;
};

export const IsObjectEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

export const ObjectAssign = (target, source) => {
  Object.keys(target).forEach((key) => {
    delete target[key];
  });
  Object.keys(source).forEach((key) => {
    target[key] = source[key];
  });
};

export const RoundNumber = (num, dec) => {
  return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
};

export const GetErrorMessage = (error) => {
  if (!error) return "";
  let message = "";
  Object.keys(error).forEach((key) => {
    switch (key) {
      case "required":
        message += "This field is required!";
        break;
      case "email":
        message += "Field must be valid email!";
        break;
      case "number":
        message += "Field must be valid number!";
        break;
      case "integer":
        message += "Field must be valid integer!";
        break;
      case "alphanum":
        message += "Field must be valid alphanum!";
        break;
      case "url":
        message += "Field must be valid url!";
        break;
      default:
        message += "";
    }
  });
  return message;
};

export const GetElementsByTagNames = (tags, parent) => {
  if (!parent) parent = document.body;
  let tagNames = tags.split(",");
  let resultArray = [];
  for (let i = 0; i < tagNames.length; i++) {
    let tags = parent.getElementsByTagName(tagNames[i]);
    for (let j = 0; j < tags.length; j++) {
      resultArray.push(tags[j]);
    }
  }
  return resultArray;
};

export const NumericKeyPress = (e) => {
  if (e.keyCode === 32) {
    e.preventDefault();
  }
};

export const NumericKeyDown = (e) => {
  let scale = 0;
  if (e.target.attributes.getNamedItem("scale"))
    scale = e.target.attributes.getNamedItem("scale").value;
  const value = e.target.value;
  const input = e.target;
  const keys = [46, 8, 9, 27, 13, 109, 173, 189];
  if (scale > 0) {
    keys.push(110);
    keys.push(190);
  }
  // Allow: backspace, delete, tab, escape, enter and .
  if (
    keys.indexOf(e.keyCode) !== -1 ||
    // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Ctrl+A
    ((e.keyCode === 65 ||
      e.keyCode === 86 ||
      e.keyCode === 88 ||
      e.keyCode === 90 ||
      e.keyCode === 67) &&
      (e.ctrlKey === true || e.metaKey === true)) ||
    // Allow: home, end, left, right, down, up
    (e.keyCode >= 35 && e.keyCode <= 40)
  ) {
    // let it happen, don't do anything
    if ((e.keyCode === 110 || e.keyCode === 190) && value.indexOf(".") !== -1) {
      e.preventDefault();
    } else if (e.keyCode === 109 || e.keyCode === 173 || e.keyCode === 189) {
      var pos = GetCaretPosition(input);
      if (pos.end !== 0 || value.indexOf("-") !== -1) e.preventDefault();
      else return;
    } else return;
  }
  // Ensure that it is a number and stop the keypress
  if (
    (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
    (e.keyCode < 96 || e.keyCode > 105)
  ) {
    e.preventDefault();
  }
  if (scale > 0) {
    let curPos = GetCaretPosition(input);
    if (curPos.start !== curPos.end) return;
    let prevText = GetPrevText(value, curPos.end);
    if (prevText.indexOf(".") !== -1) {
      let decimalCheck = value.split(".");
      if (typeof decimalCheck[1] !== "undefined") {
        if (decimalCheck[1].length > 1) e.preventDefault();
      }
    }
  }
};

const GetCaretPosition = (el) => {
  let start = 0,
    end = 0,
    normalizedValue,
    range,
    textInputRange,
    len,
    endRange;
  if (
    typeof el.selectionStart === "number" &&
    typeof el.selectionEnd === "number"
  ) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else if (document.selection) {
    range = document.selection.createRange();

    if (range && range.parentElement() === el) {
      len = el.value.length;
      normalizedValue = el.value.replace(/\r\n/g, "\n");

      // Create a working TextRange that lives only in the input
      textInputRange = el.createTextRange();
      textInputRange.moveToBookmark(range.getBookmark());

      // Check if the start and end of the selection are at the very end
      // of the input, since moveStart/moveEnd doesn't return what we want
      // in those cases
      endRange = el.createTextRange();
      endRange.collapse(false);

      if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
        start = end = len;
      } else {
        start = -textInputRange.moveStart("character", -len);
        start += normalizedValue.slice(0, start).split("\n").length - 1;

        if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
          end = len;
        } else {
          end = -textInputRange.moveEnd("character", -len);
          end += normalizedValue.slice(0, end).split("\n").length - 1;
        }
      }
    }
  }

  return {
    start: start,
    end: end,
  };
};

const GetPrevText = (text, caretPos) => {
  const preText = text.substring(0, caretPos);
  return preText;
};

export const OnBooleanTemplate = (rowData, props) => {
  if (typeof rowData[props.field] === "boolean") {
    return rowData[props.field] ? "True" : "False";
  } else {
    return rowData[props.field];
  }
};

export const OnRowIndexTemplate = (rowData, props) => {
  return props.rowIndex + 1;
};

export const GetDays = (fromDate, todate) => {
  try {
    const startDate = moment(fromDate, AppConst.DateFormat);
    const endDate = moment(todate, AppConst.DateFormat);
    return endDate.diff(startDate, "days");
  } catch (ex) {
    return undefined;
  }
};
