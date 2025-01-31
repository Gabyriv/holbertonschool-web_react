import { RowID, RowElement } from "../interface";
import { updateRow } from "./crud";

export function insertRow(row: RowElement);
export function deleteRow(rowID: RowID);
export function updateRow(rowId: RowID, row: RowElement);
