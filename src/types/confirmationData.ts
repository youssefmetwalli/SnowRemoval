type ConfirmationData = {
  workDate?: string;
  workplace?: string;
  workClassification?: string;
  startTime?: string;
  endTime?: string;
  mainPerson?: string;
};

export interface InputConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void | Promise<void>;
  data: ConfirmationData;
}
