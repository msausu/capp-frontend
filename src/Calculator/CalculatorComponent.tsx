
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import LogoutIcon from '@mui/icons-material/Logout';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import "./CalculatorComponent.css";

import BalanceService from "./BalanceService";
import RecordLog from '../Record/RecordReportComponent';
import useRemoteCalculatorService from './CalculatorService';
import { useModal } from '../Record/ReportController';


interface LogoutProps {
  onLogout: () => void;
}

const Calculator: React.FC<LogoutProps> = ({onLogout}) => {

  const [result, setResult] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [dot, setDot] = useState<boolean>(false);
  const [help, setHelp] = useState<boolean>(false);
  const [operation, setOperation] = useState<string>("");
  const getResult = () => result;
  const { doOperationRemote, doRandomRemote } = useRemoteCalculatorService({ getResult, setBalance, setResult });
  const { dispatch } = useModal();


  const getElementByIdAsync = (id: string) => new Promise(resolve => {
    const getElement = () => {
      const element = document.getElementById(id);
      if (element) {
        resolve(element);
      } else {
        requestAnimationFrame(getElement);
      }
    };
    getElement();
  });

  const isElementPresent = async (id: string) => {
    await getElementByIdAsync(id);
  }

  const handleLog = () => {
    const id = 'modal-init-button';
    dispatch({ type: 'OPEN_REPORT' });
    isElementPresent(id).then(() => {
      document.getElementById(id)?.click();
    })
  };

  const handleLogout = () => {
    sessionStorage.setItem('username', '');
    sessionStorage.setItem('password', '');
    onLogout();
  };

  const debounce = <T extends (...args: unknown[]) => unknown>(callback: T) => {
    let timer: NodeJS.Timeout | undefined;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback.apply(this, args);
      }, 300);
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAlgarism = debounce((e: any) => {
    if (/[a-zA-Z ]/.test(result)) return;
    if (result.length >= 32) {
      setResult("input > 31 chars");
      setTimeout(() => {
        setResult("");
      }, 2000);
      return;
    }
    if (e.target.name == "." && dot) return;
    if (e.target.name == "." && !dot) {
      setResult(result.concat(e.target.name));
      setDot(true);
      return;
    }
    let vresult: string = result;
    if (operation.length == 0 && result.charAt(0) === "0") {
      vresult = result.slice(1, result.length);
    }
    setResult(vresult.concat(e.target.name));
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOperation = (e: any) => {
    if (/[a-zA-Z ]/.test(result)) return;
    const op = e.target.name;
    const isDot = op == ".";
    const isPlus = op == "+";
    const isMinus = op == "-";
    const isDivide = op == "/";
    const isTimes = op == "*";
    const isSquareRoot = op == "√";
    const hasSquareRoot = result.length > 0 && result.charAt(0) == "√";
    const hasOperation = result.length > 0 && op != "-" && operation.length > 0;
    if (/[\d.]+$/.test(result) && hasSquareRoot) {
      return;
    }
    if (/^[\d.]+$/.test(result) && isSquareRoot) {
      setResult("√" + result);
      return;
    }
    if (result.length == 1 && isDot) {
      return;
    }
    if (hasOperation || hasSquareRoot) {
      return;
    }
    if (result.length == 0 && (isPlus || isTimes || isDivide)) {
      return;
    }
    if (isMinus) {
      if (hasSquareRoot || result.length == 0) {
        setResult(result.concat(op));
        return;
      }
      if (
        result.length > 2 &&
        result.charAt(result.length - 2) == "-" &&
        result.charAt(result.length - 1) == "-"
      ) {
        return;
      }
      if (
        result.length > 1 &&
        result.charAt(result.length - 1) == "-" &&
        /\d/.test(result.charAt(result.length - 2))
      ) {
        setOperation(op);
        setResult(result.concat(op));
        return;
      }
    }
    setOperation(op);
    setDot(false);
    setResult(result.concat(op));
  };

  const handleClear = () => {
    setDot(false);
    setOperation("");
    setResult("");
  };

  const handleBackspace = () => {
    if (/[a-zA-Z ]/.test(result)) return;
    if (
      result.length > 2 &&
      result.charAt(result.length - 2) == "-" &&
      result.charAt(result.length - 1) == "-"
    ) {
      setResult(result.slice(0, result.length - 1));
      return;
    }
    if (result.charAt(result.length - 1) == ".") {
      setDot(false);
    }
    for (const op of ["√", "×", "/", "+", "-"]) {
      if (result.charAt(result.length - 1) == op) {
        setOperation("");
        break;
      }
    }
    setResult(result.slice(0, result.length - 1));
  };

  const randomString = () => {
    doRandomRemote();
  };

  const calculate = () => {
    if (
      result.length == 0 ||
      (result.length > 0 && result.charAt(result.length - 1) == ".")
    ) {
      return;
    }
    try {
      setOperation("");
      const vresult = result;
      if (vresult.includes("+")) {
        doOperationRemote({
          operation: "ADDITION",
          amount: vresult.replace("+", " "),
        });
      } else if (vresult.includes("×")) {
        doOperationRemote({
          operation: "MULTIPLICATION",
          amount: vresult.replace("×", " "),
        });
      } else if (vresult.includes("÷")) {
        doOperationRemote({
          operation: "DIVISION",
          amount: vresult.replace("÷", " "),
        });
      } else if (vresult.includes("√")) {
        doOperationRemote({
          operation: "SQUARE_ROOT",
          amount: vresult.replace("√", ""),
        });
      } else if (vresult.includes("-")) {
        if (vresult.includes("--")) {
          doOperationRemote({
            operation: "SUBTRACTION",
            amount: vresult.replace("--", " "),
          });
        } else {
          doOperationRemote({
            operation: "SUBTRACTION",
            amount: vresult.replace("-", " "),
          });
        }
      }
    } catch (err) {
      setResult("Error: " + err);
    }
  };

  return (
    <div>
      <BalanceService setBalance={setBalance} onLogout={onLogout} />
      <Dialog onClose={() => setHelp(false)} open={help} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <DialogTitle>Operation Costs</DialogTitle>
        <List dense={true}>
          <ListItem>√ Square Root: 0.75</ListItem>
          <ListItem>× Multiplication: 0.2</ListItem>
          <ListItem>÷ Divison: 0.5</ListItem>
          <ListItem>+ Sum:0.1</ListItem>
          <ListItem>- Subtraction: 0.1</ListItem>
          <ListItem>8 random digits: 1.5</ListItem>
          <ListItem>☰ log records: 0</ListItem>
        </List>
      </Dialog>
      <RecordLog/>
      <Typography variant="h6" sx={{ color: '#333333'}}>
      Balance: {balance}
      </Typography>
      <div className="container">
        <form action="">
          <input type="text" value={result} readOnly />
        </form>
        <div className="keypad">
          {" "}
          <button onClick={() => setHelp(true)} className="color">
           ?
          </button>
          <button onClick={handleClear} className="color">
            ⇤
          </button>
          <button onClick={handleBackspace} className="backspace color">
            ←
          </button>
          <button onClick={handleLogout} className="color">
            <LogoutIcon/>
          </button>
          <button name="log" onClick={handleLog} className="color">
           ☰
          </button>
          <button
            name="random_str"
            onClick={randomString}
            className="random-string color"
          >
           random
          </button>
          <button name="√" onClick={handleOperation} className="color">
            √
          </button>
          <button name="7" onClick={handleAlgarism}>
            7
          </button>
          <button name="8" onClick={handleAlgarism}>
            8
          </button>
          <button name="9" onClick={handleAlgarism}>
            9
          </button>
          <button name="×" onClick={handleOperation} className="color">
            ×
          </button>
          <button name="4" onClick={handleAlgarism}>
            4
          </button>
          <button name="5" onClick={handleAlgarism}>
            5
          </button>
          <button name="6" onClick={handleAlgarism}>
            6
          </button>
          <button name="÷" onClick={handleOperation} className="color">
            ÷
          </button>
          <button name="1" onClick={handleAlgarism}>
            1
          </button>
          <button name="2" onClick={handleAlgarism}>
            2
          </button>
          <button name="3" onClick={handleAlgarism}>
            3
          </button>
          <button name="+" onClick={handleOperation} className="color">
            +
          </button>
          <button name="0" onClick={handleAlgarism}>
            0
          </button>
          <button name="." onClick={handleAlgarism}>
            .
          </button>
          <button onClick={calculate} className="color">
            =
          </button>
          <button name="-" onClick={handleOperation} className="color">
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;


