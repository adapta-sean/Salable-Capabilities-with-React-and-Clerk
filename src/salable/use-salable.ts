import {useContext} from "react";
import {SalableContext} from "./salable-context.tsx";

export const useSalable = () => useContext(SalableContext);
