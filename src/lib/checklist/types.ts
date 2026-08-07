export interface ChecklistItemState {
  checklistId: string;
  label: string;
  checked: boolean;
}

export interface ChecklistRunPayload {
  items: ChecklistItemState[];
}
